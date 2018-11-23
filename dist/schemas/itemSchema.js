"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const uuid_validate_1 = __importDefault(require("uuid-validate"));
const item = {
    fields: {
        companyId: {
            type: 'text',
            rule: { required: true, validator: uuid_validate_1.default }
        },
        code: { type: 'text', rule: { required: true } },
        description: 'text',
        productType: {
            type: 'text',
            rule: {
                validator: (value) => (new Set(['product', 'merchandise'])).has(value),
                required: true
            }
        },
        federalTax: { type: 'frozen', typeDef: '<federal_tax>' }
    },
    key: ['code']
};
module.exports = item;
