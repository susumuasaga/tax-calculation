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
      <td align="right">{taxDetail.calcBase.toLocaleString(
        'pt-BR',
        { style: 'currency', currency }
      )}</td>
      <td align="right">{`${(taxDetail.rate * 100).toLocaleString(
        'pt-BR',
        {maximumFractionDigits: 2}
      )}%`}</td>
      <td align="right">{`${((taxDetail.fact || 0) * 100).toLocaleString(
        'pt-BR',
        {maximumFractionDigits: 2}
      )}%`}</td>
      <td align="right">{
        taxDetail.tax.toLocaleString('pt-BR', { style: 'currency', currency })
      }</td>
    </tr>
  );
}
