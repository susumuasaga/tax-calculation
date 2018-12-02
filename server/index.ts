import express from 'express';
import bodyParser from 'body-parser';
import winston from 'winston';
import path from 'path';
import { Model } from 'express-cassandra';
import { getModelInstances } from './getModelInstances';
import { getTransactionsRouter } from './routes/getTransactionsRouter';
import { TransactionDoc } from './models/Transaction';
import { LocationDoc } from './models/Entity';
import { ItemDoc } from './models/Item';
import { getErrorHandler } from './routes/getErrorHandler';
import { getLocationsRouter } from './routes/getLocationsRouter';

const PORT = 80;

start();
console.log(`Server listening at port ${PORT}.`);

async function start(): Promise<void> {
  const app = express();
  app.use(bodyParser.json());

  const modelInstances = await getModelInstances();
  const transactionModel =
    modelInstances['Transaction'] as Model<TransactionDoc>;
  const locationModel = modelInstances['Location'] as Model<LocationDoc>;
  const itemModel = modelInstances['Item'] as Model<ItemDoc>;

  app.use(
    '/api/transactions',
    getTransactionsRouter(transactionModel, locationModel, itemModel)
  );

  app.use('/api/locations', getLocationsRouter(locationModel));

  app.use('/node_modules', express.static('./node_modules'));
  app.use(
    ['/locations', '/transactions', '/transaction', '/line'],
    (req, res) => { res.sendFile(path.resolve('build/index.html')); }
  );
  app.use(express.static('./build'));

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: 'error.log', level: 'error'
      }),
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });
  app.use(getErrorHandler(logger));

  app.listen(PORT);
}
