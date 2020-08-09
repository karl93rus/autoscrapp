"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContentProvider_1 = require("../../parsers/ContentProvider");
const AvitoParser_1 = require("../../parsers/AvitoParser");
exports.testHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pMin = req.query.pmin;
    const pMax = req.query.pmax;
    let avitoUrl = `https://www.avito.ru/krasnodar/avtomobili/s_probegom?pmax=${pMax}&pmin=${pMin}&radius=200&s=104`;
    const avitoContent = new ContentProvider_1.ContentProvider();
    yield avitoContent.runBrowser();
    const avitoList = yield avitoContent.getAvitoList(avitoUrl);
    yield avitoContent.closeBrowser();
    const avitoParser = new AvitoParser_1.AvitoParser(avitoList);
    let parseResult = yield avitoParser.parse();
    res.status(200);
    res.json(parseResult);
});
