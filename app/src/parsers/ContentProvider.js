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
        '--window-size=1920x1080',
    ]
};
class ContentProvider {
    constructor() {
        this._browser = null;
    }
    runBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Initializing new browser...');
            this._browser = yield puppeteer_1.default.launch(LAUNCH_PUPPETEER_OPTS);
            console.log('New browser initialized...');
        });
    }
    closeBrowser() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Closing browser...');
            yield ((_a = this._browser) === null || _a === void 0 ? void 0 : _a.close());
            console.log('Browser closed...');
        });
    }
    getHTML(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._browser) {
                    console.log('No browser running...');
                }
                else {
                    console.log('Browser running in getHTML...');
                }
                const page = yield this._browser.newPage();
                // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
                let res = yield page.goto(url);
                // console.log('RESPONSE headers', res?.headers());
                console.log('RESPONSE status', res === null || res === void 0 ? void 0 : res.status());
                const body = yield page.content();
                return body;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAvitoList(avitoUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Getting avito list...');
            try {
                let res = [];
                let body = yield this.getHTML(avitoUrl);
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
                yield ((_a = this._browser) === null || _a === void 0 ? void 0 : _a.close());
                return res;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.ContentProvider = ContentProvider;
