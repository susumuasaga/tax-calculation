import * as React from 'react';
import { Detail } from '../models/Transaction';

export type Props = { taxDetail: Detail; currency: string };

/**
 * React component to display details of a tax.
 */
export function TaxDetail({ taxDetail, currency = 'BRL' }: Props) {
  return (
    <tr>
      <th scope="row">{taxDetail.taxType}</th>
      <td>{taxDetail.jurisdictionName}</td>
      <td>{taxDetail.scenario}</td>
      <td>{taxDetail.calcBase}</td>
      <td>{`${taxDetail.rate * 100}%`}</td>
      <td>{`${(taxDetail.fact || 0) * 100}%`}</td>
      <td>{
        taxDetail.tax.toLocaleString('pt-BR', { style: 'currency', currency })
      }</td>
    </tr>
  );
}
