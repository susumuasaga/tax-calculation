"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const httpErrors_1 = require("../httpErrors");
const calculateTax_1 = require("../calculateTax");
function getTransactionsRouter(transactionModel, locationModel, itemModel) {
    const router = express_1.Router();
    router.post('/', async (req, res, next) => {
        const transaction = req.body;
        if (Object.keys(transaction).length === 0) {
            next(new httpErrors_1.BadRequest('No transaction specified.'));
        }
        else {
            const header = transaction.header;
            header.location = await locationModel.findOneAsync({ code: header.companyLocation }, { raw: true });
            for (const line of transaction.lines) {
                line.item = await itemModel.findOneAsync({ code: line.itemCode }, { raw: true });
            }
            calculateTax_1.calculateTax(transaction);
            const transactionDoc = new transactionModel(transaction);
            await transactionDoc.saveAsync();
            res.json(transaction);
        }
    });
    return router;
}
exports.getTransactionsRouter = getTransactionsRouter;
