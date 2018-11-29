import { State } from '../State';
import * as Component from '../components/Transactions';
import { Action, fetchTransactions } from '../Actions';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

type Props = { location: { search: string } };

function mapStateToProps(
  { transactionsCache }: State,
  { location: { search } }: Props
): Partial<Component.Props> {
  return {
    cache: transactionsCache
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, any, Action>,
  { location: { search } }: Props
): Partial<Component.Props> {
  return {
    onInit: async () => dispatch(fetchTransactions({}))
  };
}

/**
 * Transactions component.
 * Input locations.
 * Output onClick(index).
 */
export const Transactions = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component.Transactions);
