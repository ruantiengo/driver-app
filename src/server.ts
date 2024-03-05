import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { healthCheckRouter } from '@/routes/healthCheck/healthCheckRouter';
import { carRouter } from './routes/car/carRouter';
import { PrismaClient } from '@prisma/client';

const logger = pino({ name: 'server start' });
const app: Express = express();

app.set('trust proxy', true);


app.use(express.json({ type: 'application/json' }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);


app.use(requestLogger());


app.use('/health-check', healthCheckRouter);

app.use('/cars', carRouter)

app.use(openAPIRouter);


app.use(errorHandler());


const prisma = new PrismaClient()

export { app, logger, prisma };
