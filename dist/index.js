"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const getModelInstances_1 = require("./getModelInstances");
const getTransactionsRouter_1 = require("./routes/getTransactionsRouter");
const getErrorHandler_1 = require("./routes/getErrorHandler");
const getLocationsRouter_1 = require("./routes/getLocationsRouter");
const PORT = 3000;
start();
console.log(`Server listening at port ${PORT}.`);
async function start() {
    const app = express_1.default();
    app.use(body_parser_1.default.json());
    const modelInstances = await getModelInstances_1.getModelInstances();
    const transactionModel = modelInstances['Transaction'];
    const locationModel = modelInstances['Location'];
    const itemModel = modelInstances['Item'];
    app.use('/api/transactions', getTransactionsRouter_1.getTransactionsRouter(transactionModel, locationModel, itemModel));
    app.use('/api/locations', getLocationsRouter_1.getLocationsRouter(locationModel));
    app.use('/node_modules', express_1.default.static('./node_modules'));
    app.use(['/locations', '/transactions', '/transaction', '/line'], (req, res) => { res.sendFile(path_1.default.resolve('build/index.html')); });
    app.use(express_1.default.static('./build'));
    const logger = winston_1.default.createLogger({
        level: 'info',
        format: winston_1.default.format.json(),
        transports: [
            new winston_1.default.transports.File({
                filename: 'error.log', level: 'error'
            }),
            new winston_1.default.transports.Console({
                format: winston_1.default.format.simple()
            })
        ]
    });
    app.use(getErrorHandler_1.getErrorHandler(logger));
    app.listen(PORT);
}
