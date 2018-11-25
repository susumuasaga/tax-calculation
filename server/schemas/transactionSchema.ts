import * as models from 'express-cassandra';
import moment from 'moment';

const transaction: models.SchemaDefinition = {
  fields: {
    transactionType: {
      type: 'text',
      rule: {
        validator(value: string): boolean {
          return (new Set(['Sale', 'Purchase'])).has(value);
        },
        required: true
      }
    },
    documentCode: { type: 'text', rule: { required: true } },
    currency: {
      type: 'text',
      default: 'BRL',
      rule: { validator(value: string): boolean { return value === 'BRL'; } }
    },
    transactionDate: {
      type: 'text',
      rule: {
        validator(value: string): boolean {
          return moment(value, 'YYYY-MM-DD', true)
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
    processingInfo: { type: 'frozen', typeDef: '<processing_info>'}
  },
  key: ['companyLocation', 'documentCode'],
  indexes: ['transactionDate']
};

export = transaction;
