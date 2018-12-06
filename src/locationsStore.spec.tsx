import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { State } from './State';
import { Action, fetchLocations } from './Actions';
import { reducer } from './reducer';
import { locations } from './spec/testDB';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, null, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, null, Action>>;

describe('Locations Store', () => {
  beforeAll(async () => {
    storeCreator = reduxMockStore([reduxThunk]);
  });

  describe('when cache is not present', () => {
    beforeEach(async () => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
    });

    it('should fetch locations', async () => {
      await store.dispatch(fetchLocations());
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      let cache = state.locationsCache;
      expect(cache.isFetching)
        .toBe(true);
      state = reducer(state, actions[1]);
      cache = state.locationsCache;
      expect(cache.isFetching)
        .toBe(false);
//      expect(cache.locations!.length)
//        .toBeGreaterThan(0);
    });
  });

  describe('when cache is present', () => {
    beforeEach(async () => {
      store = storeCreator({
        locationsCache: { isFetching: false, locations },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
    });

    it('should not fetch locations', async () => {
      await store.dispatch(fetchLocations());
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
    });
  });

  describe('when cache is fetching', () => {
    beforeEach(async () => {
      store = storeCreator({
        locationsCache: { isFetching: true },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
    });

    it('should not fetch locations', async () => {
      await store.dispatch(fetchLocations());
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
    });
  });
});
