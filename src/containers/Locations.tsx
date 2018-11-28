import { State } from '../State';
import * as Component from '../components/Locations';
import { Action, fetchLocations } from '../Actions';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

function mapStateToProps({ locationsCache }: State): Partial<Component.Props> {
  return {
    cache: locationsCache
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<State, any, Action>):
  Partial<Component.Props> {
    return {
      onInit: async () => dispatch(fetchLocations())
    };
}

/**
 * Locations component.
 * Input locations.
 * Output onClick(index).
 */
export const Locations = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component.Locations);
