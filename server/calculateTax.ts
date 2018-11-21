import { datatypes } from 'express-cassandra';

import {
  Transaction,
  CalculatedTax,
  CalculatedTaxSummary,
  ProcessingInfo,
  TaxByTypes,
  TaxDetails,
  Detail,
  TaxSummary,
  Line
} from './models/Transaction';
import { performance } from 'perf_hooks';
import { Entity } from './models/Entity';
import { items } from './spec/testDB';

export const VERSION_ID = '1.0';
let transaction: Transaction;
let emitter: Entity;
let receiver: Entity;
let line: Line;
let amount: number;
let otherCosts: number;
let discount: number;

/**
 * Adds the `CalculatedTaxSummary` and `ProcessingInfo`
 * data to a `Transaction`. As well as detail `CalculatedTax`
 * of each `Line`.
 * @param t
 *
 * The fields `header.location` and `lines.item`
 * must be added to the `Transaction` before calling this.
 */
export function calculateTax(t: Transaction): void {
  const ti = performance.now();
  transaction = t;
  initialize();
  const calculatedTaxSummary = transaction.calculatedTaxSummary;
  for (line of transaction.lines) {
    const taxDetails: TaxDetails = {
      iec: {
        jurisdictionType: 'Country',
        jurisdictionName: 'Brasil',
        taxType: 'IEC',
        scenario: 'To be determined',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      },
      ist: {
        jurisdictionType: 'State',
        jurisdictionName: receiver.address.state,
        taxType: 'IST',
        scenario: 'To be determined',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      },
      isc: {
        jurisdictionType: 'City',
        jurisdictionName: emitter.address.cityName,
        taxType: 'ISC',
        scenario: 'To be determined',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      }
    };
    const calculatedTax: CalculatedTax = {
      tax: 0,
      CST: '99', // To be determined
      taxDetails
    };
    line.calculatedTax = calculatedTax;
    amount = (line.lineAmount !== undefined) ?
      line.lineAmount :
      currencyRound(line.itemPrice * line.numberOfItems);
    otherCosts = (line.otherCostAmount !== undefined) ?
      line.otherCostAmount :
      0;
    discount = (line.lineDiscount !== undefined) ?
      line.lineDiscount :
      0;
    calculatedTaxSummary.numberOfLines += 1;
    calculatedTaxSummary.subtotal = currencySum(
      calculatedTaxSummary.subtotal,
      amount,
      - discount
    );
    calculateCST();
    calculateIEC();
    calculateIST();
    calculateISC();
    calculatedTaxSummary.totalTax = currencySum(
      calculatedTaxSummary.totalTax,
      calculatedTax.tax
    );
    delete line.item;
  }
  calculatedTaxSummary.grandTotal = currencySum(
    calculatedTaxSummary.subtotal,
    calculatedTaxSummary.totalTax
  );
  delete transaction.header.location;
  const tf = performance.now();
  transaction.processingInfo.duration = tf - ti;
}

function initialize(): void {
  const header = transaction.header;
  [emitter, receiver] = (header.transactionType === 'Sale') ?
    [header.location, header.entity] :
    [header.entity, header.location];
  const taxByType: TaxByTypes = {
    iec: {
      tax: 0,
      jurisdictions: [{
        jurisdictionType: 'Country',
        jurisdictionName: 'Brasil',
        tax: 0
      }]
    },
    ist: {
      tax: 0, jurisdictions: [{
        jurisdictionType: 'State',
        jurisdictionName: receiver.address.state,
        tax: 0
      }]
    },
    isc: {
      tax: 0, jurisdictions: [{
        jurisdictionType: 'City',
        jurisdictionName: emitter.address.cityName,
        tax: 0
      }]
    }
  };
  const calculatedTaxSummary: CalculatedTaxSummary = {
    numberOfLines: 0,
    subtotal: 0,
    totalTax: 0,
    grandTotal: 0,
    taxByType
  };
  transaction.calculatedTaxSummary = calculatedTaxSummary;
  const processingInfo: ProcessingInfo = { versionId: VERSION_ID, duration: 0 };
  transaction.processingInfo = processingInfo;
}

function calculateCST(): void {
  const calculatedTax = line.calculatedTax;
  if (emitter.taxRegime === 'individual') {
    cst50or99();
  } else {
    // emitter.taxRegime != 'individual'
    if (receiver.type === 'cityGovernment') {
      calculatedTax.CST = '34';
    } else if (receiver.type === 'stateGovernment') {
      calculatedTax.CST = '35';
    } else if (receiver.type === 'federalGovernment') {
      calculatedTax.CST = '36';
    } else {
      if (emitter.taxRegime === 'simplified') {
        cst50or99();
      } else {
        throw new Error('Not implemented.');
      }
    }
  }
}

