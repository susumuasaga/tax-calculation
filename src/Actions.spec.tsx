import { fetchLocationsFailure, fetchTransactionsFailure } from './Actions';
import { reducer } from './reducer';

let error: Error;

describe('Actions', () => {
  beforeAll(() => {
    error = new Error("Deu pau.");
  });

  describe('fetchLocationsFailure Action', () => {
    it('should return an Action that adds an error to locationsCache', () => {
      const isFetching = false;
      const state = reducer(
        {
          locationsCache: { isFetching },
          transactionsCache: { isFetching },
          transactionCache: { isFetching }
        },
        fetchLocationsFailure(error)
      );
      expect(state.locationsCache.error)
        .toBe(error);
    });
  });

  describe('fetchTransactionsFailure Action', () => {
    it('should return an Action that adds an error to transactionsCache', () => {
      const isFetching = false;
      const state = reducer(
        {
          locationsCache: { isFetching },
          transactionsCache: { isFetching },
          transactionCache: { isFetching }
        },
        fetchTransactionsFailure(error)
      );
      expect(state.transactionsCache.error)
        .toBe(error);
    });
  });

  // Other Actions are tested integrated with other modules.
});
