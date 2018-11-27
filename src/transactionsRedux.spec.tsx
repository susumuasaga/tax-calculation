import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { State } from './State';
import { Action, fetchTransactions } from './Actions';
import { reducer } from './reducer';

describe('Transactions Redux', () => {
  let storeCreator: MockStoreCreator<State, ThunkDispatch<State, null, Action>>;
  let store: MockStoreEnhanced<State, ThunkDispatch<State, null, Action>>;

  beforeAll(() => {
    storeCreator = reduxMockStore([reduxThunk]);
  });

  beforeEach(() => {
    store = storeCreator({
      locationsCache: { isFetching: false },
      transactionsCache: { isFetching: false }
    });
  });

  it('can fetch transactions', async () => {
    let state = store.getState();
    await store.dispatch(fetchTransactions({}));
    const actions = store.getActions() as Action[];
    state = reducer(state, actions[0]);
    let cache = state.transactionsCache;
    expect(cache.isFetching)
      .toBe(true);
    state = reducer(state, actions[1]);
    cache = state.transactionsCache;
    expect(cache.isFetching)
      .toBe(false);
    expect(cache.transactions!.length)
      .toBe(5);
  });
});
