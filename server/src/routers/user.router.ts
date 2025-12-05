import { Router, Response } from 'express';
import prisma from '../database/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Delete user account
router.delete('/delete', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Save estimation
router.post('/estimations', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const {
      // Car input data
      year, mileage, mpg_avg, engine_size_l, hp, manufacturer, model,
      transmission, drivetrain, fuel_type, exterior_color,
      accidents_or_damage, one_owner, personal_use_only, danish_market,
      // Estimation result
      predicted_price, currency, original_price_usd
    } = req.body;

    // Validate required fields
    if (!year || !manufacturer || !model || predicted_price === undefined) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Create saved estimation
    const savedEstimation = await prisma.savedEstimation.create({
      data: {
        userId,
        year,
        mileage: mileage || 0,
        mpg_avg: mpg_avg || 0,
        engine_size_l: engine_size_l || 0,
        hp: hp || 0,
        manufacturer,
        model,
        transmission: transmission || '',
        drivetrain: drivetrain || '',
        fuel_type: fuel_type || '',
        exterior_color: exterior_color || '',
        accidents_or_damage: accidents_or_damage || 0,
        one_owner: one_owner || 0,
        personal_use_only: personal_use_only || 0,
        danish_market: danish_market || 0,
        predicted_price,
        currency: currency || 'USD',
        original_price_usd: original_price_usd || predicted_price
      }
    });

    res.status(201).json({
      success: true,
      message: 'Estimation saved successfully',
      data: savedEstimation
    });
  } catch (error) {
    console.error('Save estimation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's saved estimations
router.get('/estimations', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const savedEstimations = await prisma.savedEstimation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: savedEstimations
    });
  } catch (error) {
    console.error('Get saved estimations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a saved estimation
router.delete('/estimations/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const estimationId = req.params.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Check if estimation exists and belongs to user
    const estimation = await prisma.savedEstimation.findFirst({
      where: { id: estimationId, userId }
    });

    if (!estimation) {
      res.status(404).json({ success: false, message: 'Estimation not found' });
      return;
    }

    // Delete the estimation
    await prisma.savedEstimation.delete({
      where: { id: estimationId }
    });

    res.status(200).json({
      success: true,
      message: 'Estimation deleted successfully'
    });
  } catch (error) {
    console.error('Delete estimation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
