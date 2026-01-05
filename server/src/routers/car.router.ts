import { Router, Request, Response } from 'express';
import { CarService } from '../services/car.service';

const router = Router();


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


router.get('/core', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    //Parse filters and search query
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
    
    const minYear = req.query.minYear ? parseInt(req.query.minYear as string) : undefined;
    const maxYear = req.query.maxYear ? parseInt(req.query.maxYear as string) : undefined;
    
    const minMileage = req.query.minMileage ? parseInt(req.query.minMileage as string) : undefined;
    const maxMileage = req.query.maxMileage ? parseInt(req.query.maxMileage as string) : undefined;
    
    const bodyTypes = req.query.bodyTypes ? (req.query.bodyTypes as string).split(',').filter(Boolean) : undefined;
    const fuelTypes = req.query.fuelTypes ? (req.query.fuelTypes as string).split(',').filter(Boolean) : undefined;
    const transmissions = req.query.transmissions ? (req.query.transmissions as string).split(',').filter(Boolean) : undefined;
    
    const search = req.query.search ? (req.query.search as string).trim() : undefined;
    
    type SortOption = 'price_asc' | 'price_desc' | 'mileage_asc' | 'mileage_desc' | 'year_asc' | 'year_desc';
    const sortByRaw = req.query.sortBy as string | undefined;
    const validSortOptions: SortOption[] = ['price_asc', 'price_desc', 'mileage_asc', 'mileage_desc', 'year_asc', 'year_desc'];
    const sortBy = sortByRaw && validSortOptions.includes(sortByRaw as SortOption) ? sortByRaw as SortOption : undefined;
    
    const filters = {
      ...(minPrice !== undefined && !isNaN(minPrice) && { minPrice }),
      ...(maxPrice !== undefined && !isNaN(maxPrice) && { maxPrice }),
      ...(minYear !== undefined && !isNaN(minYear) && { minYear }),
      ...(maxYear !== undefined && !isNaN(maxYear) && { maxYear }),
      ...(minMileage !== undefined && !isNaN(minMileage) && { minMileage }),
      ...(maxMileage !== undefined && !isNaN(maxMileage) && { maxMileage }),
      ...(bodyTypes && bodyTypes.length > 0 && { bodyTypes }),
      ...(fuelTypes && fuelTypes.length > 0 && { fuelTypes }),
      ...(transmissions && transmissions.length > 0 && { transmissions }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
    };

    const result = await CarService.getCoreInfo(page, limit, Object.keys(filters).length > 0 ? filters : undefined);

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


router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid car ID',
      });
      return;
    }

    const car = await CarService.getById(id);

    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Car not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Car retrieved successfully',
      data: car,
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