function cst50or99(): void {
  const calculatedTax = line.calculatedTax;
  const item = line.item;
  if (item.productType === 'merchandise') {
    calculatedTax.CST = '50';
  } else {
    calculatedTax.CST = '99';
  }
}

function calculateIEC(): void {
  const taxDetail = line.calculatedTax.taxDetails.iec;
  const taxSummary = transaction.calculatedTaxSummary.taxByType.iec;
  taxDetail.jurisdictionType = 'Country';
  taxDetail.jurisdictionName = 'Brasil';
  taxDetail.taxType = 'IEC';
  const cst = line.calculatedTax.CST;
  if (cst >= '31' && cst <= '37') {
    calculationExempt(taxDetail);
  } else {
    const useType = line.useType;
    const item = line.item;
    if (useType === 'use' || useType === 'consumption') {
      if (receiver.address.state === emitter.address.state) {
        calculationSimple(taxDetail, item.federalTax.IEC.rate);
      } else {
        throw new Error('Not implemented.');
      }
    } else if (useType === 'resale' || useType === 'production') {
      tableOrSimple();
    } else {
      if (item.productType === 'merchandise') {
        calculationSimple(taxDetail, item.federalTax.IEC.rate);
      } else {
        calculationExempt(taxDetail);
      }
    }
  }
  calculateSums(taxDetail.tax, taxSummary);
}

function tableOrSimple(): void {
  const item = line.item;
  if (item.productType === 'product') {
    calculationTableIEC();
  } else {
    calculationSimple(
      line.calculatedTax.taxDetails.iec,
      item.federalTax.IEC.rate
    );
  }
}

const region: { [state: string]: string } = {
  AC: 'N',
  AM: 'N',
  AP: 'N',
  BA: 'NE',
  CE: 'NE',
  DF: 'CO',
  ES: 'SE',
  GO: 'CO',
  MA: 'NE',
  MT: 'CO',
  MS: 'CO',
  MG: 'SE',
  PA: 'N',
  PB: 'NE',
  PR: 'S',
  PE: 'NE',
  PI: 'NE',
  RN: 'NE',
  RS: 'S',
  RJ: 'SE',
  RO: 'N',
  RR: 'N',
  SC: 'S',
  SP: 'SE',
  SE: 'NE',
  TO: 'N'
};

const iecTable: { [region: string]: [number, number] } = {
  CO: [ 0.061, 0.0426 ],
  N: [ 0.045, 0.0393 ],
  NE: [ 0.0273, 0.0139 ],
  S: [ 0.0841, 0.0908 ],
  SE: [ 0.065, 0.0584 ]
};

function calculationTableIEC(): void {
  const taxDetail = line.calculatedTax.taxDetails.iec;
  taxDetail.scenario = 'Calculation Table';
  const calcBase = currencySum(amount, otherCosts, -discount);
  const rate = iecTable[region[receiver.address.state]][
    (receiver.address.state === emitter.address.state) ? 0 : 1
  ];
  const fact = line.item.federalTax.IEC.fact;
  taxDetail.calcBase = calcBase;
  taxDetail.rate = rate;
  taxDetail.fact = fact;
  taxDetail.tax = currencyRound(calcBase * (1 - fact) * rate);
}

function calculateIST(): void {
  const taxDetail = line.calculatedTax.taxDetails.ist;
  const taxSummary = transaction.calculatedTaxSummary.taxByType.ist;
  taxDetail.jurisdictionType = 'State';
  taxDetail.jurisdictionName = receiver.address.state;
  taxDetail.taxType = 'IST';
  const cst = line.calculatedTax.CST;
  if (cst === '35' || cst === '36') {
    calculationExempt(taxDetail);
  } else {
    // CST not in {'35, '36'}
    const item = line.item;
    if (line.useType === 'resale') {
      if (item.productType === 'product') {
        calculationTableIST();
      } else {
        calculationPeriodIST();
      }
    } else if (line.useType === 'production') {
      throw new Error('Not implemented.');
    } else {
      // line.useType not in {'resale', 'production'}
      if (item.productType === 'merchandise') {
        calculationSimple(taxDetail, item.federalTax.IST.rate);
      } else {
        // item.productType != 'product'
        const rate = 0.14;
        const fact = 0.08;
        calculationFixed(taxDetail, rate, fact);
      }
    }
  }
  calculateSums(taxDetail.tax, taxSummary);
}

