import { State } from './State';
import { Action } from './Actions';

/**
 * Main reducer.
 */
export function reducer(
  state: State = {
    locationsCache: { isFetching: false },
    transactionsCache: { isFetching: false },
    transactionCache: { isFetching: false }
  },
  action: Action
): State {
  if (action.reducer) {
    return action.reducer(state);
  }

  return state;
}
