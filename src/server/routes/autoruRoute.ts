import { Router } from 'express';
import { autoruHandler } from '../handlers/autoruHandler';

const autoruRoute = Router();

autoruRoute.get('/', autoruHandler);

export const autoru = autoruRoute;