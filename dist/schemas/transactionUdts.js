"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionUdts = {
    entity: {
        email: 'text',
        federalTaxId: 'text',
        stateTaxId: 'text',
        cityTaxId: 'text',
        suframa: 'text',
        taxRegime: 'text',
        type: 'text',
        address: 'frozen<address>'
    },
    detail: {
        jurisdictionType: 'text',
        jurisdictionName: 'text',
        taxType: 'text',
        scenario: 'text',
        rate: 'double',
        tax: 'double',
        calcBase: 'double',
        fact: 'double',
        month: 'text'
    },
    tax_details: {
        iec: 'frozen<detail>',
        ist: 'frozen<detail>',
        isc: 'frozen<detail>'
    },
    calculated_tax: {
        taxDetails: 'frozen<tax_details>',
        CST: 'text',
        tax: 'double'
    },
    line: {
        lineCode: 'int',
        itemCode: 'text',
        numberOfItems: 'int',
        itemPrice: 'double',
        lineAmount: 'double',
        itemDescription: 'text',
        useType: 'text',
        lineDiscount: 'double',
        otherCostAmount: 'double',
        calculatedTax: 'frozen<calculated_tax>'
    },
    jurisdiction: {
        jurisdictionType: 'text',
        jurisdictionName: 'text',
        tax: 'double'
    },
    tax_summary: {
        tax: 'double',
        jurisdictions: 'list<frozen<jurisdiction>>'
    },
    tax_by_types: {
        iec: 'frozen<tax_summary>',
        ist: 'frozen<tax_summary>',
        isc: 'frozen<tax_summary>'
    },
    calculated_tax_summary: {
        numberOfLines: 'int',
        subtotal: 'double',
        totalTax: 'double',
        grandTotal: 'double',
        taxByType: 'frozen<tax_by_types>'
    },
    processing_info: {
        versionId: 'text',
        duration: 'double'
    }
};
