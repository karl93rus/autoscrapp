import { Router } from 'express';
import { allHandlers } from '../handlers/allHandlers';

const allRoute = Router();

allRoute.get('/', allHandlers);

export const all = allRoute;