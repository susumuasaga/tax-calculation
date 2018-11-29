import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Pagination, PaginationItem } from 'reactstrap';
import * as queryString from 'query-string';
import { TransactionsCache } from '../State';
import { Link } from 'react-router-dom';
import { TransactionHeader } from './TransactionHeader';

export type Props = {
  page: number;
  cache: TransactionsCache;
  onInit(): void;
};

let query: string;

/**
 * Transactions component.
 * Input transactions cache.
 * Output onInit() Called at the start.
 */
export function Transactions({ page, cache, onInit }: Props) {
  onInit();
  const isFetching = cache.isFetching;
  const transactions = cache.transactions;
  query = queryString.stringify(cache.query!);

  if (!transactions) {
    return (
      <h2>Carregando...</h2>
    );
  } else {
    const PAGE_SIZE = 10;
    const length = transactions.length;
    const start = (page - 1) * PAGE_SIZE;
    const end = Math.min(page * PAGE_SIZE, length);
    const pagesCount = Math.ceil(length / PAGE_SIZE);

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
        <p></p>
        <Pagination style={{ justifyContent: 'center'}}>
          <PaginationItem disabled={page <= 1}>
            <Link className="page-link" to={urlToPage(page - 1)}>&laquo;</Link>
          </PaginationItem>
          {Array.from({ length: pagesCount })
            .map((e, index) =>
            <PaginationItem active={page === index + 1} key={index}>
              <Link className="page-link" to={urlToPage(index + 1)}>
                {index + 1}
              </Link>
            </PaginationItem>)}
          <PaginationItem disabled={page >= pagesCount}>
            <Link className="page-link" to={urlToPage(page + 1)}>&raquo;</Link>
          </PaginationItem>
        </Pagination>
      </Container>
    );
  }
}

function urlToPage(page: number) {
  return `/transactions?${query}&page=${page.toString()}`;
}
