import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { State } from './State';
import { Action, fetchTransaction } from './Actions';
import { reducer } from './reducer';
import { TransactionKey } from './models/Transaction';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, null, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, null, Action>>;

describe('Transaction Store', () => {
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

    it('should fetch transaction', async () => {
      const query: TransactionKey = {
        companyLocation: '27227668000122',
        transactionDate: '2018-11-15',
        documentCode: '000011'
      };
      await store.dispatch(fetchTransaction(query));
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      let cache = state.transactionCache;
      expect(cache.isFetching)
        .toBe(true);
      expect(cache.query)
        .toEqual(query);
      state = reducer(state, actions[1]);
      cache = state.transactionCache;
      expect(cache.isFetching)
        .toBe(false);
      expect(cache.query)
        .toEqual(query);
      expect(cache.transaction)
        .toBeTruthy();
    });
  });
/*
  describe('when cache is present', () => {
    beforeEach(async () => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false, transactions, query: {} },
        transactionCache: { isFetching: false }
      });
    });

    it('if same query, should not fetch transaction', async () => {
      await store.dispatch(fetchTransactions({}));
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
    });

    it('if not same query, should fetch transaction', async () => {
      const query: Partial<Header> = { companyLocation: '27227668000122' };
      await store.dispatch(fetchTransactions(query));
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      let cache = state.transactionCache;
      expect(cache.isFetching)
        .toBe(true);
      expect(cache.query)
        .toEqual(query);
      state = reducer(state, actions[1]);
      cache = state.transactionCache;
      expect(cache.isFetching)
        .toBe(false);
      expect(cache.query)
        .toEqual(query);
      expect(cache.transaction!.length)
        .toBeGreaterThan(0);
    });
  });

  describe('when cache is fetching', () => {
    beforeEach(async () => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: true },
        transactionCache: { isFetching: false }
      });
    });

    it('should not fetch transaction', async () => {
      await store.dispatch(fetchTransactions({}));
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
    });
  });*/
});
