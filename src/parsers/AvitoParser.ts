import cheerio from 'cheerio';
import { ItemInfo } from '../types/types';
import { ContentProvider } from '../ContentProvider';
import { CarData } from '../types/types';
import { Parser } from './AbstractParser';

export class AvitoParser implements Parser {
  private _list: ItemInfo[];

  constructor(list: ItemInfo[]) {
    this._list = list;
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
    console.log(`Starting AVITO.RU content parsing... ${this._list.length} items to parse.`);
    
    Promise.all(this._list.map(item => {
      const contentProvider = new ContentProvider(item.href);
      return contentProvider.getHTML();
    }))
    .then((res) => {
      res.forEach((r, i) => {
        let d: CarData = this.getData(r!);
        d = {...d, url: this._list[i].href}
        console.log(d);
      });
    });
  }
}