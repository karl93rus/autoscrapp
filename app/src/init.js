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
const puppeteer_1 = __importDefault(require("puppeteer"));
const cheerio_1 = __importDefault(require("cheerio"));
class ContentProvider {
    constructor(url) {
        this._url = url;
    }
    getHTML() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const browser = yield puppeteer_1.default.launch();
                const page = yield browser.newPage();
                yield page.goto(this._url);
                const body = yield page.content();
                browser.close();
                return body;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAvitoList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = [];
                // const browser = await puppeteer.launch();
                // let body: string | undefined;
                // const page = await browser.newPage();
                // await page.goto(this._url);
                // let body = await page.content();
                let body = yield this.getHTML();
                const $ = cheerio_1.default.load(body);
                const href = $('.item_table-wrapper');
                href.each((i, el) => {
                    const addr = `https://avito.ru${$(el).find('.snippet-title-row a').attr('href')}`;
                    const name = $(el).find('.snippet-title-row span').text().trim();
                    const price = $(el).find('.snippet-price-row .snippet-price').text().trim();
                    res.push({
                        href: addr,
                        name: name,
                        price: price
                    });
                });
                console.log(res);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.ContentProvider = ContentProvider;
