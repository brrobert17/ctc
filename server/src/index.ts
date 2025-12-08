import dotenv from 'dotenv';

dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport';
import authRouter from './routers/auth.router';
import testRouter from './routers/test.router';
import mlRouter from './routers/ml.router';
import userRouter from './routers/user.router';
import carRouter from './routers/car.router';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware (without sessions)
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/test', testRouter);
app.use('/api/ml', mlRouter);
app.use('/api/user', userRouter);
app.use('/api/cars', carRouter);

// Health check
app.get('/health', (req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
