import * as React from 'react';
import { Transaction } from '../models/Transaction';
import { Row } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import * as moment from 'moment';
import { ValueDescription } from './ValueDescription';
import { Entity } from './Entity';

export type Props = { transaction: Transaction };

/**
 * React component to display data associated with the entire transaction.
 */
export function TransactionHeader({ transaction }: Props) {
  const header = transaction.header;
  const currency = header.currency;
  const calculatedTaxSummary = transaction.calculatedTaxSummary;

  return (
    <div>
      <Row>
        <Col lg="4">
          <h3>{header.transactionType}</h3>
        </Col>
        <Col lg="4">
          Data: {moment(header.transactionDate)
            .format('DD/MM/YYYY')}
        </Col>
        <Col lg="4">
          Código: {header.documentCode}
        </Col>
      </Row>
      <Row>
        <Col lg="4">
          <Entity title="Empresa" entity={header.location} />
        </Col>
        <Col lg="4">
          <Entity title="Contraparte" entity={header.entity} />
        </Col>
        <Col lg="4">
          <h4>Resumo</h4>
          <ValueDescription {...{
            name: 'Subtotal:',
            value: calculatedTaxSummary!.subtotal,
            currency
          }} /><br />
          <ValueDescription {...{
            name: 'IEC:',
            value: calculatedTaxSummary!.taxByType.iec.tax,
            currency
          }} /><br />
          <ValueDescription {...{
            name: 'IST:',
            value: calculatedTaxSummary!.taxByType.ist.tax,
            currency
          }} /><br />
          <ValueDescription {...{
            name: 'ISC:',
            value: calculatedTaxSummary!.taxByType.isc.tax,
            currency
          }} /><br />
          <hr />
          <ValueDescription {...{
            name: 'TOTAL GERAL:',
            value: calculatedTaxSummary!.grandTotal,
            currency
          }} />
        </Col>
      </Row>
    </div>
  );
}
