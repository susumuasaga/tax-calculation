import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure as enzymeConfigure, mount, ReactWrapper } from 'enzyme';
import * as queryString from 'query-string';
import { reducer } from '../reducer';
import { Transaction } from './Transaction';
import { State } from '../State';
import { Action } from '../Actions';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { Provider } from 'react-redux';
import { transactions } from '../spec/testDB';
import { MemoryRouter } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap';
import { TransactionKey, Transaction as ITransaction } from '../models/Transaction';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, {}, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, {}, Action>>;
let wrapper: ReactWrapper;
let transaction: ITransaction;
let search: string;
let query: TransactionKey;

describe('Transaction container', () => {
  beforeAll(() => {
    enzymeConfigure({ adapter: new Adapter() });
    storeCreator = reduxMockStore([reduxThunk]);
    transaction = transactions[0];
    const {
      companyLocation,
      transactionDate,
      documentCode
    } = transaction.header;
    query = { companyLocation, transactionDate, documentCode };
    search = `?${queryString.stringify(query)}`;
  });

  describe('when transaction cache is empty', () => {
    beforeEach(() => {

      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
            <Transaction {...{ location: { search } }} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should start fetching transaction from db', () => {
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      const cache = state.transactionCache;
      expect(cache.isFetching)
        .toBe(true);
      expect(wrapper.containsMatchingElement(<h2>Carregando...</h2>))
        .toBe(true);
    });
  });

  describe('when transaction is loaded', () => {
    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false },
        transactionCache: {
          isFetching: false,
          transaction: transactions[0],
          query
        }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
            <Transaction {...{ location: { search } }} />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should present transaction', () => {
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
      expect(wrapper.find(ListGroupItem).length)
        .toBe(transaction.lines.length + 1);
    });
  });
});
