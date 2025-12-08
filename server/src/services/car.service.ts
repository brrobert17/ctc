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
}
