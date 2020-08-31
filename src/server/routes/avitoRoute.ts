import { Router } from 'express';
import { avitoHandler } from '../handlers/avitoHandler';

const avitoRoute = Router();

avitoRoute.get('/', avitoHandler);

export const avito = avitoRoute;