"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testhandler_1 = require("../handlers/testhandler");
const testRouter = express_1.Router();
exports.test = testRouter.get('/avi', testhandler_1.testHandler);
