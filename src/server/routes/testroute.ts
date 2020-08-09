import { Router } from 'express';
import { testHandler } from '../handlers/testhandler';

const testRouter = Router();

testRouter.get('/avi', testHandler);

export const test = testRouter