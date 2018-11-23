import { Logger } from '../logger';
import { Router, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from '../httpErrors';
import { INTERNAL_SERVER_ERROR } from 'http-status';

/**
 * Returns custom error handler.
 * Logs error for diagnostics.
 */
export function getErrorHandler(logger: Logger): ErrorRequestHandler {
  return (err: HttpError, req, res, next) => {
    logger.error(err);
    delete err.stack; // don't send error stack to client
    let statusCode = err.statusCode;
    if (statusCode === undefined) {
      statusCode = INTERNAL_SERVER_ERROR;
    }
    res.status(statusCode)
      .json(err);
  };
}
