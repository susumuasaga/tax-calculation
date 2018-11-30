import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure as enzymeConfigure, mount, ReactWrapper } from 'enzyme';
import { reducer } from '../reducer';
import { Transactions } from './Transactions';
import { State } from '../State';
import { Action } from '../Actions';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { Provider } from 'react-redux';
import { transactions } from '../spec/testDB';
import { MemoryRouter } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, {}, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, {}, Action>>;
let wrapper: ReactWrapper;

describe('Transactions container', () => {
  beforeAll(() => {
    enzymeConfigure({ adapter: new Adapter() });
    storeCreator = reduxMockStore([reduxThunk]);
  });

  describe('when transactions is empty', () => {
    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
            <Transactions {...{
              location: { search: '?companyLocation=27227668000122' }
            }}/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('should start fetching transactions from db', () => {
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      const cache = state.transactionsCache;
      expect(cache.isFetching)
        .toBe(true);
      expect(wrapper.containsMatchingElement(<h2>Carregando...</h2>))
        .toBe(true);
    });
  });

  describe('when transactions is loaded', () => {
    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: {
          isFetching: false,
          transactions,
          query: { companyLocation: '27227668000122' }
        },
        transactionCache: { isFetching: false }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
          <Transactions {...{
            location: { search: '?companyLocation=27227668000122' }
          }}/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('should present first page of 10 transactions', () => {
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
      expect(wrapper.find(ListGroupItem).length)
        .toBeGreaterThan(0);
    });
  });
});
