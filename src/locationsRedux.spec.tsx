import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import xhrMock from 'xhr-mock';
import { OK } from 'http-status';
import { State } from './State';
import { Action, fetchLocations, URL } from './Actions';
import { reducer } from './reducer';
import { locations } from '../server/spec/testDB';

describe('Locations Redux', () => {
  let storeCreator: MockStoreCreator<State, ThunkDispatch<State, null, Action>>;
  let store: MockStoreEnhanced<State, ThunkDispatch<State, null, Action>>;
  let state: State;

  beforeAll(() => {
    storeCreator = reduxMockStore([reduxThunk]);
  });

  beforeEach(() => {
    state = {
      locationsCache: { isFetching: false },
      transactionsCache: { isFetching: false }
    };
    store = storeCreator(state);
    xhrMock.setup();
  });

  afterEach(() => { xhrMock.teardown(); });

  it('can fetch locations', async () => {
    xhrMock.get(`${URL}/locations`, {
      status: OK,
      body: JSON.stringify(locations)
    });
    await store.dispatch(fetchLocations());
    const actions = store.getActions() as Action[];
    state = reducer(state, actions[0]);
    expect(state.locationsCache.isFetching)
      .toBe(true);
    state = reducer(state, actions[1]);
    const cache = state.locationsCache;
    expect(cache.isFetching)
      .toBe(false);
    expect(cache.locations!.length)
      .toBe(3);
  });
});
