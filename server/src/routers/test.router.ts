import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/hello', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Hello World',
  });
});

router.get('/protected', authMiddleware, (req: AuthRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'You have accessed a protected endpoint',
    userId: req.userId,
  });
});

export default router;
