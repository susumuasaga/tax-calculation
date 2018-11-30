import { Location } from './models/Entity';
import { Transaction, Header, TransactionKey } from './models/Transaction';

/**
 * Central State
 */
export interface State {
  locationsCache: LocationsCache;
  transactionsCache: TransactionsCache;
  transactionCache: TransactionCache;
}

/**
 * Locations Cache
 */
export interface LocationsCache {
  isFetching: boolean;
  locations?: Location[];
  error?: Error;
}

/**
 * TransactionsCache
 */
export interface TransactionsCache {
  isFetching: boolean;
  query?: Partial<Header>;
  transactions?: Transaction[];
  error?: Error;
}

/**
 * Transaction Cache
 */
export interface TransactionCache {
  isFetching: boolean;
  query?: TransactionKey;
  transaction?: Transaction;
  error?: Error;
}
