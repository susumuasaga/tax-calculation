import * as models from 'express-cassandra';

/**
 * Item Interface
 */
export interface Item {
  /**
   * Company ID
   * Format UUID
   */
  companyId?: string;
  /**
   * ERP Code
   */
  code?: string;
  /**
   * Item Description
   */
  description?: string;
  /**
   * Product Type
   */
  productType: 'product' | 'merchandise';
  /**
   * Federal Tax
   */
  federalTax?: FederalTax;
}

/**
 * Item Document
 */
export interface ItemDoc extends models.Document, Item {}

/**
 * FederalTax Interface
 */
export interface FederalTax {
  /**
   * IEC Tax
   */
  IEC: TaxType;
  /**
   * IST Tax
   */
  IST: TaxType;
  /**
   * ISC Tax
   */
  ISC: TaxType;
}

/**
 * TaxType Interface
 */
export interface TaxType {
  /**
   * Rate
   */
  rate?: number;
  /**
   * Fact
   */
  fact?: number;
}
