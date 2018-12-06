"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const uuid_validate_1 = __importDefault(require("uuid-validate"));
const location = {
    fields: {
        companyId: {
            type: 'text',
            rule: { required: true, validator: uuid_validate_1.default }
        },
        code: { type: 'text', rule: { required: true } },
        email: 'text',
        federalTaxId: 'text',
        stateTaxId: 'text',
        cityTaxId: 'text',
        suframa: {
            type: 'text',
            rule: { validator: (value) => /[0-9]{8,9}/.test(value) }
        },
        taxRegime: {
            type: 'text',
            rule: {
                validator: (value) => (new Set([
                    'individual',
                    'simplified',
                    'estimatedProfit',
                    'realProfit'
                ])).has(value),
                required: true
            }
        },
        type: {
            type: 'text',
            rule: {
                validator: (value) => (new Set([
                    'cityGovernment',
                    'stateGovernment',
                    'federalGovernment'
                ])).has(value)
            }
        },
        mainActivity: {
            type: 'text',
            rule: {
                validator: (value) => (new Set(['commerce', 'industry', 'service'])).has(value)
            }
        },
        address: { type: 'frozen', typeDef: '<address>', rule: { required: true } }
    },
    key: ['code']
};
module.exports = location;
