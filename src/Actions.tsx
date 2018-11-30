import * as Redux from 'redux';
import * as superagent from 'superagent';
import * as _ from 'lodash';
import { State } from './State';
import { Location } from './models/Entity';
import { ThunkAction } from 'redux-thunk';
import { Transaction, Header, TransactionKey } from './models/Transaction';

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
export function fetchLocationsFailure(error: Error): Action {
  return {
    type: 'FetchLocationsFailure',
    reducer(state) {
      return {
        ...state,
        transactionCache: {
          query: state.transactionCache.query,
          isFetching: false,
          error
        }
      };
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
        dispatch(fetchLocationsFailure(error as Error));
      }
    }
  };
}

/**
 * Returns `Action` to start fetching Transactions.
 */
export function fetchTransactionsStart(query: Partial<Header>): Action {
  return {
    type: 'FetchTransactionsStart',
    reducer(state) {
      return { ...state, transactionsCache: { isFetching: true, query } };
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
        transactionsCache: {
          query: state.transactionsCache.query,
          isFetching: false,
          transactions }
      };
    }
  };
}

/**
 * Return `Action` after failing to fetching Transactions.
 */
export function fetchTransactionsFailure(error: Error): Action {
  return {
    type: 'FetchTransactionsFailure',
    reducer(state) {
      return {
        ...state,
        transactionCache: {
          query: state.transactionCache.query,
          isFetching: false,
          error
        }
      };
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
      dispatch(fetchTransactionsStart(query));
      try {
        const res = await superagent.get(`${URL}/transactions`)
          .query(query);
        const transactions = res.body as Transaction[];
        dispatch(fetchTransactionsSuccess(transactions));
      } catch (error) {
        dispatch(fetchTransactionsFailure(error as Error));
      }
    }
  };
}

/**
 * Returns `Action` to start fetching a Transaction.
 */
export function fetchTransactionStart(query: TransactionKey): Action {
  return {
    type: 'FetchTransactionStart',
    reducer(state) {
      return { ...state, transactionCache: { isFetching: true, query } };
    }
  };
}

/**
 * Return `Action` after successfully fetching Transaction.
 */
export function fetchTransactionSuccess(
  transaction: Transaction
): Action {
  return {
    type: 'FetchTransactionSuccess',
    reducer(state) {
      return {
        ...state,
        transactionCache: {
          query: state.transactionCache.query,
          isFetching: false,
          transaction
        }
      };
    }
  };
}

/**
 * Return `Action` after failing to fetching Transaction.
 */
export function fetchTransactionFailure(error: Error): Action {
  return {
    type: 'FetchTransactionFailure',
    reducer(state) {
      return {
        ...state,
        transactionCache: {
          query: state.transactionCache.query,
          isFetching: false,
          error
        }
      };
    }
  };
}

/**
 * Return `ThunkAction` to fetch Transaction.
 */
export function fetchTransaction(
  query: TransactionKey
): ThunkAction<Promise<void>, State, null, Action> {
  return async (dispatch, getState) => {
    const transactionCache = getState().transactionCache;
    if (
      !transactionCache.isFetching &&
      (
        !transactionCache.transaction ||
        !_.isEqual(transactionCache.query, query)
      )
    ) {
      dispatch(fetchTransactionStart(query));
      try {
        const res = await superagent.get(`${URL}/transactions`)
          .query(query);
        const transactions = res.body as Transaction[];
        if (transactions.length === 0) {
          throw new Error(
            `Transação não encontrada com
companyLocation = ${query.companyLocation}
transactionDate = ${query.transactionDate}
documentCode = ${query.documentCode}`
          );
        }
        dispatch(fetchTransactionSuccess(transactions[0]));
      } catch (error) {
        dispatch(fetchTransactionFailure(error as Error));
      }
    }
  };
}
