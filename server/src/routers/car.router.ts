import { Router, Request, Response } from 'express';
import { CarService } from '../services/car.service';

const router = Router();

/**
 * GET /api/cars
 * Get all cars with pagination
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 10, max: 100)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await CarService.getAll(page, limit);

    res.status(200).json({
      success: true,
      message: 'Cars retrieved successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/cars/core
 * Get core car information with pagination
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 10, max: 100)
 */
router.get('/core', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await CarService.getCoreInfo(page, limit);

    res.status(200).json({
      success: true,
      message: 'Core car information retrieved successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error fetching core car information:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
