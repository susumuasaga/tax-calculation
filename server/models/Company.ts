import * as models from 'express-cassandra';

/**
 * Company Interface
 */
export interface Company {
  /**
   * Company ID
   * Format UUID
   */
  id: string;
  /**
   * Company Code
   */
  code: string;
  /**
   * Company name
   */
  name: string;
}

/**
 * Company Document
 */
export interface CompanyDoc extends Company, models.Document {}
