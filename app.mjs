import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { routes } from '#src/router.mjs';

global.__dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({
  credentials: true
}));
app.use(cookieParser());
app.disable('x-powered-by');

routes(app);

app.use('/assets', express.static(`${__dirname}/public`));

export default app;
