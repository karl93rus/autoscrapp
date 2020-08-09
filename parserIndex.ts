import { ContentProvider } from './src/parsers/ContentProvider';
import { AvitoParser } from './src/parsers/AvitoParser';

const avitoUrl = 'https://www.avito.ru/krasnodar/avtomobili/s_probegom?pmax=1300000&pmin=800000&radius=200&s=104';


(async function() {
  const avitoContent = new ContentProvider();
  await avitoContent.runBrowser();
  const avitoList = await avitoContent.getAvitoList(avitoUrl);
  await avitoContent.closeBrowser();
  
  const avitoParser = new AvitoParser(avitoList!);
  avitoParser.parse();
})();