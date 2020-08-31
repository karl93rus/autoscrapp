import { Request, Response } from 'express';
import { autoruHandler } from './autoruHandler';
import { avitoHandler } from './avitoHandler';
import { CarData } from '../../types/types';

export const allHandlers = async (req: Request, res: Response) => {
  try {
    let results = await Promise.all([
      autoruHandler(req, res),
      avitoHandler(req, res)
    ]);

    let result = ([] as CarData[]).concat(...results);
    
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}