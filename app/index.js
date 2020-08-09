"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./src/server/server");
const server = new server_1.Server(3000);
server.startServer();
