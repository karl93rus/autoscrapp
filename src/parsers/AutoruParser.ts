import cheerio from 'cheerio';
import { ContentProvider } from './ContentProvider';
import { Parser } from './AbstractParser';
import { CarData, ItemInfo } from '../types/types';

export class AutoruParser extends Parser {

  constructor(list: ItemInfo[]) {
    super(list);
  }

  getData(html: string) {
    const $ = cheerio.load(html!);
    let name = $('.aWaLcwXGq8k1ink9bHIkM__title').text();
    let price = $('.OfferPriceCaption__price').text().split('₽')[0].trim();
    let img = `https:${$('.ImageGalleryDesktop__image').attr('src')}`;
    let params: { [k: string]: string }[] = [];

    $('.CardInfo__row').each((i, p) => {
      if($(p).hasClass('CardInfo__row_year')) {
        const inner = $(p).html();
        console.log('row_year', $(inner).find('a').text().trim());
        name = `${name}, ${$(inner).find('a').text().trim()}`;
      } else if($(p).hasClass('CardInfo__row_ownersCount')) {
        console.log('ownersCount', $(p).hasClass('CardInfo__row_ownersCount'), $(p).html());
        params.push({ 'owners': $(p).find('span').eq(1).text() });
      } else if($(p).hasClass('CardInfo__row_kmAge')) {
        params.push({ 'miliage': $(p).find('span').eq(1).text() });
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