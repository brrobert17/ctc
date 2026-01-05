import prisma from '../database/prisma';

export interface CarFilters {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyTypes?: string[];
  fuelTypes?: string[];
  transmissions?: string[];
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'mileage_asc' | 'mileage_desc' | 'year_asc' | 'year_desc';
}

export class CarService {
   //Get all cars with pagination
  static async getAll(page: number = 1, limit: number = 10) {
    // Ensure page and limit are positive integers
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit))); // Max 100 items per page
    
    const skip = (validPage - 1) * validLimit;

    // Get total count for pagination metadata
    const totalCount = await prisma.car.count();

    // Fetch cars with pagination and include related data
    const cars = await prisma.car.findMany({
      skip,
      take: validLimit,
      include: {
        makes: true,
        models: true,
        fuel_types: true,
        body_types: true,
        colors: true,
        transmission_types: true,
        drivetrains: true,
        listing_types: true,
        categorys: true,
        interior_colors: true,
        car_locations: true,
        sources: true,
        car_images: true,
      },
      orderBy: {
        id: 'desc', // Most recent first
      },
    });

    const totalPages = Math.ceil(totalCount / validLimit);

    return {
      data: cars,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalCount,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  }

  //Get core car information with pagination
  static async getCoreInfo(page: number = 1, limit: number = 10, filters?: CarFilters) {
    // Ensure page and limit are positive integers
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit))); // Max 100 items per page
    
    const skip = (validPage - 1) * validLimit;

    // Build where clause for filters
    const where: any = {};
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters?.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters?.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }
    if (filters?.minYear !== undefined || filters?.maxYear !== undefined) {
      where.model_year = {};
      if (filters?.minYear !== undefined) {
        where.model_year.gte = filters.minYear;
      }
      if (filters?.maxYear !== undefined) {
        where.model_year.lte = filters.maxYear;
      }
    }
    if (filters?.minMileage !== undefined || filters?.maxMileage !== undefined) {
      where.mileage = {};
      if (filters?.minMileage !== undefined) {
        where.mileage.gte = filters.minMileage;
      }
      if (filters?.maxMileage !== undefined) {
        where.mileage.lte = filters.maxMileage;
      }
    }
    if (filters?.bodyTypes && filters.bodyTypes.length > 0) {
      where.body_types = {
        is: {
          body_type: {
            in: filters.bodyTypes,
          },
        },
      };
    }
    if (filters?.fuelTypes && filters.fuelTypes.length > 0) {
      // Map frontend filter values to actual DB values
      const fuelTypeConditions: any[] = [];
      
      if (filters.fuelTypes.includes('Benzin')) {
        fuelTypeConditions.push(
          { fuel_types: { is: { fuel_type: 'Benzin' } } },
          { fuel_types: { is: { fuel_type: 'Plug-in Benzin' } } }
        );
      }
      if (filters.fuelTypes.includes('Diesel')) {
        fuelTypeConditions.push(
          { fuel_types: { is: { fuel_type: 'Diesel' } } }
        );
      }
      if (filters.fuelTypes.includes('El')) {
        fuelTypeConditions.push(
          { fuel_types: { is: { fuel_type: 'El' } } }
        );
      }
      if (filters.fuelTypes.includes('Hybrid')) {
        fuelTypeConditions.push(
          { fuel_types: { is: { fuel_type: { contains: 'ybrid' } } } }
        );
      }
      
      if (fuelTypeConditions.length > 0) {
        if (fuelTypeConditions.length === 1) {
          Object.assign(where, fuelTypeConditions[0]);
        } else {
          where.OR = fuelTypeConditions;
        }
      }
    }
    if (filters?.transmissions && filters.transmissions.length > 0) {
      const transmissionValues: string[] = [];
      if (filters.transmissions.includes('Automatisk')) {
        transmissionValues.push('Automatisk');
      }
      if (filters.transmissions.includes('Manuel')) {
        transmissionValues.push('Manuel', 'Manuelt');
      }
      if (transmissionValues.length > 0) {
        where.transmission_types = {
          is: {
            transmission_type: {
              in: transmissionValues,
            },
          },
        };
      }
    }
    if (filters?.search && filters.search.trim()) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);
      
      const searchConditions = searchTerms.map(term => ({
        OR: [
          { makes: { is: { make: { contains: term, mode: 'insensitive' } } } },
          { models: { is: { model: { contains: term, mode: 'insensitive' } } } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      }));
      
      where.AND = [
        ...(where.AND || []),
        ...searchConditions,
      ];
    }

    const totalCount = await prisma.car.count({ where });

    // Fetch cars with only core information
    const cars = await prisma.car.findMany({
      where,
      skip,
      take: validLimit,
      select: {
        id: true,
        price: true,
        estimated_price: true,
        danish_market: true,
        mileage: true,
        model_year: true,
        url: true,
        makes: {
          select: {
            make: true,
          },
        },
        models: {
          select: {
            model: true,
          },
        },
        car_locations: {
          select: {
            car_location: true,
          },
        },
        transmission_types: {
          select: {
            transmission_type: true,
          },
        },
        fuel_types: {
          select: {
            fuel_type: true,
          },
        },
        sources: {
          select: {
            source: true,
          },
        },
        car_images: {
          select: {
            image_url: true,
          },
          take: 1, // Only get the first image
        },
      },
      orderBy: (() => {
        switch (filters?.sortBy) {
          case 'price_asc':
            return { price: { sort: 'asc' as const, nulls: 'last' as const } };
          case 'price_desc':
            return { price: { sort: 'desc' as const, nulls: 'last' as const } };
          case 'mileage_asc':
          case 'mileage_desc':
            // Handle in application layer to treat 0 as null
            return { id: 'desc' as const };
          case 'year_asc':
            return { model_year: { sort: 'asc' as const, nulls: 'last' as const } };
          case 'year_desc':
            return { model_year: { sort: 'desc' as const, nulls: 'last' as const } };
          default:
            // Estimated cars first (cars with estimated_price), then the rest
            return [
              { estimated_price: { sort: 'desc' as const, nulls: 'last' as const } },
              { id: 'desc' as const },
            ];
        }
      })(),
    });

    // Sorting for mileage
    let sortedCars = cars;
    
    if (filters?.sortBy === 'mileage_asc' || filters?.sortBy === 'mileage_desc') {
      const isAsc = filters.sortBy === 'mileage_asc';
      sortedCars = cars.sort((a, b) => {
        const aValid = a.mileage && a.mileage > 0;
        const bValid = b.mileage && b.mileage > 0;
        if (!aValid && !bValid) return 0;
        if (!aValid) return 1;
        if (!bValid) return -1;
        return isAsc ? a.mileage! - b.mileage! : b.mileage! - a.mileage!;
      });
    }

    const formattedCars = sortedCars.map((car) => ({
      id: car.id,
      make: car.makes?.make || null,
      model: car.models?.model || null,
      year: car.model_year,
      location: car.car_locations?.car_location || null,
      price: car.price,
      estimatedPrice: car.estimated_price,
      danishMarket: car.danish_market,
      image: car.car_images[0]?.image_url || null,
      transmission: car.transmission_types?.transmission_type || null,
      fuelType: car.fuel_types?.fuel_type || null,
      mileage: car.mileage,
      url: car.url,
      source: car.sources?.source || null,
    }));

    const totalPages = Math.ceil(totalCount / validLimit);

    return {
      data: formattedCars,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalCount,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  }


  static async getById(id: number) {
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        makes: true,
        models: true,
        fuel_types: true,
        body_types: true,
        colors: true,
        transmission_types: true,
        drivetrains: true,
        listing_types: true,
        categorys: true,
        interior_colors: true,
        car_locations: true,
        sources: true,
        car_images: true,
        car_features: {
          include: {
            features: true,
          },
        },
      },
    });

    return car;
  }
}
