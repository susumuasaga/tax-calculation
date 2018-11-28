import * as Redux from 'redux';
import * as superagent from 'superagent';
import * as _ from 'lodash';
import { State } from './State';
import { Location } from './models/Entity';
import { ThunkAction } from 'redux-thunk';
import { Transaction, Header } from './models/Transaction';

export const URL = 'http://localhost:3000/api';

/**
 * General Action this application
 */
export interface Action extends Redux.Action {
  type: string;
  reducer(state: State): State;
}

/**
 * Returns `Action` to start fetching Transactions.
 */
export function fetchLocationsStart(): Action {
  return {
    type: 'FetchTransactionsStart',
    reducer(state) {
      return { ...state, locationsCache: { isFetching: true } };
    }
  };
}

/**
 * Return `Action` after successfully fetching Transactions.
 */
export function fetchLocationsSuccess(locations: Location[]): Action {
  return {
    type: 'FetchLocationsSuccess',
    reducer(state) {
      return { ...state, locationsCache: { isFetching: false, locations } };
    }
  };
}

/**
 * Return `Action` after failing to fetching locations.
 */
export function fetchLocationsFailure(error: any): Action {
  return {
    type: 'FetchLocationsFailure',
    reducer(state) {
      return { ...state, locationsCache: { isFetching: false, error } };
    }
  };
}

/**
 * Return `ThunkAction` to fetch locations.
 */
export function fetchLocations(
): ThunkAction<Promise<void>, State, any, Action> {
  return async (dispatch, getState) => {
    const locationsCache = getState().locationsCache;
    if (!locationsCache.isFetching && !locationsCache.locations) {
      dispatch(fetchLocationsStart());
      try {
        const res = await superagent.get(`${URL}/locations`);
        const locations = res.body as Location[];
        dispatch(fetchLocationsSuccess(locations));
      } catch (error) {
        dispatch(fetchLocationsFailure(error));
      }
    }
  };
}

/**
 * Returns `Action` to start fetching Transactions.
 */
export function fetchTransactionsStart(): Action {
  return {
    type: 'FetchTransactionsStart',
    reducer(state) {
      return { ...state, transactionsCache: { isFetching: true } };
    }
  };
}

/**
 * Return `Action` after successfully fetching Transactions.
 */
export function fetchTransactionsSuccess(
  transactions: Transaction[]
): Action {
  return {
    type: 'FetchTransactionsSuccess',
    reducer(state) {
      return {
        ...state,
        transactionsCache: { isFetching: false, transactions }
      };
    }
  };
}

/**
 * Return `Action` after failing to fetching Transactions.
 */
export function fetchTransactionsFailure(error: any): Action {
  return {
    type: 'FetchTransactionsFailure',
    reducer(state) {
      return { ...state, transactionsCache: { isFetching: false, error } };
    }
  };
}

/**
 * Return `ThunkAction` to fetch Transactions.
 */
export function fetchTransactions(
  query: Partial<Header>
): ThunkAction<Promise<void>, State, null, Action> {
  return async (dispatch, getState) => {
    const transactionsCache = getState().transactionsCache;
    if (
      !transactionsCache.isFetching &&
      (
        !transactionsCache.transactions ||
        !_.isEqual(transactionsCache.query, query)
      )
    ) {
      dispatch(fetchTransactionsStart());
      try {
        const res = await superagent.get(`${URL}/transactions`)
          .query(query);
        const transactions = res.body as Transaction[];
        dispatch(fetchTransactionsSuccess(transactions));
      } catch (error) {
        dispatch(fetchTransactionsFailure(error));
      }
    }
  };
}
