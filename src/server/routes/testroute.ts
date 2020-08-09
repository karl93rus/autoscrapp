import { Router } from 'express';
import { testHandler } from '../handlers/testhandler';

const testRouter = Router();

export const test = testRouter.get('/avi', testHandler);