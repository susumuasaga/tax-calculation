import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { State } from './State';
import { Action, fetchLocations } from './Actions';
import { reducer } from './reducer';

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
  });

  it('can fetch locations', async () => {
    await store.dispatch(fetchLocations());
    const actions = store.getActions() as Action[];
    state = reducer(state, actions[0]);
    let cache = state.locationsCache;
    expect(cache.isFetching)
      .toBe(true);
    state = reducer(state, actions[1]);
    cache = state.locationsCache;
    expect(cache.isFetching)
      .toBe(false);
    expect(cache.locations!.length)
      .toBe(3);
  });
});
