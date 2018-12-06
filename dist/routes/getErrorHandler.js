"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
function getErrorHandler(logger) {
    return (err, req, res, next) => {
        logger.error(err);
        delete err.stack;
        let statusCode = err.statusCode;
        if (!statusCode) {
            statusCode = http_status_1.INTERNAL_SERVER_ERROR;
        }
        res.status(statusCode)
            .json(err);
    };
}
exports.getErrorHandler = getErrorHandler;
