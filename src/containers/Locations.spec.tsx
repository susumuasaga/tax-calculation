import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure as enzymeConfigure, mount, ReactWrapper } from 'enzyme';
import { reducer } from '../reducer';
import { Locations } from './Locations';
import { State } from '../State';
import { Action } from '../Actions';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { Provider } from 'react-redux';
import { locations } from '../spec/testDB';
import { MemoryRouter } from 'react-router-dom';
import { Row } from 'reactstrap';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, {}, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, {}, Action>>;
let wrapper: ReactWrapper;

describe('Locations container', () => {
  beforeAll(() => {
    enzymeConfigure({ adapter: new Adapter() });
    storeCreator = reduxMockStore([reduxThunk]);
  });

  describe('when locations is empty', () => {
    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
            <Locations />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should start fetching locations from db', () => {
      let state = store.getState();
      const actions = store.getActions() as Action[];
      state = reducer(state, actions[0]);
      const cache = state.locationsCache;
      expect(cache.isFetching)
        .toBe(true);
      expect(wrapper.containsMatchingElement(<h2>Carregando...</h2>))
        .toBe(true);
    });
  });

  describe('when locations is loaded', () => {
    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false, locations },
        transactionsCache: { isFetching: false },
        transactionCache: { isFetching: false }
      });
      wrapper = mount(
        <Provider {...{ store }}>
          <MemoryRouter>
            <Locations />
          </MemoryRouter>
        </Provider>
      );
    });

    it('should present locations', () => {
      const actions = store.getActions() as Action[];
      expect(actions.length)
        .toBe(0);
      expect(wrapper.find(Row).length)
        .toBe(locations.length);
    });
  });
});
