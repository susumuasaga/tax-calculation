"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const httpErrors_1 = require("../httpErrors");
const calculateTax_1 = require("../calculateTax");
function getTransactionsRouter(transactionModel, locationModel, itemModel) {
    const router = express_1.Router();
    async function populateTransaction(transaction) {
        const header = transaction.header;
        header.location = await locationModel.findOneAsync({ code: header.companyLocation }, { raw: true });
        for (const line of transaction.lines) {
            line.item = await itemModel.findOneAsync({ code: line.itemCode }, { raw: true });
        }
    }
    router.post('/', async (req, res, next) => {
        const transaction = req.body;
        if (Object.keys(transaction).length === 0) {
            next(new httpErrors_1.BadRequest('No transaction specified.'));
        }
        else {
            try {
                await populateTransaction(transaction);
                calculateTax_1.calculateTax(transaction);
                const transactionDoc = new transactionModel(Object.assign({}, transaction.header, transaction));
                await transactionDoc.saveAsync();
                res.json(transaction);
            }
            catch (error) {
                next(error);
            }
        }
    });
    router.get('/', async (req, res) => {
        const query = req.query;
        if (query['companyLocation'] !== undefined) {
            query['$orderby'] = { $desc: 'transactionDate' };
        }
        const transactionDocs = await transactionModel.findAsync(query, { raw: true, allow_filtering: true });
        const transactions = [];
        for (const doc of transactionDocs) {
            const transaction = {
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
exports.getTransactionsRouter = getTransactionsRouter;
