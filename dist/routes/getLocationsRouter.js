"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
function getLocationsRouter(locationModel) {
    const router = express_1.Router();
    router.get('/', async (req, res) => {
        const query = req.query;
        const locations = await locationModel.findAsync(query, { raw: true, allow_filtering: true });
        res.json(locations);
    });
    return router;
}
exports.getLocationsRouter = getLocationsRouter;
