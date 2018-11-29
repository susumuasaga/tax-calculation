import * as React from 'react';

export type Props = { name: string; value: number; currency: string };

/**
 * React component for displaying a description of a monetary value.
 */
export function ValueDescription({ name, value, currency = 'BRL' }: Props) {
  return (
      <span style={{ textAlign: 'left' }}>
        {name}
        <span style={{ float: 'right' }}>
          {value.toLocaleString('pt-BR', { style: 'currency', currency })}
        </span>
      </span>
  );
}
