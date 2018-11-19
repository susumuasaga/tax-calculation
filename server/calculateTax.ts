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

export const VERSION_ID = '1.0';
let emitter: Entity;
let receiver: Entity;
let line: Line;
let amount: number;
let otherCosts: number;
let discount: number;
let calculatedTax: CalculatedTax;
let calculatedTaxSummary: CalculatedTaxSummary;

/**
 * Adds the `CalculatedTaxSummary` and `ProcessingInfo`
 * data to the `Transaction`. As well as detail `CalculatedTax`
 * of each `Line`.
 * @param transaction
 * Fields `header.location` and `lines.item` must be added to the `Transaction`
 * before calling this.
 */
export function calculateTax(transaction: Transaction): void {
  const ti = performance.now();
  const taxByType: TaxByTypes = {
    iec: { tax: 0, jurisdictions: [] },
    ist: { tax: 0, jurisdictions: [] },
    isc: { tax: 0, jurisdictions: [] }
  };
  calculatedTaxSummary = {
    numberOfLines: 0,
    subtotal: 0,
    totalTax: 0,
    grandTotal: 0,
    taxByType
  };
  transaction.calculatedTaxSummary = calculatedTaxSummary;
  const processingInfo: ProcessingInfo = { versionId: VERSION_ID, duration: 0 };
  transaction.processingInfo = processingInfo;
  const header = transaction.header;
  [emitter, receiver] = (header.transactionType === 'Sale') ?
    [header.location, header.entity] :
    [header.entity, header.location];
  for (line of transaction.lines) {
    const taxDetails: TaxDetails = {
      iec: {
        jurisdictionType: 'Country',
        jurisdictionName: 'Brasil',
        taxType: 'IEC',
        scenario: 'Calculation Exempt',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      },
      ist: {
        jurisdictionType: 'State',
        jurisdictionName: 'SP',
        taxType: 'IST',
        scenario: 'Calculation Exempt',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      },
      isc: {
        jurisdictionType: 'City',
        jurisdictionName: 'São Paulo',
        taxType: 'ISC',
        scenario: 'Calculation Exempt',
        calcBase: 0,
        rate: 0,
        fact: 0,
        tax: 0
      }
    };
    calculatedTax = {
      tax: 0,
      CST: '99',
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
    calculatedTaxSummary.subtotal += amount - discount;
    calculateCST();
    calculateIEC(taxDetails.iec, taxByType.iec);
    calculateIST(taxDetails.ist, taxByType.ist);
    calculateISC(taxDetails.isc, taxByType.isc);
    calculatedTaxSummary.totalTax += calculatedTax.tax;
  }
  calculatedTaxSummary.grandTotal =
    calculatedTaxSummary.subtotal + calculatedTaxSummary.totalTax;
  const tf = performance.now();
  transaction.processingInfo.duration = tf - ti;
}

function calculateCST(): void {
  const emitterIndividual = emitter.taxRegime === 'individual';
  const receiverCityGovernment = receiver.type === 'cityGovernment';
  if (!emitterIndividual && receiverCityGovernment) {
    calculatedTax.CST = '34';
  }
}

function calculateIEC(taxDetail: Detail, taxSummary: TaxSummary): void {
  taxDetail.jurisdictionType = 'Country';
  taxDetail.jurisdictionName = 'Brasil';
  taxDetail.taxType = 'IEC';
  if (calculatedTax.CST >= '31' && calculatedTax.CST <= '37') {
    calculationExempt(taxDetail);
  } else {
    throw new Error('Not implemented.');
  }
  calculateSummary(taxDetail, taxSummary);
}

function calculateIST(taxDetail: Detail, taxSummary: TaxSummary): void {
  const item = line.item;
  taxDetail.jurisdictionType = 'State';
  taxDetail.jurisdictionName = receiver.address.state;
  taxDetail.taxType = 'IST';
  if (calculatedTax.CST === '35' || calculatedTax.CST === '36') {
    calculationExempt(taxDetail);
  } else if (line.useType === 'resale') {
    // CST not in {'35, '36'} && line.useType == 'resale'
    throw new Error('Not implemented.');
  } else if (line.useType === 'production') {
    // CST not in {'35, '36'} && line.useType == 'production'
    throw new Error('Not implemented.');
  } else if (item.productType === 'merchandise') {
    // CST not in {'35, '36'} &&
    // line.useType not in {'resale', 'production'} &&
    // item.productType == 'merchandise'
    // Calculation Simple
    throw new Error('Not implemented.');
  } else {
    // CST not in {'35, '36'} &&
    // line.useType not in {'resale', 'production'} &&
    // item.productType == 'product'
    calculationFixed(taxDetail);
  }
  calculateSummary(taxDetail, taxSummary);
}

function calculationFixed(taxDetail: Detail): void {
  taxDetail.scenario = 'Calculation Fixed';
  taxDetail.calcBase = amount + otherCosts;
  taxDetail.rate = 0.14;
  taxDetail.fact = 0.08;
  taxDetail.tax = taxDetail.calcBase * (1 - taxDetail.fact) * taxDetail.rate;
}

function calculateISC(taxDetail: Detail, taxSummary: TaxSummary): void {
  const item = line.item;
  taxDetail.jurisdictionType = 'City';
  taxDetail.jurisdictionName = emitter.address.cityName;
  taxDetail.taxType = 'ISC';
  if (
    (new Set(['99', '34', '35', '36'])).has(calculatedTax.CST) ||
    receiver.suframa !== undefined ||
    receiver.address.cityCode === 1302603 // Manaus
  ) {
    calculationExempt(taxDetail);
  } else {
    // CST not in {'99', '34', 35', '36'} &&
    // receiver.suframa === undefined
    // receiver.address.cityCode !== 1302603
    throw new Error('Not implemented.');
  }
  calculateSummary(taxDetail, taxSummary);
}

function calculationExempt(taxDetail: Detail): void {
  taxDetail.scenario = 'Calculation Exempt';
  taxDetail.calcBase = amount + otherCosts - discount;
  taxDetail.rate = 0;
  taxDetail.fact = 0;
  taxDetail.tax = 0;
}

function calculateSummary(taxDetail: Detail, taxSummary: TaxSummary): void {
  calculatedTax.tax += taxDetail.tax;
  taxSummary.tax += taxDetail.tax;
  taxSummary.jurisdictions.push(
    {
      jurisdictionType: taxDetail.jurisdictionType,
      jurisdictionName: taxDetail.jurisdictionName,
      tax: taxDetail.tax
    }
  );
}
