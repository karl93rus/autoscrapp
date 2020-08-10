import { Request, Response } from 'express';
import { ContentProvider } from '../../parsers/ContentProvider';
import { AvitoParser } from '../../parsers/AvitoParser';


export const testHandler = async (req: Request, res: Response) => {
  // const pmin = req.query.pmin;
  // const pmax = req.query.pmax;
  const { pmin, pmax } = req.query;

  let avitoUrl = `https://www.avito.ru/krasnodar/avtomobili/s_probegom?pmax=${pmax}&pmin=${pmin}&radius=200&s=104`;
  const avitoContent = new ContentProvider();
  await avitoContent.runBrowser();
  const avitoList = await avitoContent.getAvitoList(avitoUrl);
  await avitoContent.closeBrowser();
  
  const avitoParser = new AvitoParser(avitoList!);
  let parseResult = await avitoParser.parse();

  res.status(200);
  res.json(parseResult);
}