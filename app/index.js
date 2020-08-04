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
const ContentProvider_1 = require("./src/ContentProvider");
const AvitoParser_1 = require("./src/parsers/AvitoParser");
const avitoUrl = 'https://www.avito.ru/krasnodar/avtomobili/s_probegom?pmax=1300000&pmin=800000&radius=200&s=104';
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const avitoContent = new ContentProvider_1.ContentProvider(avitoUrl);
        const avitoList = yield avitoContent.getAvitoList();
        const avitoParser = new AvitoParser_1.Parser(avitoList);
        avitoParser.parseAvito();
    });
})();
