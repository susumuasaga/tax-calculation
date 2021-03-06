"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models = __importStar(require("express-cassandra"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const superagent = __importStar(require("superagent"));
const FakeLogger_1 = require("../FakeLogger");
const getModelInstances_1 = require("../../getModelInstances");
const getTransactionsRouter_1 = require("../../routes/getTransactionsRouter");
const testDB_1 = require("../testDB");
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const getErrorHandler_1 = require("../../routes/getErrorHandler");
const create_1 = require("./create");
const PORT = 3000;
let urlRoot;
let server;
let fakeLogger;
let transactionModel;
let locationModel;
let itemModel;
describe('Transactions route', () => {
    beforeAll(async () => {
        urlRoot = `http://localhost:${PORT}`;
        const app = express_1.default();
        app.use(body_parser_1.default.json());
        app.use(morgan_1.default('dev'));
        const modelInstances = await getModelInstances_1.getModelInstances();
        transactionModel = modelInstances['Transaction'];
        locationModel = modelInstances['Location'];
        itemModel = modelInstances['Item'];
        app.use('/transactions', getTransactionsRouter_1.getTransactionsRouter(transactionModel, locationModel, itemModel));
        fakeLogger = new FakeLogger_1.FakeLogger();
        app.use(getErrorHandler_1.getErrorHandler(fakeLogger));
        server = app.listen(PORT);
    });
    afterAll(async () => {
        server.close();
        await models.closeAsync();
    });
    beforeEach(async () => {
        await transactionModel.truncateAsync();
        await locationModel.truncateAsync();
        await itemModel.truncateAsync();
        await create_1.create(locationModel, testDB_1.locations);
        await create_1.create(itemModel, testDB_1.items);
        for (const transaction of testDB_1.transactions) {
            const transactionDB = Object.assign({}, transaction, transaction.header);
            delete transactionDB.header;
            const transactionDoc = new transactionModel(transactionDB);
            await transactionDoc.saveAsync();
        }
    });
    it('should complete and save transaction', async () => {
        const given = {
            header: {
                documentCode: '123456',
                transactionType: 'Sale',
                transactionDate: '2018-11-25',
                companyLocation: '27227668000122',
                entity: {
                    type: 'cityGovernment',
                    address: { cityName: 'São Paulo', state: 'SP' }
                }
            },
            lines: [
                {
                    numberOfItems: 2,
                    itemPrice: 45,
                    otherCostAmount: 10,
                    lineDiscount: 10,
                    itemCode: 'VENTILADOR-DIGITAL-001'
                }
            ]
        };
        const url = `${urlRoot}/transactions`;
        const res = await superagent.post(url)
            .send(given);
        expect(res.status)
            .toBe(http_status_1.default.OK);
        const response = res.body;
        expect(response.calculatedTaxSummary.totalTax)
            .toBe(12.88);
        const transactionDocument = await transactionModel.findOneAsync({
            companyLocation: '27227668000122',
            transactionDate: '2018-11-25',
            documentCode: '123456'
        }, { raw: true });
        expect(transactionDocument.calculatedTaxSummary.totalTax)
            .toBe(12.88);
    });
    it('should raise BAD_REQUEST when no transaction specified', async () => {
        fakeLogger.clearErrorLog();
        await (async () => {
            try {
                await superagent.post(`${urlRoot}/transactions`);
                fail('No transaction, but error not caught.');
            }
            catch (err) {
                const lastError = fakeLogger.lastError;
                expect(lastError.message)
                    .toBe('No transaction specified.');
                const error = err.response.body;
                expect(error.message)
                    .toBe('No transaction specified.');
            }
        })();
    });
    it('should raise BAD_REQUEST when transaction is invalid', async () => {
        const given = {
            header: {
                transactionType: 'Purchase',
                companyLocation: '27227668000122',
                entity: {
                    address: { cityName: 'Jundiaí', state: 'SP' }
                }
            },
            lines: [
                {
                    numberOfItems: 2,
                    itemPrice: 45,
                    otherCostAmount: 10,
                    lineDiscount: 10,
                    itemCode: 'VENTILADOR-DIGITAL-001'
                }
            ]
        };
        fakeLogger.clearErrorLog();
        await (async () => {
            try {
                await superagent.post(`${urlRoot}/transactions`)
                    .send(given);
                fail('Invalid transaction, but error not caught.');
            }
            catch (err) {
                const lastError = fakeLogger.lastError;
                expect(lastError.message)
                    .toBe('Invalid Tax Regime.');
                const error = err.response.body;
                expect(error.message)
                    .toBe('Invalid Tax Regime.');
            }
        })();
    });
    it('can retrieve transaction by location.code', async () => {
        const locationCode = '27227668000122';
        const res = await superagent.get(`${urlRoot}/transactions?companyLocation=${locationCode}`);
        expect(res.status)
            .toBe(http_status_1.default.OK);
        const actual = res.body;
        const expected = testDB_1.transactions.filter(transaction => transaction.header.companyLocation === locationCode);
        expected.sort((a, b) => -a.header.transactionDate.localeCompare(b.header.transactionDate));
        expect(actual.length)
            .toBe(expected.length);
        for (let i = 0; i < actual.length; i += 1) {
            expect(actual[i].header.documentCode)
                .toBe(expected[i].header.documentCode);
        }
    });
    it('can retrieve all transactions', async () => {
        const res = await superagent.get(`${urlRoot}/transactions`);
        expect(res.status)
            .toBe(http_status_1.default.OK);
        const actual = res.body;
        expect(actual.length)
            .toBe(testDB_1.transactions.length);
    });
});
