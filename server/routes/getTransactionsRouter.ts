import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { Logger } from '../logger';
import { Model } from 'express-cassandra';
import { TransactionDoc, Transaction } from '../models/Transaction';
import { LocationDoc } from '../models/Entity';
import { ItemDoc } from '../models/Item';
import { BadRequest } from '../httpErrors';
import { calculateTax } from '../calculateTax';

/**
 * Create Transactions route.
 * @param logger Error logger to defect diagnostics.
 */
export function getTransactionsRouter(
  transactionModel: Model<TransactionDoc>,
  locationModel: Model<LocationDoc>,
  itemModel: Model<ItemDoc>
): Router {
  const router = Router();
  router.post('/', async (req, res, next) => {
    const transaction = req.body as Transaction;
    if (Object.keys(transaction).length === 0) {
      next(new BadRequest('No transaction specified.'));
    } else {
      const header = transaction.header;
      try {
        header.location = await locationModel.findOneAsync(
          { code: header.companyLocation },
          { raw: true }
        );
        for (const line of transaction.lines) {
          line.item = await itemModel.findOneAsync(
            { code: line.itemCode },
            { raw: true }
          );
        }
        calculateTax(transaction);
        const transactionDoc = new transactionModel(transaction);
        await transactionDoc.saveAsync();
        res.json(transaction);
      } catch (error) {
        next(error);
      }
    }
  });

  return router;
}
