import { createStore, applyMiddleware } from 'redux';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';
import { reducer } from './reducer';
import { State } from './State';
import { Action } from './Actions';

/**
 * configureStore
 * Configure `Store` and returns it.
 */
export function configureStore(preloadedState: State) {
  return createStore<
    State,
    Action,
    { dispatch: ThunkDispatch<State, {}, Action> },
    {}
  >(reducer, preloadedState, applyMiddleware(reduxThunk));
}
