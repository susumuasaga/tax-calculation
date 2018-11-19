"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeLogger {
    get lastError() {
        return this._lastError;
    }
    error(error) {
        this._lastError = error;
    }
    clearErrorLog() {
        this._lastError = undefined;
    }
}
exports.FakeLogger = FakeLogger;
