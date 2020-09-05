import { Request, Response } from 'express';
import { ContentProvider } from '../../parsers/ContentProvider';
import { AutoruParser } from '../../parsers/AutoruParser';
import { CarData } from '../../types/types';

export const autoruHandler = async (req: Request, res: Response) => {
  const { pmin, pmax } = req.query;

  let autoruUrl = `https://auto.ru/krasnodar/cars/used?sort=cr_date-desc&price_from=${pmin}&price_to=${pmax}`;

  const autoruContent = new ContentProvider();
  await autoruContent.runBrowser();
  const autoruList = await autoruContent.getAutoruList(autoruUrl);
  await autoruContent.closeBrowser();

  const autoruParser = new AutoruParser(autoruList!);
  let parseResult = await autoruParser.parse(9, 3, 'AUTO.RU');

  // res.status(200);
  // res.json(parseResult);

  return parseResult as CarData[];
}