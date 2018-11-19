import expressCassandra from 'express-cassandra';
import { addressUdt } from './schemas/addressUdt';
import { transactionUdts } from './schemas/transactionUdts';

/**
 * Get Model Instances.
 * @returns A Promise to a map of the model name to the Model Instance.
 */
export async function getModelInstances():
  Promise<{ [modelName: string]: expressCassandra.Model<expressCassandra.Document> }> {
  await expressCassandra.setDirectory(`${__dirname}/schemas`)
    .bindAsync({
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
          ...transactionUdts
        }
      }
    });

  return expressCassandra.instance;
}
