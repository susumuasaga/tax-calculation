import { Location } from './models/Entity';
import { Transaction } from './models/Transaction';

/**
 * Central State
 */
export interface State {
  locationsCache: LocationsCache;
  transactionsCache: TransactionsCache;
}

/**
 * Locations Cache
 */
export interface LocationsCache {
  isFetching: boolean;
  locations?: Location[];
}

/**
 * TransactionsCache
 */
export interface TransactionsCache {
  isFetching: boolean;
  transactions?: Transaction[];
}
