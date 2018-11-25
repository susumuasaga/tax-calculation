"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const moment_1 = __importDefault(require("moment"));
const transaction = {
    fields: {
        transactionType: {
            type: 'text',
            rule: {
                validator(value) {
                    return (new Set(['Sale', 'Purchase'])).has(value);
                },
                required: true
            }
        },
        documentCode: { type: 'text', rule: { required: true } },
        currency: {
            type: 'text',
            default: 'BRL',
            rule: { validator(value) { return value === 'BRL'; } }
        },
        transactionDate: {
            type: 'text',
            rule: {
                validator(value) {
                    return moment_1.default(value, 'YYYY-MM-DD', true)
                        .isValid();
                },
                required: true
            }
        },
        companyLocation: { type: 'text', rule: { required: true } },
        entity: { type: 'frozen', typeDef: '<entity>' },
        lines: { type: 'list', typeDef: '<frozen<line>>', rule: { required: true } },
        calculatedTaxSummary: {
            type: 'frozen',
            typeDef: '<calculated_tax_summary>'
        },
        processingInfo: { type: 'frozen', typeDef: '<processing_info>' }
    },
    key: [['companyLocation'], 'transactionDate', 'documentCode'],
    clustering_order: { transactionDate: 'desc' }
};
module.exports = transaction;