const istTable: { [origin: string]: { [destination: string]: number } } = {
  AM: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  BA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.07,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.04,
    MT: 0.12,
    MS: 0.1,
    MG: 0.12,
    PA: 0.16,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.05,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  CE: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.07,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.04,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  ES: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.06,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.13,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  GO: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.05,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  MA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  MT: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.08,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  MG: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.09,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.17,
    SE: 0.12,
    TO: 0.12
  },
  PA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.13,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.13,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.13,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  PB: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  PR: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.18
  },
  PE: {
    AC: 0.12,
    AM: 0.09,
    AP: 0.12,
    BA: 0.12,
    CE: 0.1,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.06,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.05,
    RR: 0.12,
    SC: 0.16,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  RS: {
    AC: 0.08,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.05,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.13,
    RO: 0.12,
    RR: 0.07,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  RJ: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.09,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.11,
    MG: 0.12,
    PA: 0.16,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  SC: {
    AC: 0.09,
    AM: 0.12,
    AP: 0.09,
    BA: 0.12,
    CE: 0.11,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.05,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  SP: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  }
};

function calculationTableIST(): void {
  const taxDetails = line.calculatedTax.taxDetails;
  const taxDetail = taxDetails.ist;
  taxDetail.scenario = 'Calculation Table';
  const calcBase = currencySum(
    amount,
    otherCosts,
    -discount,
    taxDetails.iec.tax);
  const originTable = istTable[emitter.address.state];
  let rate = 0.08; // default rate
  if (originTable !== undefined) {
    rate = originTable[receiver.address.state];
  }
  const fact = line.item.federalTax.IST.fact;
  taxDetail.calcBase = calcBase;
  taxDetail.rate = rate;
  taxDetail.fact = fact;
  taxDetail.tax = currencyRound(calcBase * (1 - fact) * rate);
}

function calculationPeriodIST(): void {
  const taxDetail = line.calculatedTax.taxDetails.ist;
  taxDetail.scenario = 'Calculation Period';
  let calcBase: number;
  let rate: number;
  let fact: number;
  const month =
    datatypes.LocalDate.fromString(transaction.header.transactionDate).month;
  if (month >= 5 && month <= 8) {
    throw new Error('Not implemented.');
  } else {
    calcBase = currencySum(amount, -discount);
    const taxType = line.item.federalTax.IST;
    rate = taxType.rate;
    fact = taxType.fact;
  }
  taxDetail.month = (month < 10) ? `0${month}` : month.toString();
  taxDetail.calcBase = calcBase;
  taxDetail.rate = rate;
  taxDetail.fact = fact;
  taxDetail.tax = currencyRound(calcBase * (1 - fact) * rate);
}

function calculateISC(): void {
  const taxDetail = line.calculatedTax.taxDetails.isc;
  const taxSummary = transaction.calculatedTaxSummary.taxByType.isc;
  taxDetail.jurisdictionType = 'City';
  taxDetail.jurisdictionName = emitter.address.cityName;
  taxDetail.taxType = 'ISC';
  const cst = line.calculatedTax.CST;
  if (
    (new Set(['99', '34', '35', '36'])).has(cst) ||
    receiver.suframa !== undefined ||
    receiver.address.cityCode === 1302603
  ) {
    calculationExempt(taxDetail);
  } else {
    // CST not in {'99', '34', 35', '36'} &&
    // receiver.suframa === undefined
    // receiver.address.cityCode !== 1302603
    const item = line.item;
    if (item.productType === 'merchandise') {
      calculationSimple(taxDetail, item.federalTax.ISC.rate);
    } else {
      const rate = 0.02;
      const factor = 0.12;
      calculationFixed(taxDetail, rate, factor);
    }
  }
  calculateSums(taxDetail.tax, taxSummary);
}

function calculationExempt(taxDetail: Detail): void {
  taxDetail.scenario = 'Calculation Exempt';
  taxDetail.calcBase = currencySum(amount, otherCosts, -discount);
  taxDetail.rate = 0;
  taxDetail.fact = 0;
  taxDetail.tax = 0;
}

function calculationFixed(taxDetail: Detail, rate: number, fact: number): void {
  taxDetail.scenario = 'Calculation Fixed';
  taxDetail.calcBase = currencySum(amount, otherCosts);
  taxDetail.rate = rate;
  taxDetail.fact = fact;
  taxDetail.tax = currencyRound(
    taxDetail.calcBase * (1 - fact) * rate
  );
}

function calculationSimple(taxDetail: Detail, rate: number): void {
  taxDetail.scenario = 'Calculation Simple';
  taxDetail.calcBase = currencySum(amount, otherCosts, -discount);
  taxDetail.rate = rate;
  taxDetail.fact = 0;
  taxDetail.tax = currencyRound(taxDetail.calcBase * rate);
}

function calculateSums(tax: number, taxSummary: TaxSummary): void {
  line.calculatedTax.tax = currencySum(line.calculatedTax.tax, tax);
  taxSummary.tax = currencySum(taxSummary.tax, tax);
  taxSummary.jurisdictions[0].tax = currencySum(
    taxSummary.jurisdictions[0].tax,
    tax
  );
}

function currencyRound(x: number): number {
  return Math.round(x * 100) / 100;
}

function currencySum(...args: number[]): number {
  let sum = 0;
  for (const arg of args) {
    // sum is integer
    sum += Math.round(arg * 100);
  }

  return sum / 100;
}
