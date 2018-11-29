import { Entity } from '../models/Entity';

/**
 * Returns formated city and state of an `Entity`.
 * If city is undefined returns just state.
 * If city is defined formats ${cityName} - ${state}
 */
export function cityState(entity?: Entity): string {
  if (!entity) {
    return '';
  } else {
    const cityName = entity.address.cityName;
    const state = entity.address.state;
    if (cityName) {
      return `${cityName} - ${state}`;
    } else {
      return state;
    }
  }
}
