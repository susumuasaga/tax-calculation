import { Router } from 'express';
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

  async function populateTransaction(transaction: Transaction): Promise<void> {
    const header = transaction.header;
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
  }

  router.post('/', async (req, res, next) => {
    const transaction = req.body as Transaction;
    if (Object.keys(transaction).length === 0) {
      next(new BadRequest('No transaction specified.'));
    } else {
      try {
        await populateTransaction(transaction);
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

  router.get('/', async (req, res) => {
    const query = req.query as { [key: string]: any };
    if (query['companyLocation'] !== undefined) {
      query['$orderby'] = { $desc: 'transactionDate' };
    }
    const transactionDocs = await transactionModel.findAsync(
      query, { raw: true, allow_filtering: true }
    );
    const transactions: Transaction[] = [];
    for (const doc of transactionDocs) {
      const transaction: Transaction = {
        header: {
          companyLocation: doc.companyLocation,
          transactionDate: doc.transactionDate,
          documentCode: doc.documentCode,
          transactionType: doc.transactionType,
          entity: doc.entity
        },
        calculatedTaxSummary: doc.calculatedTaxSummary,
        lines: doc.lines
      };
      await populateTransaction(transaction);
      transactions.push(transaction);
    }
    res.json(transactions);
  });

  return router;
}
