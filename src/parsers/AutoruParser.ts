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
    const classPrefixRegExp = /class=\"[A-Za-z0-9]{10,100}__title\"/;
    const classPrefix = html.match(classPrefixRegExp)![0].split('__')[0].replace('class="', '');
    console.log('PREFIX', classPrefix);
    let name = $(`.${classPrefix}__title`).text();
    let price = $('.OfferPriceCaption__price').text().split('₽')[0].trim();
    let img = `https:${$('.ImageGalleryDesktop__image').attr('src')}`;
    let params: { [k: string]: string }[] = [];

    $('.CardInfo__row').each((i, p) => {
      if($(p).hasClass('CardInfo__row_year')) {
        const inner = $(p).html();
        name = `${name}, ${$(inner).find('a').text().trim()}`;
      } else if($(p).hasClass('CardInfo__row_ownersCount')) {
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