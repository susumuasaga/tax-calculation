import { Address } from '../models/Address';

/**
 * Returns formated city and state of an `Address`.
 * If city is undefined returns just state.
 * If city is defined formats ${cityName} - ${state}
 */
export function cityState(address?: Address): string {
  if (!address) {
    return '';
  } else {
    const cityName = address.cityName;
    const state = address.state;
    if (cityName) {
      return `${cityName} - ${state}`;
    } else {
      return state;
    }
  }
}
