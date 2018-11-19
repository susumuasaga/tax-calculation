"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_cassandra_1 = __importDefault(require("express-cassandra"));
const addressUdt_1 = require("./schemas/addressUdt");
const transactionUdts_1 = require("./schemas/transactionUdts");
async function getModelInstances() {
    await express_cassandra_1.default.setDirectory(`${__dirname}/schemas`)
        .bindAsync({
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
    return express_cassandra_1.default.instance;
}
exports.getModelInstances = getModelInstances;
