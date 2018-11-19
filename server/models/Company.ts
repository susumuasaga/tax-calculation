import * as models from 'express-cassandra';

/**
 * Company Document Interface
 */
export interface CompanyDoc extends models.Document {
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
