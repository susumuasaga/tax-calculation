import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { Logger } from '../logger';
import { Model } from 'express-cassandra';
import { TransactionDoc, Transaction } from '../models/Transaction';
import { LocationDoc } from '../models/Entity';
import { ItemDoc } from '../models/Item';
import { BadRequest } from '../httpErrors';
import { calculateTax } from '../calculateTax';
import { transactions } from '../spec/testDB';

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
        const transactionDoc = new transactionModel(
          { ...transaction.header, ...transaction }
        );
        await transactionDoc.saveAsync();
        res.json(transaction);
      } catch (error) {
        next(error);
      }
    }
  });

/*  router.get('/', async (req, res) => {
    let transactionDocs: TransactionDoc[];
    transactionDocs = await transactionModel.findAsync(
      req.query as object,
      { raw: true }
    );
    let transactions: Transaction[];
    for (const doc of transactionDocs) {
      const location = await locationModel.findAsync(
        { code: doc.companyLocation },
        { raw: true }
      );
      const lines = doc.lines;
      const transaction: Transaction = {
        header: {
          transactionType: doc.transactionType,
          documentCode: doc.documentCode,
          transactionDate: doc.transactionDate
        },
        calculatedTaxSummary: doc.calculatedTaxSummary,
        lines: doc.lines
      };
      for (let i = 0; i < lines.length; )
    }
  });*/

  return router;
}
