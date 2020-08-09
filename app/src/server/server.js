"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testroute_1 = require("./routes/testroute");
class Server {
    constructor(port) {
        this._port = port;
        this._app = express_1.default();
    }
    configureServer() {
        this._app.use(express_1.default.json());
    }
    setRouter() {
        this._app.use('/', testroute_1.test);
    }
    startServer() {
        this.configureServer();
        this.setRouter();
        this._app.listen(this._port, () => {
            console.log(`Server starded on port ${this._port}...`);
        });
    }
}
exports.Server = Server;
