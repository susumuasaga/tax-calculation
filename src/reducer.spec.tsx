import { reducer } from "./reducer";

describe('reducer', () => {
  it('if action reducer is undefined, should return the same state', () => {
    const isFetching = false;
    const state = {
      locationsCache: { isFetching },
      transactionsCache: { isFetching },
      transactionCache: { isFetching }
    };
    expect(reducer(state, { type: 'AnyAction' }))
     .toBe(state);
  });

  it('if state is undefined, should initialize state', () => {
    const isFetching = false;
    const state = {
      locationsCache: { isFetching },
      transactionsCache: { isFetching },
      transactionCache: { isFetching }
    };
    expect(reducer(undefined, { type: 'AnyAction' }))
      .toEqual(state);
  });
  // The rest of the reducer was tested integrated with other modules.
});
