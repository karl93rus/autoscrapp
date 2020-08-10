import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { ItemInfo } from '../types/types';

const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
    // '--proxy-server=http://157.245.95.2:8080'
  ]
};

export class ContentProvider {
  private _browser: puppeteer.Browser | null;

  constructor() {
    this._browser = null;
  }

  async runBrowser() {
    console.log('Initializing new browser...');
    this._browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    console.log('New browser initialized...');
  }

  async closeBrowser() {
    console.log('Closing browser...');
    await this._browser?.close();
    console.log('Browser closed...');
  }

  async getHTML(url: string) {
    try {
      if(!this._browser) {
        console.log('No browser running...');
      } else {
        console.log('Browser running in getHTML...');
      }
      const page = await this._browser!.newPage();
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
      let res = await page.goto(url);
      console.log('RESPONSE status', res?.status());
      const body = await page.content();
      await page.close();
      return body;
    } catch (error) {
      throw error;
    }
  }

  async getAvitoList(avitoUrl: string) {
    console.log('Getting avito list...');
    try {
      let res: ItemInfo[] = [];
      let body = await this.getHTML(avitoUrl);
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
      await this._browser?.close();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}