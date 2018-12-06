import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Breadcrumb, BreadcrumbItem, Alert } from 'reactstrap';
import { TransactionCache } from '../State';
import { Link } from 'react-router-dom';
import { TransactionHeader } from './TransactionHeader';
import { Line } from './Line';

export type Props = {
  transactionCache: TransactionCache;
  onInit(): void;
};

/**
 * Transaction component.
 * Input transaction cache.
 * Output onInit() called at the start.
 */
export function Transaction({ transactionCache, onInit }: Props) {
  onInit();
  const transaction = transactionCache.transaction;
  const error = transactionCache.error;

  return (
    <Container>
      {
        !error && !transaction &&
        <Alert color="primary">
          <h2>Carregando...</h2>;
        </Alert>
      }
      {
        error &&
        <div>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/locations">Empresas</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Transações</BreadcrumbItem>
            <BreadcrumbItem>Detalhes da transação</BreadcrumbItem>
          </Breadcrumb>
          <Alert color="danger">
            <h2>Erro</h2>
            <p>{error.message}</p>
          </Alert>
        </div>
      }
      {
        transaction &&
        <div>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/locations">Empresas</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={
                `/transactions?companyLocation=${
                transactionCache.query!.companyLocation
                }`
              }>Transações</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Detalhes da transação</BreadcrumbItem>
          </Breadcrumb>
          <h2>Detalhes da transação</h2>
          <ListGroup style={{
            opacity: (transactionCache.isFetching ? 0.5 : 1)
          }}>
            <ListGroupItem>
              <TransactionHeader {...{ transaction }} />
            </ListGroupItem>
            {
              transaction.lines.map((line, index) =>
                <ListGroupItem key={index}>
                  <Line {...{ line, currency: transaction.header.currency }} />
                </ListGroupItem>
              )
            }
          </ListGroup>
        </div>
      }
    </Container>
  );
}
