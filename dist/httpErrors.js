"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
class NotFound {
    constructor(message = 'O recurso requerido não foi encontrado.') {
        this.message = message;
        this.name = 'NotFound';
        this.statusCode = http_status_1.default.NOT_FOUND;
    }
}
exports.NotFound = NotFound;
class BadRequest {
    constructor(message = 'Pedido inválido.') {
        this.message = message;
        this.name = 'BadRequest';
        this.statusCode = http_status_1.default.BAD_REQUEST;
    }
}
exports.BadRequest = BadRequest;
class Unauthorized {
    constructor(message = 'Não autorizado.') {
        this.message = message;
        this.name = 'Unauthorized';
        this.statusCode = http_status_1.default.UNAUTHORIZED;
    }
}
exports.Unauthorized = Unauthorized;
