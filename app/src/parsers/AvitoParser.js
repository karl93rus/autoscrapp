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
const ContentProvider_1 = require("../ContentProvider");
class Parser {
    constructor(list) {
        this._list = list;
    }
    // getData(html: string, item: ItemInfo) {
    getData(html) {
        const $ = cheerio_1.default.load(html);
        // let url = item.href;
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
        // console.log(`name: ${name}, price: ${price}, img: ${img}, url: ${url} params:`, params);
        // console.log(`name: ${name}, price: ${price}, img: ${img}, params:`, params);
        return {
            name,
            price,
            img,
            params
        };
    }
    parseAvito() {
        return __awaiter(this, void 0, void 0, function* () {
            this._list = this._list.slice(0, 6);
            console.log(`Starting AVITO.RU content parsing... ${this._list.length} items to parse.`);
            Promise.all(this._list.map(item => {
                const contentProvider = new ContentProvider_1.ContentProvider(item.href);
                return contentProvider.getHTML();
            }))
                .then((res) => {
                res.forEach((r, i) => {
                    let d = this.getData(r);
                    d = Object.assign(Object.assign({}, d), { url: this._list[i].href });
                    console.log(d);
                });
            });
            // for(let item of this._list) {
            //   const contentProvider = new ContentProvider(item.href);
            //   const itemHtml = await contentProvider.getHTML();
            //   this.getData(itemHtml!, item);
            //   // const $ = cheerio.load(itemHtml!);
            //   // let url = item.href;
            //   // let name = $('.title-info-title-text').text();
            //   // let price = $('.js-item-price').attr('content');
            //   // let img = `https:${$('.gallery-img-frame img').attr('src')}`;
            //   // let params: {[k: string]: string}[] = [];
            //   // $('.item-params-list-item').each((i, p) => {
            //   //   let paramK = $(p).text().trim().split(' ')[0];
            //   //   if(/пробег/gi.test(paramK)) {
            //   //     params.push({'miliage': $(p).text().trim()});
            //   //   } else if(/Владельцев/gi.test(paramK)) {
            //   //     params.push({'owners': $(p).text().trim()});
            //   //   }
            //   // });
            //   // console.log(`name: ${name}, price: ${price}, url: ${url}, img: ${img}, params:`, params);
            // }
        });
    }
}
exports.Parser = Parser;
