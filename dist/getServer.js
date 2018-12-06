"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getServer(app, port) {
    return new Promise(resolve => { const server = app.listen(3000, () => { resolve(server); }); });
}
exports.getServer = getServer;
