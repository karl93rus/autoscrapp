import { ContentProvider } from './src/ContentProvider';
import { AvitoParser } from './src/parsers/AvitoParser';

const avitoUrl = 'https://www.avito.ru/krasnodar/avtomobili/s_probegom?pmax=1300000&pmin=800000&radius=200&s=104';


(async function() {
  const avitoContent = new ContentProvider(avitoUrl);
  
  const avitoList = await avitoContent.getAvitoList();
  
  const avitoParser = new AvitoParser(avitoList!);
  avitoParser.parse();
})();