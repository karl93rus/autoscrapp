import cheerio from 'cheerio';
import { ContentProvider } from './ContentProvider';
import { CarData, ItemInfo } from '../types/types';
import { Parser } from './AbstractParser';

export class AvitoParser extends Parser {

  constructor(list: ItemInfo[]) {
    super(list);
  }

  getData(html: string): CarData {
    const $ = cheerio.load(html!);
    let name = $('.title-info-title-text').text();
    let price = $('.js-item-price').attr('content') as string;
    let img = `https:${$('.gallery-img-frame img').attr('src')}`;
    let params: { [k: string]: string }[] = [];
    $('.item-params-list-item').each((i, p) => {
      let paramK = $(p).text().trim().split(' ')[0];
      if(/пробег/gi.test(paramK)) {
        params.push({ 'miliage': $(p).text().trim() });
      } else if(/Владельцев/gi.test(paramK)) {
        params.push({ 'owners': $(p).text().trim() });
      }
    });
    return {
      name,
      price,
      img,
      params
    }
  }
}