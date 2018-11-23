"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const superagent = __importStar(require("superagent"));
const FakeLogger_1 = require("../FakeLogger");
const getModelInstances_1 = require("../../getModelInstances");
const getTransactionsRouter_1 = require("../../routes/getTransactionsRouter");
const testDB_1 = require("../testDB");
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const URL_ROOT = 'http://localhost:3000';
let server;
let logger;
let transactionModel;
let locationModel;
let itemModel;
async function getServer(app, port) {
    return new Promise(resolve => { server = app.listen(3000, () => { resolve(server); }); });
}
async function create(model, values) {
    for (const value of values) {
        const document = new model(value);
        await document.saveAsync();
    }
}
describe('Transactions route', () => {
    beforeAll(async () => {
        const app = express_1.default();
        app.use(body_parser_1.default.json());
        app.use(morgan_1.default('dev'));
        const modelInstances = await getModelInstances_1.getModelInstances();
        transactionModel = modelInstances['Transaction'];
        locationModel = modelInstances['Location'];
        itemModel = modelInstances['Item'];
        logger = new FakeLogger_1.FakeLogger();
        const transactionsRouter = getTransactionsRouter_1.getTransactionsRouter(logger, transactionModel, locationModel, itemModel);
        app.use('/transactions', transactionsRouter);
        server = await getServer(app, 3000);
    });
    afterAll(() => {
        server.close();
    });
    beforeEach(async () => {
        await transactionModel.truncateAsync();
        await locationModel.truncateAsync();
        await itemModel.truncateAsync();
        await create(locationModel, testDB_1.locations);
        await create(itemModel, testDB_1.items);
    });
    it('should calculate transaction taxes', async () => {
        const given = {
            header: {
                documentCode: '123456',
                transactionType: 'Sale',
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
        const url = `${URL_ROOT}/transactions`;
        const res = await superagent
            .post(url)
            .send(given);
        expect(res.status)
            .toBe(http_status_1.default.OK);
        const response = res.body;
        expect(response.calculatedTaxSummary.totalTax)
            .toBe(12.88);
        const transactionDocument = await transactionModel.findOneAsync({
            header: {
                documentCode: '123456',
                transactionType: 'Sale',
                companyLocation: '27227668000122',
                entity: {
                    type: 'cityGovernment',
                    address: { cityName: 'São Paulo', state: 'SP' }
                }
            }
        });
        expect(transactionDocument.calculatedTaxSummary.totalTax)
            .toBe(12.88);
    });
});
