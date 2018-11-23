import * as models from 'express-cassandra';
import uuidValidate from 'uuid-validate';

const item: models.SchemaDefinition = {
  fields: {
    companyId: {
      type: 'text',
      rule: { required: true, validator: uuidValidate }
    },
    code: { type: 'text', rule: { required: true } },
    description: 'text',
    productType: {
      type: 'text',
      rule: {
        validator: (value: string) =>
          (new Set(['product', 'merchandise'])).has(value),
        required: true
      }
    },
    federalTax: { type: 'frozen', typeDef: '<federal_tax>'}
  },
  key: ['code']
};

export = item;
