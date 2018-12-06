"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const models = __importStar(require("express-cassandra"));
const uuid_validate_1 = __importDefault(require("uuid-validate"));
const company = {
    fields: {
        id: {
            type: 'uuid',
            default: () => models.uuid()
                .toString(),
            rule: { validator: uuid_validate_1.default }
        },
        code: { type: 'text', rule: { required: true } },
        name: { type: 'text', rule: { required: true } }
    },
    key: ['id']
};
module.exports = company;
