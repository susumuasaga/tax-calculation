import { HttpError } from '../httpErrors';
import { Logger } from '../logger';

/**
 * Error logger for testing purposes.
 * Implements Logger, but just logs the last error.
 */
export class FakeLogger implements Logger {
  private _lastError: HttpError;

  /**
   * Get the last logged error
   */
  public get lastError(): HttpError {
    return this._lastError;
  }

  public error(error: HttpError): void {
    this._lastError = error;
  }

  /**
   * Clear the error log
   */
  public clearErrorLog(): void {
    this._lastError = undefined;
  }
}
