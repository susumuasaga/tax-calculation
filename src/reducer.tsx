import { State } from './State';
import { Action } from './Actions';

/**
 * Main reducer.
 */
export function reducer(state: State, action: Action): State {
  if (action.reducer) {
    return action.reducer(state);
  }

  return state;
}
