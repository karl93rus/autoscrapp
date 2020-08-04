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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const ContentProvider_1 = require("./ContentProvider");
class Parser {
    constructor(list) {
        this._list = list;
    }
    parseAvito() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Starting AVITO.RU content parsing... ${this._list.length} items to parse.`);
            for (let [index, item] of this._list.entries()) {
                const contentProvider = new ContentProvider_1.ContentProvider(item.href);
                const itemHtml = yield contentProvider.getHTML();
                const $ = cheerio_1.default.load(itemHtml);
                let url = item.href;
                let name = $('.title-info-title-text').text();
                let price = $('.js-item-price').attr('content');
                let img = `https:${$('.gallery-img-frame img').attr('src')}`;
                let params = [];
                $('.item-params-list-item').each((i, p) => {
                    let paramK = $(p).text().trim().split(' ')[0];
                    if (/пробег/gi.test(paramK)) {
                        params.push({ 'miliage': $(p).text().trim() });
                    }
                    else if (/Владельцев/gi.test(paramK)) {
                        params.push({ 'owners': $(p).text().trim() });
                    }
                });
                if (index > 5) {
                    break;
                }
                console.log(`name: ${name}, price: ${price}, url: ${url}, img: ${img}, params:`, params);
            }
        });
    }
}
exports.Parser = Parser;
