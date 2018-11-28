import reduxMockStore, { MockStoreCreator, MockStoreEnhanced } from 'redux-mock-store';
import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { configure as enzymeConfigure, mount } from 'enzyme';
import { reducer } from '../reducer';
import { Locations } from './Locations';
import { State } from '../State';
import { Action } from '../Actions';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { Provider } from 'react-redux';

let storeCreator: MockStoreCreator<State, ThunkDispatch<State, {}, Action>>;
let store: MockStoreEnhanced<State, ThunkDispatch<State, {}, Action>>;

describe('Locations container', () => {
  describe('when locations is empty', () => {
    beforeAll(() => {
      enzymeConfigure({ adapter: new Adapter() });
      storeCreator = reduxMockStore([reduxThunk]);
    });

    beforeEach(() => {
      store = storeCreator({
        locationsCache: { isFetching: false },
        transactionsCache: { isFetching: false }
      });
      mount(
        <Provider {...{ store }}>
          <Locations />
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
    });
  });
});
