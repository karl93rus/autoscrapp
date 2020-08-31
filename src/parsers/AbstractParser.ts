import { CarData, ItemInfo } from "../types/types";
import { ContentProvider } from './ContentProvider';

export abstract class Parser {
  protected _list: ItemInfo[];
  protected _itemsToSend: CarData[];

  constructor(list: ItemInfo[]) {
    this._list = list;
    this._itemsToSend = [];
  }

  abstract getData(html: string): CarData

  async parse(amount: number, threads: number, sourse?: string) {
    this._list = this._list.slice(0, amount);
    let part: ItemInfo[] = [];
    const contentProvider = new ContentProvider();
    await contentProvider.runBrowser();

    while(this._list.length > 0) {
      part = this._list.splice(0, threads);
      console.log(`Starting ${sourse ? sourse : ''} content parsing... ${part.length} items to parse.`);
      console.log(`Items to parse left: ${this._list.length}`);
      try {
        await this.parsePart(part, contentProvider);
      } catch (error) {
        console.log(error);
        return;
      }
    }
    await contentProvider.closeBrowser();
    return this._itemsToSend;
  }

  async parsePart(parseArray: ItemInfo[], contentProvider: ContentProvider) {
    let parsedPart = await Promise.all(parseArray.map(item => {
      return contentProvider.getHTML(item.href);
    }));
    parsedPart.forEach((r, i) => {
      let d: CarData = this.getData(r);
      d = {...d, url: parseArray[i].href}
      console.log(d);
      this._itemsToSend.push(d);
    });
  }
}