"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function create(model, values) {
    for (const value of values) {
        const document = new model(value);
        await document.saveAsync();
    }
}
exports.create = create;
