import * as React from 'react';
import { Line } from '../models/Transaction';
import { Row, Col, Table } from 'reactstrap';
import { ValueDescription } from './ValueDescription';
import { TaxDetail } from './TaxDetail';

export type Props = { line: Line; currency: string };

/**
 * React component to display a `Transaction` `Line`.
 */
export function Line({ line, currency = 'BRL' }: Props) {
  const item = line.item!;

  return (
    <div>
      <Row>
        <Col lg="8">
          <b>Código do produto: </b>{item.code}<br />
          {(item.description) && <span>{item.description}<br /></span>}
          {item.productType}<br />
          {(line.numberOfItems) &&
            <span>
              <b>Quantidade: </b>{line.numberOfItems}<br />
            </span>}
          <b>Preço unitário: </b>{line.itemPrice}<br />
          <b>CST: </b>{line.calculatedTax!.CST}
        </Col>
        <Col lg="4">
          <ValueDescription {...{
            name: 'Montante:',
            value: line.lineAmount ||
              (line.numberOfItems || 1) * line.itemPrice,
            currency
          }} /><br />
          <ValueDescription {...{
            name: 'Outros custos:',
            value: line.otherCostAmount || 0,
            currency
          }} /><br />
          <ValueDescription {...{
            name: 'Desconto:',
            value: -(line.lineDiscount || 0),
            currency
          }} /><br />
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Table responsive>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Jurisdição</th>
                <th>Cenário</th>
                <th>Base de cálculo</th>
                <th>Alíquota</th>
                <th>Redução</th>
                <th>Imposto</th>
              </tr>
            </thead>
            <tbody>
              <TaxDetail {...{
                taxDetail: line.calculatedTax!.taxDetails.iec,
                currency
              }} />
              <TaxDetail {...{
                taxDetail: line.calculatedTax!.taxDetails.ist,
                currency
              }} />
              <TaxDetail {...{
                taxDetail: line.calculatedTax!.taxDetails.isc,
                currency
              }} />
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}
