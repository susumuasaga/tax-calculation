import expressCassandra from 'express-cassandra';
import { addressUdt } from './schemas/addressUdt';
import { transactionUdts } from './schemas/transactionUdts';
import companySchema from './schemas/companySchema';
import locationSchema from './schemas/locationSchema';
import itemSchema from './schemas/itemSchema';
import transactionSchema from './schemas/transactionSchema';
import { itemUdts } from './schemas/itemUdts';

/**
 * Get Model Instances.
 * @returns A Promise to a map of the model name to the Model Instance.
 */
export async function getModelInstances():
  Promise<{ [modelName: string]: expressCassandra.Model<expressCassandra.Document> }> {
  const models = expressCassandra.createClient({
    clientOptions: {
      contactPoints: ['127.0.0.1'],
      protocolOptions: { port: 9042 },
      keyspace: 'taxCalculation',
      queryOptions: { consistency: expressCassandra.consistencies.one }
    },
    ormOptions: {
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      migration: 'drop',
      udts: {
        ...addressUdt,
        ...transactionUdts,
        ...itemUdts
      }
    }
  });
  const companyModel = models.loadSchema('Company', { ...companySchema });
  await companyModel.syncDBAsync();

  const locationModel = models.loadSchema('Location', { ...locationSchema });
  await locationModel.syncDBAsync();

  const itemModel = models.loadSchema('Item', { ...itemSchema });
  await itemModel.syncDBAsync();

  const transactionModel = models.loadSchema(
    'Transaction',
    { ...transactionSchema }
  );
  await transactionModel.syncDBAsync();

  return models.instance;
}
