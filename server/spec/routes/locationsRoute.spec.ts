import * as models from 'express-cassandra';
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

const PORT = 3000;

let urlRoot: string;
let server: http.Server;
let fakeLogger: FakeLogger;
let locationModel: models.Model<LocationDoc>;

describe('Locations route', () => {
  beforeAll(async () => {
    urlRoot = `http://localhost:${PORT}`;
    const app = express();
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    const modelInstances = await getModelInstances();
    locationModel = modelInstances['Location'] as models.Model<LocationDoc>;
    app.use(
      '/locations',
      getLocationsRouter(locationModel)
    );
    fakeLogger = new FakeLogger();
    app.use(getErrorHandler(fakeLogger));
    server = app.listen(PORT);
  });

  afterAll(async () => {
    server.close();
    await models.closeAsync();
  });

  beforeEach(async () => {
    await locationModel.truncateAsync();
    await create(locationModel, locations);
  });

  it('can retrieve all locations', async () => {
    const res = await superagent.get(`${urlRoot}/locations`);
    expect(res.status)
      .toBe(httpStatus.OK);
    const actual = res.body as Location[];
    expect(actual.length)
      .toBe(locations.length);
  });
});
