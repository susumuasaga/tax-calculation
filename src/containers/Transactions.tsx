import { State } from '../State';
import * as Component from '../components/Transactions';
import { Action, fetchTransactions } from '../Actions';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import * as queryString from 'query-string';

type Props = { location: { search: string } };

function mapStateToProps(
  { transactionsCache }: State,
  { location: { search } }: Props
): Partial<Component.Props> {
  const query = queryString.parse(search);
  const page = Number(query.page || '1');

  return { cache: transactionsCache, page };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, any, Action>,
  { location: { search } }: Props
): Partial<Component.Props> {
  const query = queryString.parse(search);
  delete query.page;

  return { onInit: async () => dispatch(fetchTransactions(query))};
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
