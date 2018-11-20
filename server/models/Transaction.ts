import * as models from 'express-cassandra';
import { Location, Entity } from './Entity';
import { Item } from './Item';

/**
 * Transaction Interface
 */
export interface Transaction {
  /**
   * Header
   */
  header: Header;
  /**
   * Lines
   */
  lines: Line[];
  /**
   * Summary
   */
  calculatedTaxSummary?: CalculatedTaxSummary;
  /**
   * Processing Info
   */
  processingInfo?: ProcessingInfo;
}

/**
 * Transaction Document Interface
 */
export interface TransactionDoc extends Transaction, models.Document {}

/**
 * Header Interface
 */
export interface Header {
  /**
   * Transaction Type
   */
  transactionType?: 'Sale' | 'Purchase';
  /**
   * Document Code
   */
  documentCode?: string;
  /**
   * Currency
   */
  currency?: 'BRL';
  /**
   * Transaction Date
   */
  transactionDate?: string; // format ISO 8601
  /**
   * Company Location Code
   */
  companyLocation?: string;
  /**
   * Company Location
   * Inserted field
   */
  location?: Location;
  /**
   * Entity
   */
  entity?: Entity;
}

/**
 * Line Interface
 */
export interface Line {
  /**
   * Line Code
   */
  lineCode?: number;
  /**
   * Item Code
   */
  itemCode?: string;
  /**
   * Item
   * Inserted field
   */
  item?: Item;
  /**
   * Number of Items, Quantity
   */
  numberOfItems?: number; // default 1
  /**
   * Item Price
   */
  itemPrice?: number;
  /**
   * Amount
   */
  lineAmount?: number; // default (numberOfItems * itemPrice)
  /**
   * Description
   */
  itemDescription?: string;
  /**
   * Use Type
   */
  useType?: 'use' | 'consumption' | 'resale' | 'production';
  /**
   * Discount
   */
  lineDiscount?: number; // default 0
  /**
   * Other Cost
   */
  otherCostAmount?: number; // default 0
  /**
   * Calculated Tax
   */
  calculatedTax?: CalculatedTax;
}

/**
 * CalculatedTax Interface
 */
export interface CalculatedTax {
  /**
   * Tax Details
   */
  taxDetails: TaxDetails;
  /**
   * CST
   */
  CST: '31' | '32' | '33' | '34' | '35' | '36' | '37' | '50' | '99';
  /**
   * Total Tax
   */
  tax: number;
}

/**
 * TaxDetails Interface
 */
export interface TaxDetails {
  /**
   * IEC Detail
   */
  iec: Detail;
  /**
   * IST Detail
   */
  ist: Detail;
  /**
   * ISC Detail
   */
  isc: Detail;
}

/**
 * (Tax)Detail Interface
 */
export interface Detail {
  /**
   * Jurisdiction Type
   */
  jurisdictionType: 'City' | 'State' | 'Country';
  /**
   * Depends on `jurisdictionType`, according to the following rule:
   * * `'City'`: emitter.address.cityName;
   * * `'State'`: receiver.address.state;
   * * `'Country'`: 'Brasil'
   */
  jurisdictionName: string;
  /**
   * Tax Type
   */
  taxType: 'IEC' | 'IST' | 'ISC';
  /**
   * Scenario
   */
  scenario: string;
  /**
   * Rate
   */
  rate: number;
  /**
   * Tax
   */
  tax: number;
  /**
   * Calculation Base
   */
  calcBase: number;
  /**
   * Fact
   */
  fact?: number;
  /**
   * Month
   */
  month?: string;
}

/**
 * CalculatedTaxSummary Interface
 */
export interface CalculatedTaxSummary {
  /**
   * Count of Lines
   */
  numberOfLines: number;
  /**
   * Sub Total
   * ∑(Line.lineAmount − Line.lineDiscount)
   */
  subtotal: number;
  /**
   * Total Tax
   * ∑(Line.calculatedTax.tax)
   */
  totalTax: number;
  /**
   * Grand Total
   * subtotal + totalTax
   */
  grandTotal: number;
  /**
   * Tax By Type
   */
  taxByType: TaxByTypes;
}

/**
 * TaxByTypes Interface
 */
export interface TaxByTypes {
  /**
   * IEC Summary
   */
  iec: TaxSummary;
  /**
   * IST Summary
   */
  ist: TaxSummary;
  /**
   * ISC Summary
   */
  isc: TaxSummary;
}

/**
 * TaxSummary Interface
 */
export interface TaxSummary {
  /**
   * Tax
   */
  tax: number;
  /**
   * Jurisdictions
   */
  jurisdictions: Jurisdiction[];
}

/**
 * Jurisdiction Interface
 */
export interface Jurisdiction {
  /**
   * Jurisdiction Type
   */
  jurisdictionType: 'City' | 'State' | 'Country';
  /**
   * Depends on `jurisdictionType`, according to the following rule:
   * * `'City'`: emitter.address.cityName;
   * * `'State'`: receiver.address.state;
   * * `'Country'`: 'Brasil'
   */
  jurisdictionName: string;
  /**
   * Tax by Jurisdiction
   */
  tax: number;
}

/**
 * ProcessingInfo Interface
 */
export interface ProcessingInfo {
  /**
   * Version ID
   */
  versionId: string;
  /**
   * Duration
   */
  duration: number;
}
