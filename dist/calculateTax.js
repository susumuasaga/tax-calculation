"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
exports.VERSION_ID = '1.0';
let emitter;
let receiver;
let line;
let amount;
let otherCosts;
let discount;
let calculatedTax;
let calculatedTaxSummary;
function calculateTax(transaction) {
    const ti = perf_hooks_1.performance.now();
    const header = transaction.header;
    [emitter, receiver] = (header.transactionType === 'Sale') ?
        [header.location, header.entity] :
        [header.entity, header.location];
    const taxByType = {
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
        isc: { tax: 0, jurisdictions: [{
                    jurisdictionType: 'City',
                    jurisdictionName: emitter.address.cityName,
                    tax: 0
                }] }
    };
    calculatedTaxSummary = {
        numberOfLines: 0,
        subtotal: 0,
        totalTax: 0,
        grandTotal: 0,
        taxByType
    };
    transaction.calculatedTaxSummary = calculatedTaxSummary;
    const processingInfo = { versionId: exports.VERSION_ID, duration: 0 };
    transaction.processingInfo = processingInfo;
    for (line of transaction.lines) {
        const taxDetails = {
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
        calculatedTaxSummary.subtotal += currencyTrunc(amount - discount);
        calculateCST();
        calculateIEC(taxDetails.iec, taxByType.iec);
        calculateIST(taxDetails.ist, taxByType.ist);
        calculateISC(taxDetails.isc, taxByType.isc);
        calculatedTaxSummary.totalTax += calculatedTax.tax;
    }
    calculatedTaxSummary.grandTotal =
        calculatedTaxSummary.subtotal + calculatedTaxSummary.totalTax;
    const tf = perf_hooks_1.performance.now();
    transaction.processingInfo.duration = tf - ti;
}
exports.calculateTax = calculateTax;
function calculateCST() {
    if (emitter.taxRegime === 'individual') {
        if (line.item.productType === 'product') {
            calculatedTax.CST = '99';
        }
        else {
            throw new Error('Not implemented.');
        }
    }
    else {
        if (receiver.type === 'cityGovernment') {
            calculatedTax.CST = '34';
        }
        else if (receiver.type === 'stateGovernment') {
            calculatedTax.CST = '35';
        }
        else if (receiver.type === 'federalGovernment') {
            calculatedTax.CST = '36';
        }
        else {
            throw new Error('Not implemented');
        }
    }
}
function calculateIEC(taxDetail, taxSummary) {
    taxDetail.jurisdictionType = 'Country';
    taxDetail.jurisdictionName = 'Brasil';
    taxDetail.taxType = 'IEC';
    if (calculatedTax.CST >= '31' && calculatedTax.CST <= '37') {
        calculationExempt(taxDetail);
    }
    else {
        if (line.useType === 'use' || line.useType === 'consumption') {
            throw new Error('Not implemented.');
        }
        else if (line.useType === 'resale' || line.useType === 'production') {
            throw new Error('Not implemented.');
        }
        else {
            if (line.item.productType === 'merchandise') {
                throw new Error('Not implemented.');
            }
            else {
                calculationExempt(taxDetail);
            }
        }
    }
    calculateSummary(taxDetail.tax, taxSummary);
}
function calculateIST(taxDetail, taxSummary) {
    const item = line.item;
    taxDetail.jurisdictionType = 'State';
    taxDetail.jurisdictionName = receiver.address.state;
    taxDetail.taxType = 'IST';
    if (calculatedTax.CST === '35' || calculatedTax.CST === '36') {
        calculationExempt(taxDetail);
    }
    else if (line.useType === 'resale') {
        throw new Error('Not implemented.');
    }
    else if (line.useType === 'production') {
        throw new Error('Not implemented.');
    }
    else if (item.productType === 'merchandise') {
        throw new Error('Not implemented.');
    }
    else {
        calculationFixed(taxDetail);
    }
    calculateSummary(taxDetail.tax, taxSummary);
}
function calculationFixed(taxDetail) {
    taxDetail.scenario = 'Calculation Fixed';
    taxDetail.calcBase = amount + otherCosts;
    taxDetail.rate = 0.14;
    taxDetail.fact = 0.08;
    taxDetail.tax =
        currencyTrunc(taxDetail.calcBase * (1 - taxDetail.fact) * taxDetail.rate);
}
function calculateISC(taxDetail, taxSummary) {
    const item = line.item;
    taxDetail.jurisdictionType = 'City';
    taxDetail.jurisdictionName = emitter.address.cityName;
    taxDetail.taxType = 'ISC';
    if ((new Set(['99', '34', '35', '36'])).has(calculatedTax.CST) ||
        receiver.suframa !== undefined ||
        receiver.address.cityCode === 1302603) {
        calculationExempt(taxDetail);
    }
    else {
        throw new Error('Not implemented.');
    }
    calculateSummary(taxDetail.tax, taxSummary);
}
function calculationExempt(taxDetail) {
    taxDetail.scenario = 'Calculation Exempt';
    taxDetail.calcBase = currencyTrunc(amount + otherCosts - discount);
    taxDetail.rate = 0;
    taxDetail.fact = 0;
    taxDetail.tax = 0;
}
function calculateSummary(tax, taxSummary) {
    calculatedTax.tax += tax;
    taxSummary.tax += tax;
    taxSummary.jurisdictions[0].tax += tax;
}
function currencyTrunc(x) {
    return Math.floor(x * 100) * 0.01;
}
