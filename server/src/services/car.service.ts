import prisma from '../database/prisma';

export class CarService {
  /**
   * Get all cars with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Object containing cars array, pagination metadata
   */
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

  /**
   * Get core car information with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @returns Object containing cars with core info only, pagination metadata
   */
  static async getCoreInfo(page: number = 1, limit: number = 10) {
    // Ensure page and limit are positive integers
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit))); // Max 100 items per page
    
    const skip = (validPage - 1) * validLimit;

    // Get total count for pagination metadata
    const totalCount = await prisma.car.count();

    // Fetch cars with only core information
    const cars = await prisma.car.findMany({
      skip,
      take: validLimit,
      select: {
        id: true,
        price: true,
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
        car_images: {
          select: {
            image_url: true,
          },
          take: 1, // Only get the first image
        },
      },
      orderBy: {
        id: 'desc', // Most recent first
      },
    });

    // Transform the data to a clean structure
    const formattedCars = cars.map((car) => ({
      id: car.id,
      make: car.makes?.make || null,
      model: car.models?.model || null,
      year: car.model_year,
      location: car.car_locations?.car_location || null,
      price: car.price,
      image: car.car_images[0]?.image_url || null,
      transmission: car.transmission_types?.transmission_type || null,
      fuelType: car.fuel_types?.fuel_type || null,
      mileage: car.mileage,
      url: car.url,
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
}
