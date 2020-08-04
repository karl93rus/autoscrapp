import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { ItemInfo } from './types/types';

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

export class ContentProvider {
  private _url: string;
  private _browser: puppeteer.Browser | null = null;

  constructor(url: string) {
    this._url = url;
  }

  private async runBrowser() {
    this._browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
  }

  async getHTML() {
    try {
      if(!this._browser) {
        await this.runBrowser();
        const page = await this._browser!.newPage();
        await page.goto(this._url);
        const body = await page.content();
        this._browser!.close();
        return body;
      }
      // const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    } catch (error) {
      throw error;
    }
  }

  async getAvitoList() {
    console.log('Getting avito list...');
    try {
      let res: ItemInfo[] = [];
      let body = await this.getHTML();
      const $ = cheerio.load(body!);
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
    } catch (error) {
      console.log(error);
    }
  }
}