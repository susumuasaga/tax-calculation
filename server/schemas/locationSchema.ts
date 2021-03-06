import * as models from 'express-cassandra';
import uuidValidate from 'uuid-validate';

const location: models.SchemaDefinition = {
  fields: {
    companyId: {
      type: 'text',
      rule: { required: true, validator: uuidValidate }
    },
    code: { type: 'text', rule: { required: true } },
    email: 'text',
    federalTaxId: 'text',
    stateTaxId: 'text',
    cityTaxId: 'text',
    suframa: {
      type: 'text',
      rule: { validator: (value: string) => /[0-9]{8,9}/.test(value) }
    },
    taxRegime: {
      type: 'text',
      rule: {
        validator: (value: string) =>
          (new Set([
            'individual',
            'simplified',
            'estimatedProfit',
            'realProfit'
          ])).has(value),
        required: true
      }
    },
    type:  {
      type: 'text',
      rule: {
        validator: (value: string) =>
          (new Set([
            'cityGovernment',
            'stateGovernment',
            'federalGovernment'
          ])).has(value)
      }
    },
    mainActivity: {
      type: 'text',
      rule: {
        validator: (value: string) =>
          (new Set(['commerce', 'industry', 'service'])).has(value)
      }
    },
    address: { type: 'frozen', typeDef: '<address>', rule: { required: true } }
  },
  key: ['code']
};

export = location;
