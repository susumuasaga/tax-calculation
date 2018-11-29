import * as React from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { TransactionsCache } from '../State';
import { Link } from 'react-router-dom';
import { TransactionHeader } from './TransactionHeader';

export type Props = {
  page: number;
  cache: TransactionsCache;
  onInit(): void;
};

/**
 * Transactions component.
 * Input transactions cache.
 * Output onInit() Called at the start.
 */
export function Transactions({ page, cache, onInit }: Props) {
  onInit();
  const isFetching = cache.isFetching;
  const transactions = cache.transactions;

  if (!transactions) {
    return (
      <h2>Carregando...</h2>
    );
  } else {
    const start = (page - 1) * 10;
    const end = Math.min(page * 10, transactions.length);

    return (
      <Container>
        <h2>Transações {start + 1} a {end} de {transactions.length}</h2>
        <p>
          Clique sobre uma linha para abrir a transação desejada.
        </p>
        <ListGroup style={{ opacity: (isFetching ? 0.5 : 1) }}>
          {
            transactions.slice(start, end)
              .map((transaction, index) =>
                <ListGroupItem key={index}>
                  <Link to={`/transactions?companyTransaction=${transaction}`}>
                    <TransactionHeader {...{ transaction }} />
                  </Link>
                </ListGroupItem>
              )
          }
        </ListGroup>
      </Container>
    );
  }
}
