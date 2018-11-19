import httpStatus from 'http-status';

/**
 * Common interface for Http Error.
 */
export interface HttpError extends Error {
  readonly statusCode: number;
  readonly message: string;
}

/**
 * Error sent when the resource was not found.
 */
export class NotFound implements HttpError {
  public readonly name: string = 'NotFound';
  public readonly statusCode: number = httpStatus.NOT_FOUND;

  constructor(
    public readonly message: string = 'O recurso requerido não foi encontrado.'
  ) {}
}

/**
 * Error sent when the request is invalid.
 */
export class BadRequest implements HttpError {
  public readonly name: string = 'BadRequest';
  public readonly statusCode: number = httpStatus.BAD_REQUEST;

  constructor (
    public readonly message: string = 'Pedido inválido.'
  ) {}
}

/**
 * Error sent when user is unauthorized to do an operation.
 */
export class Unauthorized implements HttpError {
  public readonly name: string = 'Unauthorized';
  public readonly statusCode: number = httpStatus.UNAUTHORIZED;

  constructor (
    public readonly message: string = 'Não autorizado.'
  ) {}
}
