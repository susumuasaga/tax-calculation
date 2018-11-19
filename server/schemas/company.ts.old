import * as models from 'express-cassandra';
import uuidValidate from 'uuid-validate';

const company: models.SchemaDefinition = {
  fields: {
    id: {
      type: 'uuid',
      default: () =>
        models.uuid()
          .toString(),
      rule: { validator: uuidValidate }
    },
    code: { type: 'text', rule: { required: true } },
    name: { type: 'text', rule: { required: true } }
  },
  key: ['id']
};

export = company;
