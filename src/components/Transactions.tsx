import * as React from 'react';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { TransactionsCache } from '../State';
import { Link } from 'react-router-dom';

export type Props = {
  cache: TransactionsCache;
  onInit(): void;
};

/**
 * Transactions component.
 * Input transactions cache.
 * Output onInit() Called at the start.
 */
export function Transactions({ cache, onInit }: Props) {
  onInit();
  const isFetching = cache.isFetching;
  const transactions = cache.transactions;

  if (!transactions) {
    return (
      <h2>Carregando...</h2>
    );
  } else {
    return (
      <Container>
        <h2>Empresas({transactions.length})</h2>
        <p>
          Clique sobre uma linha para abrir as transações da empresa desejada.
        </p>
        <ListGroup style={{ opacity: (isFetching ? 0.5 : 1) }}>
          {
            transactions.map((transaction, index) =>
              <ListGroupItem key={index}>
                <Link to={`/transactions?companyTransaction=${transaction}`}>
                  <Row>
                  </Row>
                </Link>
              </ListGroupItem>
            )
          }
        </ListGroup>
      </Container>
    );
  }
}
