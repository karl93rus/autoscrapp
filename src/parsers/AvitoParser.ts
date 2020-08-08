import cheerio from 'cheerio';
import fs from 'fs';
import { ItemInfo } from '../types/types';
import { ContentProvider } from './ContentProvider';
import { CarData } from '../types/types';
import { Parser } from './AbstractParser';

export class AvitoParser implements Parser {
  private _list: ItemInfo[];
  private _itemsToSave: string[];

  constructor(list: ItemInfo[]) {
    this._list = list;
    this._itemsToSave = [];
  }

  getData(html: string) {
    const $ = cheerio.load(html!);
    let name = $('.title-info-title-text').text();
    let price = $('.js-item-price').attr('content') as string;
    let img = `https:${$('.gallery-img-frame img').attr('src')}`;
    let params: { [k: string]: string }[] = [];
    $('.item-params-list-item').each((i, p) => {
      let paramK = $(p).text().trim().split(' ')[0];
      if(/пробег/gi.test(paramK)) {
        params.push({'miliage': $(p).text().trim()});
      } else if(/Владельцев/gi.test(paramK)) {
        params.push({'owners': $(p).text().trim()});
      }
    });
    return {
      name,
      price,
      img,
      params
    }
  }

  async parse() {
    this._list = this._list.slice(0, 6);
    let part: ItemInfo[] = [];
    const contentProvider = new ContentProvider();
    await contentProvider.runBrowser();

    while(this._list.length > 0) {
      part = this._list.splice(0, 2);
      console.log(`Starting AVITO.RU content parsing... ${part.length} items to parse.`);
      console.log(`Items to parse left: ${this._list.length}`);
      try {
        await this.parsePart(part, contentProvider);
      } catch (error) {
        console.log(error);
        return;
      }
    }
    fs.writeFileSync('./data/results.json', this._itemsToSave.join(',\n'));
    await contentProvider.closeBrowser();
    return;
  }

  async parsePart(parseArray: ItemInfo[], contentProvider: ContentProvider) {
    let parsedPart = await Promise.all(parseArray.map(item => {
      return contentProvider.getHTML(item.href);
    }));
    parsedPart.forEach((r, i) => {
      let d: CarData = this.getData(r);
      d = {...d, url: parseArray[i].href}
      console.log(d);
      this._itemsToSave.push(JSON.stringify(d, null, 2))
    });
  }
}