import * as models from 'express-cassandra';

const transaction: models.SchemaDefinition = {
  fields: {
    header: { type: 'frozen', typeDef: '<header>', rule: { required: true } },
    lines: { type: 'list', typeDef: '<frozen<line>>', rule: { required: true } },
    calculatedTaxSummary: {
      type: 'frozen',
      typeDef: '<calculated_tax_summary>'
    },
    processingInfo: { type: 'frozen', typeDef: '<processing_info>'}
  },
  key: ['header']
};

export = transaction;
