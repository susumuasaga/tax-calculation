import { HttpError } from './httpErrors';

/**
 * Defines interface of an error Logger
 */
export interface Logger {
  /**
   * Logs an error
   */
  error(error: HttpError): void;
}
