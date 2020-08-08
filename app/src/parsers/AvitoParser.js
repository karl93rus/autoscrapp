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
const fs_1 = __importDefault(require("fs"));
const ContentProvider_1 = require("./ContentProvider");
class AvitoParser {
    constructor(list) {
        this._list = list;
        this._itemsToSave = [];
    }
    getData(html) {
        const $ = cheerio_1.default.load(html);
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
        return {
            name,
            price,
            img,
            params
        };
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            this._list = this._list.slice(0, 2);
            let part = [];
            const contentProvider = new ContentProvider_1.ContentProvider();
            yield contentProvider.runBrowser();
            while (this._list.length > 0) {
                part = this._list.splice(0, 2);
                console.log(`Starting AVITO.RU content parsing... ${part.length} items to parse.`);
                console.log(`Items to parse left: ${this._list.length}`);
                try {
                    yield this.parsePart(part, contentProvider);
                }
                catch (error) {
                    console.log(error);
                    return;
                }
            }
            fs_1.default.writeFile('./data/results.json', `[${this._itemsToSave.join(',\n')}]`, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
            yield contentProvider.closeBrowser();
        });
    }
    parsePart(parseArray, contentProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedPart = yield Promise.all(parseArray.map(item => {
                return contentProvider.getHTML(item.href);
            }));
            parsedPart.forEach((r, i) => {
                let d = this.getData(r);
                d = Object.assign(Object.assign({}, d), { url: parseArray[i].href });
                console.log(d);
                this._itemsToSave.push(JSON.stringify(d, null, 2));
            });
        });
    }
}
exports.AvitoParser = AvitoParser;
