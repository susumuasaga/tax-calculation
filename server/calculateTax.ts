import {
  Transaction,
  CalculatedTax,
  CalculatedTaxSummary,
  ProcessingInfo,
  TaxByTypes,
  TaxDetails,
  Detail,
  TaxSummary,
  Line,
  Jurisdiction
} from './models/Transaction';
import { performance } from 'perf_hooks';
import { Entity } from './models/Entity';

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
      line.itemPrice * line.numberOfItems;
    otherCosts = (line.otherCostAmount !== undefined) ?
      line.otherCostAmount :
      0;
    discount = (line.lineDiscount !== undefined) ?
      line.lineDiscount :
      0;
    calculatedTaxSummary.numberOfLines += 1;
    calculatedTaxSummary.subtotal += currencyTrunc(amount - discount);
    calculateCST();
    calculateIEC();
    calculateIST();
    calculateISC();
    calculatedTaxSummary.totalTax += calculatedTax.tax;
  }
  calculatedTaxSummary.grandTotal =
    calculatedTaxSummary.subtotal + calculatedTaxSummary.totalTax;
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
    if (line.item.productType === 'merchandise') {
      calculatedTax.CST = '50';
    } else {
      calculatedTax.CST = '99';
    }
  } else {
    if (receiver.type === 'cityGovernment') {
      calculatedTax.CST = '34';
    } else if (receiver.type === 'stateGovernment') {
      calculatedTax.CST = '35';
    } else if (receiver.type === 'federalGovernment') {
      calculatedTax.CST = '36';
    } else {
      throw new Error('Not implemented');
    }
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
    if (useType === 'use' || useType === 'consumption') {
      throw new Error('Not implemented.');
    } else if (useType === 'resale' || useType === 'production') {
      throw new Error('Not implemented.');
    } else {
      const item = line.item;
      if (item.productType === 'merchandise') {
        calculationSimple(taxDetail, item.federalTax.IEC.rate);
      } else {
        calculationExempt(taxDetail);
      }
    }
  }
  calculateSummary(taxDetail.tax, taxSummary);
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
    if (line.useType === 'resale') {
      throw new Error('Not implemented.');
    } else if (line.useType === 'production') {
      throw new Error('Not implemented.');
    } else {
      // line.useType not in {'resale', 'production'}
      const item = line.item;
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
  calculateSummary(taxDetail.tax, taxSummary);
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
  calculateSummary(taxDetail.tax, taxSummary);
}

function calculationExempt(taxDetail: Detail): void {
  taxDetail.scenario = 'Calculation Exempt';
  taxDetail.calcBase = currencyTrunc(amount + otherCosts - discount);
  taxDetail.rate = 0;
  taxDetail.fact = 0;
  taxDetail.tax = 0;
}

function calculationFixed(taxDetail: Detail, rate: number, fact: number): void {
  taxDetail.scenario = 'Calculation Fixed';
  taxDetail.calcBase = amount + otherCosts;
  taxDetail.rate = rate;
  taxDetail.fact = fact;
  taxDetail.tax =
    currencyTrunc(taxDetail.calcBase * (1 - fact) * rate);
}

function calculationSimple(taxDetail: Detail, rate: number): void {
  taxDetail.scenario = 'Calculation Simple';
  taxDetail.calcBase = currencyTrunc(amount + otherCosts - discount);
  taxDetail.rate = rate;
  taxDetail.fact = 0;
  taxDetail.tax = currencyTrunc(taxDetail.calcBase * rate);
}

function currencyTrunc(x: number): number {
  return Math.floor(x * 100) * 0.01;
}

function calculateSummary(tax: number, taxSummary: TaxSummary): void {
  line.calculatedTax.tax += tax;
  taxSummary.tax += tax;
  taxSummary.jurisdictions[0].tax += tax;
}
