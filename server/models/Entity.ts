import * as models from 'express-cassandra';
import { Address } from './Address';

/**
 * Entity Interface
 */
export interface Entity {
  /**
   * Email
   */
  email?: string;
  /**
   * Federal Tax ID, CNPJ or CPF
   */
  federalTaxId?: string;
  /**
   * State Tax ID
   */
  stateTaxId?: string;
  /**
   * City Tax ID
   */
  cityTaxId?: string;
  /**
   * Suframa Code
   * format [0-9]{8,9}
   */
  suframa?: string;
  /**
   * Tax Regime
   */
  taxRegime?: 'individual' | 'simplified' | 'estimatedProfit' | 'realProfit';
  /**
   * Type
   * Identifies if the location is a governmental body and
   * the level of government to which it belongs.
   */
  type?:
    'cityGovernment' |
    'stateGovernment' |
    'federalGovernment';
  /**
   * Location Address
   */
  address?: Address;
}

/**
 * Location Interface
 */
export interface Location extends Entity {
  /**
   * Company ID
   * Format UUID
   */
  companyId?: string;
  /**
   * Location Code
   */
  code?: string;
  /**
   * Main Activity
   */
  mainActivity?: 'commerce' | 'industry' | 'service';
}

/**
 * Location Document
 */
export interface LocationDoc extends models.Document, Location {}
