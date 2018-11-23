"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_cassandra_1 = __importDefault(require("express-cassandra"));
const addressUdt_1 = require("./schemas/addressUdt");
const transactionUdts_1 = require("./schemas/transactionUdts");
const companySchema_1 = __importDefault(require("./schemas/companySchema"));
const locationSchema_1 = __importDefault(require("./schemas/locationSchema"));
const itemSchema_1 = __importDefault(require("./schemas/itemSchema"));
const transactionSchema_1 = __importDefault(require("./schemas/transactionSchema"));
async function getModelInstances() {
    const models = express_cassandra_1.default.createClient({
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: { port: 9042 },
            keyspace: 'taxCalculation',
            queryOptions: { consistency: express_cassandra_1.default.consistencies.one }
        },
        ormOptions: {
            defaultReplicationStrategy: {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'drop',
            udts: Object.assign({}, addressUdt_1.addressUdt, transactionUdts_1.transactionUdts)
        }
    });
    const companyModel = models.loadSchema('Company', Object.assign({}, companySchema_1.default));
    await companyModel.syncDBAsync();
    const locationModel = models.loadSchema('Location', Object.assign({}, locationSchema_1.default));
    await locationModel.syncDBAsync();
    const itemModel = models.loadSchema('Item', Object.assign({}, itemSchema_1.default));
    await itemModel.syncDBAsync();
    const transactionModel = models.loadSchema('Transaction', Object.assign({}, transactionSchema_1.default));
    await transactionModel.syncDBAsync();
    return models.instance;
}
exports.getModelInstances = getModelInstances;
