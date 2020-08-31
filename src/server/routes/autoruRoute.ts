import { Router } from 'express';
import { autoruHandler } from '../handlers/autoruHandler';

const autoruRoute = Router();

autoruRoute.get('/autoru', autoruHandler);

export const autoru = autoruRoute;