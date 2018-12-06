import { State } from '../State';
import * as Component from '../components/Transaction';
import { Action, fetchTransaction } from '../Actions';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import * as queryString from 'query-string';
import { TransactionKey } from '../models/Transaction';

type Props = { location: { search: string } };

function mapStateToProps({ transactionCache }: State): Partial<Component.Props> {
  return { transactionCache };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, any, Action>,
  { location: { search } }: Props
): Partial<Component.Props> {
  const query = queryString.parse(search) as unknown as TransactionKey;

  return {
    onInit: async () => dispatch(fetchTransaction(query))
  };
}

/**
 * Transaction container.
 * Props = { location: { search: string } }
 */
export const Transaction = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component.Transaction);
