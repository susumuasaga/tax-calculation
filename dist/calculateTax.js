"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_cassandra_1 = require("express-cassandra");
const perf_hooks_1 = require("perf_hooks");
const taxTables_1 = require("./taxTables");
exports.VERSION_ID = '1.0';
let transaction;
let emitter;
let receiver;
let line;
let amount;
let otherCosts;
let discount;
function calculateTax(t) {
    const ti = perf_hooks_1.performance.now();
    transaction = t;
    initialize();
    const calculatedTaxSummary = transaction.calculatedTaxSummary;
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
        const calculatedTax = {
            tax: 0,
            CST: '99',
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
        calculatedTaxSummary.subtotal = currencySum(calculatedTaxSummary.subtotal, amount, -discount);
        calculateCST();
        calculateIEC();
        calculateIST();
        calculateISC();
        calculatedTaxSummary.totalTax = currencySum(calculatedTaxSummary.totalTax, calculatedTax.tax);
        delete line.item;
    }
    calculatedTaxSummary.grandTotal = currencySum(calculatedTaxSummary.subtotal, calculatedTaxSummary.totalTax);
    delete transaction.header.location;
    const tf = perf_hooks_1.performance.now();
    transaction.processingInfo.duration = tf - ti;
}
exports.calculateTax = calculateTax;
function initialize() {
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
        isc: {
            tax: 0, jurisdictions: [{
                    jurisdictionType: 'City',
                    jurisdictionName: emitter.address.cityName,
                    tax: 0
                }]
        }
    };
    const calculatedTaxSummary = {
        numberOfLines: 0,
        subtotal: 0,
        totalTax: 0,
        grandTotal: 0,
        taxByType
    };
    transaction.calculatedTaxSummary = calculatedTaxSummary;
    const processingInfo = { versionId: exports.VERSION_ID, duration: 0 };
    transaction.processingInfo = processingInfo;
}
function calculateCST() {
    const calculatedTax = line.calculatedTax;
    if (emitter.taxRegime === 'individual') {
        cst50or99();
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
            if (emitter.taxRegime === 'simplified') {
                cst50or99();
            }
            else if (emitter.taxRegime === 'realProfit' ||
                emitter.taxRegime === 'estimatedProfit') {
                calculatedTax.CST = '50';
            }
            else {
                throw new Error('Not implemented.');
            }
        }
    }
}
function cst50or99() {
    const calculatedTax = line.calculatedTax;
    const item = line.item;
    if (item.productType === 'merchandise') {
        calculatedTax.CST = '50';
    }
    else {
        calculatedTax.CST = '99';
    }
}
function calculateIEC() {
    const taxDetail = line.calculatedTax.taxDetails.iec;
    const taxSummary = transaction.calculatedTaxSummary.taxByType.iec;
    taxDetail.jurisdictionType = 'Country';
    taxDetail.jurisdictionName = 'Brasil';
    taxDetail.taxType = 'IEC';
    const cst = line.calculatedTax.CST;
    if (cst >= '31' && cst <= '37') {
        calculationExempt(taxDetail);
    }
    else {
        const useType = line.useType;
        const item = line.item;
        if (useType === 'use' || useType === 'consumption') {
            if (receiver.address.state === emitter.address.state) {
                calculationSimple(taxDetail, item.federalTax.IEC.rate);
            }
            else {
                throw new Error('Not implemented.');
            }
        }
        else if (useType === 'resale' || useType === 'production') {
            tableOrSimple();
        }
        else {
            if (item.productType === 'merchandise') {
                calculationSimple(taxDetail, item.federalTax.IEC.rate);
            }
            else {
                calculationExempt(taxDetail);
            }
        }
    }
    calculateSums(taxDetail.tax, taxSummary);
}
function tableOrSimple() {
    const item = line.item;
    if (item.productType === 'product') {
        calculationTableIEC();
    }
    else {
        calculationSimple(line.calculatedTax.taxDetails.iec, item.federalTax.IEC.rate);
    }
}
function calculationTableIEC() {
    const taxDetail = line.calculatedTax.taxDetails.iec;
    taxDetail.scenario = 'Calculation Table';
    const calcBase = currencySum(amount, otherCosts, -discount);
    const rate = taxTables_1.iecTable[taxTables_1.regions[receiver.address.state]][(receiver.address.state === emitter.address.state) ? 0 : 1];
    const fact = line.item.federalTax.IEC.fact;
    taxDetail.calcBase = calcBase;
    taxDetail.rate = rate;
    taxDetail.fact = fact;
    taxDetail.tax = currencyRound(calcBase * (1 - fact) * rate);
}
function calculateIST() {
    const taxDetail = line.calculatedTax.taxDetails.ist;
    const taxSummary = transaction.calculatedTaxSummary.taxByType.ist;
    taxDetail.jurisdictionType = 'State';
    taxDetail.jurisdictionName = receiver.address.state;
    taxDetail.taxType = 'IST';
    const cst = line.calculatedTax.CST;
    if (cst === '35' || cst === '36') {
        calculationExempt(taxDetail);
    }
    else {
        const item = line.item;
        if (line.useType === 'resale') {
            if (item.productType === 'product') {
                calculationTableIST();
            }
            else {
                calculationPeriodIST();
            }
        }
        else if (line.useType === 'production') {
            if (receiver.address.state === emitter.address.state) {
                calculationSimple(taxDetail, item.federalTax.IST.rate);
            }
            else {
                calculationTableIST();
            }
        }
        else {
            if (item.productType === 'merchandise') {
                calculationSimple(taxDetail, item.federalTax.IST.rate);
            }
            else {
                const rate = 0.14;
                const fact = 0.08;
                calculationFixed(taxDetail, rate, fact);
            }
        }
    }
    calculateSums(taxDetail.tax, taxSummary);
}
function calculationTableIST() {
    const taxDetails = line.calculatedTax.taxDetails;
    const taxDetail = taxDetails.ist;
    taxDetail.scenario = 'Calculation Table';
    const calcBase = currencySum(amount, otherCosts, -discount, taxDetails.iec.tax);
    const originTable = taxTables_1.istTable[emitter.address.state];
    let rate = 0.08;
    if (originTable !== undefined) {
        rate = originTable[receiver.address.state];
    }
    const fact = line.item.federalTax.IST.fact;
    taxDetail.calcBase = calcBase;
    taxDetail.rate = rate;
    taxDetail.fact = fact;
    taxDetail.tax = currencyRound(calcBase * (1 - fact) * rate);
}
function calculationPeriodIST() {
    const taxDetail = line.calculatedTax.taxDetails.ist;
    taxDetail.scenario = 'Calculation Period';
    let calcBase;
    let rate;
    let fact;
    const month = express_cassandra_1.datatypes.LocalDate.fromString(transaction.header.transactionDate).month;
    if (month >= 5 && month <= 8) {
        throw new Error('Not implemented.');
    }
    else {
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
function calculateISC() {
    const taxDetail = line.calculatedTax.taxDetails.isc;
    const taxSummary = transaction.calculatedTaxSummary.taxByType.isc;
    taxDetail.jurisdictionType = 'City';
    taxDetail.jurisdictionName = emitter.address.cityName;
    taxDetail.taxType = 'ISC';
    const cst = line.calculatedTax.CST;
    if ((new Set(['99', '34', '35', '36'])).has(cst) ||
        receiver.suframa !== undefined ||
        receiver.address.cityCode === 1302603) {
        calculationExempt(taxDetail);
    }
    else {
        const item = line.item;
        if (item.productType === 'merchandise') {
            calculationSimple(taxDetail, item.federalTax.ISC.rate);
        }
        else {
            const rate = 0.02;
            const factor = 0.12;
            calculationFixed(taxDetail, rate, factor);
        }
    }
    calculateSums(taxDetail.tax, taxSummary);
}
function calculationExempt(taxDetail) {
    taxDetail.scenario = 'Calculation Exempt';
    taxDetail.calcBase = currencySum(amount, otherCosts, -discount);
    taxDetail.rate = 0;
    taxDetail.fact = 0;
    taxDetail.tax = 0;
}
function calculationFixed(taxDetail, rate, fact) {
    taxDetail.scenario = 'Calculation Fixed';
    taxDetail.calcBase = currencySum(amount, otherCosts);
    taxDetail.rate = rate;
    taxDetail.fact = fact;
    taxDetail.tax = currencyRound(taxDetail.calcBase * (1 - fact) * rate);
}
function calculationSimple(taxDetail, rate) {
    taxDetail.scenario = 'Calculation Simple';
    taxDetail.calcBase = currencySum(amount, otherCosts, -discount);
    taxDetail.rate = rate;
    taxDetail.fact = 0;
    taxDetail.tax = currencyRound(taxDetail.calcBase * rate);
}
function calculateSums(tax, taxSummary) {
    line.calculatedTax.tax = currencySum(line.calculatedTax.tax, tax);
    taxSummary.tax = currencySum(taxSummary.tax, tax);
    taxSummary.jurisdictions[0].tax = currencySum(taxSummary.jurisdictions[0].tax, tax);
}
function currencyRound(x) {
    return Math.round(x * 100) / 100;
}
function currencySum(...args) {
    let sum = 0;
    for (const arg of args) {
        sum += Math.round(arg * 100);
    }
    return sum / 100;
}
