import * as React from 'react';
import { Entity } from '../models/Entity';
import { cityState } from './cityState';

export type Props = { title: string; entity?: Entity };

/**
 * React component to display an `Entity`.
 * Since `Location` is an `Entity`, it also works for `Location`.
 */
export function Entity({ title, entity }: Props) {
  return(
    <div>
      <h4>{title}</h4>
      {entity &&
        <div>
          {entity.federalTaxId}<br />
          {cityState(entity.address)}<br />
          {entity.taxRegime && <span>{entity.taxRegime}<br /></span>}
          {entity.type && <span>{entity.type}<br /></span>}
          {entity.suframa && `Suframa: ${entity.suframa}`}
        </div>
      }
    </div>
  );
}
