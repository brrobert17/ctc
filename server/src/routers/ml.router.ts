import { Router, Request, Response } from 'express';
import { MLService } from '../services/ml.service';
import prisma from '../database/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { UserTier } from '@prisma/client';

const router = Router();

// URL of the ML service
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

router.post('/estimate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Received estimation request');

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Reserve a generation slot up-front so the FREE limit is enforced even with concurrent requests.
    // If the downstream ML call fails, we roll back this reservation.
    let reservedGeneration = false;
    if (user.tier !== UserTier.LIFETIME) {
      const reservation = await prisma.user.updateMany({
        where: {
          id: userId,
          estimationGenerations: { lt: 1 },
        },
        data: {
          estimationGenerations: { increment: 1 },
        },
      });

      if (reservation.count === 0) {
        res.status(403).json({
          success: false,
          message: 'Free tier limit reached: only 1 estimation generation is allowed. Upgrade to Lifetime for unlimited estimations.',
        });
        return;
      }

      reservedGeneration = true;
    }
    
    // Process the user input
    const processedResult = await MLService.processUserInput(req.body);
    const processedData = processedResult.processed_data;
    const originalMarket = processedResult.original_market;
    
    console.log('Sending processed data to ML model...');
    
    // Send processed data to the ML model
    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData),
    });

    if (!mlResponse.ok) {
      if (reservedGeneration) {
        await prisma.user.update({
          where: { id: userId },
          data: { estimationGenerations: { decrement: 1 } },
        });
      }

      const errorData = await mlResponse.json().catch(() => ({}));
      res.status(mlResponse.status).json({
        success: false,
        message: 'ML Service Error',
        error: errorData
      });
      return;
    }

    const mlPrediction = await mlResponse.json();
    console.log('Raw ML model response:', mlPrediction);
    
    // Convert response based on original market selection
    const convertedResponse = MLService.convertMLResponse(mlPrediction, originalMarket);
    console.log('Converted response:', convertedResponse);

    // Return the converted prediction
    res.status(200).json({
      success: true,
      data: convertedResponse
    });
  } catch (error: any) {
    console.error('Error processing estimation:', error.message);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.code === 'ECONNREFUSED') {
       res.status(503).json({
        success: false,
        message: 'ML Service Unavailable. Is the Python service running?',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      });
    }
  }
});

export default router;
