import { Request, Response } from 'express';
import { ContentProvider } from '../../parsers/ContentProvider';
import { AutoruParser } from '../../parsers/AutoruParser';
import { CarData } from '../../types/types';

export const autoruHandler = async (req: Request, res: Response) => {
  const { pmin, pmax } = req.query;

  let autoruUrl = `https://auto.ru/krasnodar/cars/used?price_from=${pmin}&price_to=${pmax}&sort=cr_date-desc`;

  const autoruContent = new ContentProvider();
  await autoruContent.runBrowser();
  const autoruList = await autoruContent.getAutoruList(autoruUrl);
  await autoruContent.closeBrowser();

  const autoruParser = new AutoruParser(autoruList!);
  let parseResult = await autoruParser.parse(3, 3, 'AUTO.RU');

  // res.status(200);
  // res.json(parseResult);

  return parseResult as CarData[];
}