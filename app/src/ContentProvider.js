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
const LAUNCH_PUPPETEER_OPTS = {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
    ]
};
// const PAGE_PUPPETEER_OPTS = {
//   networkIdle2Timeout: 5000,
//   waitUntil: 'networkidle2',
//   timeout: 3000000
// };
class ContentProvider {
    constructor(url) {
        this._browser = null;
        this._url = url;
    }
    runBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            this._browser = yield puppeteer_1.default.launch(LAUNCH_PUPPETEER_OPTS);
        });
    }
    getHTML() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._browser) {
                    yield this.runBrowser();
                    const page = yield this._browser.newPage();
                    yield page.goto(this._url);
                    const body = yield page.content();
                    this._browser.close();
                    return body;
                }
                // const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAvitoList() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Getting avito list...');
            try {
                let res = [];
                let body = yield this.getHTML();
                const $ = cheerio_1.default.load(body);
                const href = $('.item_table-wrapper');
                href.each((_, el) => {
                    const addr = `https://avito.ru${$(el).find('.snippet-title-row a').attr('href')}`;
                    const name = $(el).find('.snippet-title-row span').text().trim();
                    const price = $(el).find('.snippet-price-row .snippet-price').text().trim();
                    res.push({
                        href: addr,
                        name: name,
                        price: price
                    });
                });
                // this._browser?.close();
                return res;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.ContentProvider = ContentProvider;
