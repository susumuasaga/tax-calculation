import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Pagination, PaginationItem, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import * as queryString from 'query-string';
import { TransactionsCache } from '../State';
import { Link } from 'react-router-dom';
import { TransactionHeader } from './TransactionHeader';

export const PAGE_SIZE = 10;

export type Props = {
  page: number;
  transactionsCache: TransactionsCache;
  onInit(): void;
};

let query: string;

/**
 * Transactions component.
 * Input transactions cache.
 * Output onInit() Called at the start.
 */
export function Transactions({ page, transactionsCache, onInit }: Props) {
  onInit();
  const transactions = transactionsCache.transactions;
  const error = transactionsCache.error;
  query = queryString.stringify(transactionsCache.query!);

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/locations">Empresas</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Transações</BreadcrumbItem>
      </Breadcrumb>
      {
        !error && !transactions &&
        <Alert color="primary">
          <h2>Carregando...</h2>;
        </Alert>
      }
      {
        error &&
        <Alert color="danger">
          <h2>Erro</h2>
          <p>{error.message}</p>
        </Alert>
      }
      {
        transactions &&
        <div>
          <h2>
            Transações {(page - 1) * PAGE_SIZE + 1} a&nbsp;
            {Math.min(page * PAGE_SIZE, transactions.length)} de&nbsp;
            {transactions.length}
          </h2>
          <p>
            Clique sobre uma linha para abrir os detalhes da transação.
          </p>
          <ListGroup style={{
            opacity: (transactionsCache.isFetching ? 0.5 : 1)
          }}>
            {
              transactions.slice(
                (page - 1) * PAGE_SIZE,
                Math.min(page * PAGE_SIZE, transactions.length)
              )
                .map((transaction, index) =>
                  <ListGroupItem key={index}>
                    <Link to={
                      `/transaction\
?companyLocation=${transaction.header.companyLocation}\
&transactionDate=${transaction.header.transactionDate}\
&documentCode=${transaction.header.documentCode}`
                    }>
                      <TransactionHeader {...{ transaction }} />
                    </Link>
                  </ListGroupItem>
                )
            }
          </ListGroup>
          <p></p>
          <Pagination style={{ justifyContent: 'center' }}>
            <PaginationItem disabled={page <= 1}>
              <Link className="page-link" to={urlToPage(page - 1)}>&laquo;</Link>
            </PaginationItem>
            {Array.from({ length: Math.ceil(transactions.length / PAGE_SIZE) })
              .map((e, index) =>
                <PaginationItem active={page === index + 1} key={index}>
                  <Link className="page-link" to={urlToPage(index + 1)}>
                    {index + 1}
                  </Link>
                </PaginationItem>)}
            <PaginationItem disabled={
              page >= Math.ceil(transactions.length / PAGE_SIZE)
            }>
              <Link className="page-link" to={urlToPage(page + 1)}>&raquo;</Link>
            </PaginationItem>
          </Pagination>
        </div>
      }
    </Container>
  );
}

function urlToPage(page: number) {
  return `/transactions?${query}&page=${page.toString()}`;
}
