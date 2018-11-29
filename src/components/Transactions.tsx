import * as React from 'react';
import * as moment from 'moment';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { TransactionsCache } from '../State';
import { Link } from 'react-router-dom';
import { cityState } from './cityState';

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
    return (
      <Container>
        <h2>Empresas({transactions.length})</h2>
        <p>
          Clique sobre uma linha para abrir a transação desejada.
        </p>
        <ListGroup style={{ opacity: (isFetching ? 0.5 : 1) }}>
          {
            transactions
              .slice(
                (page - 1) * 10,
                Math.min(page * 10, transactions.length)
              )
              .map((transaction, index) =>
                <ListGroupItem key={index}>
                  <Link to={`/transactions?companyTransaction=${transaction}`}>
                    <Row>
                      <Col lg="4">
                        TIPO: {transaction.header.transactionType}<br />
                        <b>EMPRESA</b><br />
                        CNPJ: {transaction.header.location!.federalTaxId}<br />
                        CIDADE: {cityState(transaction.header.location!)}
                      </Col>
                      <Col lg="4">
                        DATA: {moment(transaction.header.transactionDate)
                          .format('DD/MM/YYYY')}<br />
                        <b>CONTRAPARTE</b><br />
                        CNPJ: {transaction.header.entity &&
                          transaction.header.entity.federalTaxId}<br />
                        CIDADE: {cityState(transaction.header.entity)}
                      </Col>
                      <Col lg="4">
                        CÓDIGO: {transaction.header.documentCode}<br />
                        <b>RESUMO</b><br />
                        {keyValueCurrency(
                          'SUBTOTAL:',
                          transaction.calculatedTaxSummary!.subtotal, transaction.header.currency
                        )}<br />
                        {keyValueCurrency(
                          'IEC:',
                          transaction.calculatedTaxSummary!.taxByType.iec.tax, transaction.header.currency
                        )}<br />
                        {keyValueCurrency(
                          'IST:',
                          transaction.calculatedTaxSummary!.taxByType.ist.tax, transaction.header.currency
                        )}<br />
                        {keyValueCurrency(
                          'ISC:',
                          transaction.calculatedTaxSummary!.taxByType.isc.tax, transaction.header.currency
                        )}<br />
                        {keyValueCurrency(
                          'TOTAL GERAL:',
                          transaction.calculatedTaxSummary!.grandTotal, transaction.header.currency
                        )}
                      </Col>
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

function keyValueCurrency(key: string, value: number, currency: string) {
  return (
    <span style={{ textAlign: 'left' }}>
      {key}
      <span style={{ float: 'right' }}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </span>
  );
}
