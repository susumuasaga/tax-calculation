import { Model } from 'express-cassandra';
import express from 'express';
import * as http from 'http';
import httpStatus from 'http-status';
import * as superagent from 'superagent';
import { FakeLogger } from '../FakeLogger';
import { LocationDoc } from '../../models/Entity';
import { getModelInstances } from '../../getModelInstances';
import { locations } from '../testDB';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getErrorHandler } from '../../routes/getErrorHandler';
import { getLocationsRouter } from '../../routes/getLocationsRouter';
import { create } from './create';

const URL_ROOT = 'http://localhost:3000';
let server: http.Server;
let fakeLogger: FakeLogger;
let locationModel: Model<LocationDoc>;

describe('Locations route', () => {
  beforeAll(async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    const modelInstances = await getModelInstances();
    locationModel = modelInstances['Location'] as Model<LocationDoc>;
    app.use(
      '/locations',
      getLocationsRouter(locationModel)
    );
    fakeLogger = new FakeLogger();
    app.use(getErrorHandler(fakeLogger));
    server = app.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await locationModel.truncateAsync();
    await create(locationModel, locations);
  });

  it('can retrieve all locations', async () => {
    const res = await superagent.get(`${URL_ROOT}/locations`);
    expect(res.status)
      .toBe(httpStatus.OK);
    const actual = res.body as Location[];
    expect(actual.length)
      .toBe(locations.length);
  });
});
