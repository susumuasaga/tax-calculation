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
const testDB_1 = require("../testDB");
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const getErrorHandler_1 = require("../../routes/getErrorHandler");
const getLocationsRouter_1 = require("../../routes/getLocationsRouter");
const create_1 = require("./create");
const PORT = 3000;
let urlRoot;
let server;
let fakeLogger;
let locationModel;
describe('Locations route', () => {
    beforeAll(async () => {
        urlRoot = `http://localhost:${PORT}`;
        const app = express_1.default();
        app.use(body_parser_1.default.json());
        app.use(morgan_1.default('dev'));
        const modelInstances = await getModelInstances_1.getModelInstances();
        locationModel = modelInstances['Location'];
        app.use('/locations', getLocationsRouter_1.getLocationsRouter(locationModel));
        fakeLogger = new FakeLogger_1.FakeLogger();
        app.use(getErrorHandler_1.getErrorHandler(fakeLogger));
        server = app.listen(PORT);
    });
    afterAll(() => {
        server.close();
    });
    beforeEach(async () => {
        await locationModel.truncateAsync();
        await create_1.create(locationModel, testDB_1.locations);
    });
    it('can retrieve all locations', async () => {
        const res = await superagent.get(`${urlRoot}/locations`);
        expect(res.status)
            .toBe(http_status_1.default.OK);
        const actual = res.body;
        expect(actual.length)
            .toBe(testDB_1.locations.length);
    });
});
