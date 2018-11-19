"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const app = express_1.default();
app.use('/node_modules', express_1.default.static('node_modules'));
app.use(['/product', '/category', '/checkout', '/search', '/callback'], (req, res) => {
    res.sendFile(path.resolve('build/index.html'));
});
app.use(express_1.default.static('dist'));
app.listen(3000);
