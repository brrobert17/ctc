import prisma from './prisma';

// Translation mappings from English (LLM) to Danish (Database)
const FUEL_TYPE_MAP: { [key: string]: string[] } = {
  'gasoline': ['Benzin'],
  'petrol': ['Benzin'],
  'diesel': ['Diesel'],
  'electric': ['El'],
  'hybrid': ['Hybrid (Benzin + El)', 'Hybrid benzin'],
  'plug-in hybrid': ['Plug-in Benzin', 'Plug-in hybrid Benzin', 'Plug-in hybrid Diesel'],
  'plug-in': ['Plug-in Benzin', 'Plug-in hybrid Benzin', 'Plug-in hybrid Diesel'],
};

const TRANSMISSION_MAP: { [key: string]: string[] } = {
  'automatic': ['Automatisk'],
  'manual': ['Manuelt', 'Manuel'],
};

const DRIVETRAIN_MAP: { [key: string]: string[] } = {
  'fwd': ['Forhjulstræk'],
  'front-wheel drive': ['Forhjulstræk'],
  'rwd': ['Baghjulstræk'],
  'rear-wheel drive': ['Baghjulstræk'],
  'awd': ['Firehjulstræk'],
  '4wd': ['Firehjulstræk'],
  'four-wheel drive': ['Firehjulstræk'],
  'all-wheel drive': ['Firehjulstræk'],
};

//Translate English search term to Danish database values
function translateToDanish(term: string, map: { [key: string]: string[] }): string[] | null {
  const normalized = term.toLowerCase().trim();
  
  // Check if it matches an English key
  if (map[normalized]) {
    return map[normalized];
  }
  
  // If not found in map, return the original term (might be Danish already)
  return null;
}

export interface CarListing {
  id: number;
  make?: string | null;
  model?: string | null;
  model_year?: number | null;
  price?: number | null;
  mileage?: number | null;
  fuel_type?: string | null;
  transmission_type?: string | null;
  drivetrain?: string | null;
  body_type?: string | null;
  color?: string | null;
  interior_color?: string | null;
  description?: string | null;
  url?: string | null;
  first_registration?: string | null;
  engine_displacement?: string | null;
  power?: string | null;
  doors?: number | null;
  seats?: number | null;
  number_of_owners?: number | null;
  vin?: string | null;
  source?: string | null;
  car_location?: string | null;
}

//Get total count of cars in database
export const getCarCount = async (): Promise<number> => {
  return await prisma.car.count();
};

//Search cars in the database with various filters
export const searchCars = async (query: {
  manufacturer?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuelType?: string;
  bodyType?: string;
  transmission?: string;
  drivetrain?: string;
  location?: string;
  limit?: number;
}): Promise<CarListing[]> => {
  const limit = query.limit || 10;
  
  console.log('[DB] searchCars called with:', JSON.stringify(query, null, 2));

  // Build the where clause dynamically
  const where: any = {};

  // Filter by make (manufacturer) - always required if provided
  if (query.manufacturer) {
    where.makes = {
      make: {
        contains: query.manufacturer,
        mode: 'insensitive',
      },
    };
  }

  // Filter by model - use flexible tokenized search
  // Extract key tokens from model string (e.g., "3 Series" -> "3")
  if (query.model) {
    const modelTokens = query.model.split(/\s+/).filter(token => token.length > 0);
    
    if (modelTokens.length > 0) {
      // Create OR conditions for each token to be more flexible
      // This helps match "3 Series" to "320i", "330e", etc.
      const firstToken = modelTokens[0]; // e.g., "3" from "3 Series"
      
      console.log('[DB] Tokenized model:', query.model, '-> searching for:', firstToken);
      
      where.models = {
        model: {
          contains: firstToken, // Match primary identifier
          mode: 'insensitive',
        },
      };
    }
  }

  // Filter by year range
  if (query.yearMin || query.yearMax) {
    where.model_year = {};
    if (query.yearMin) {
      where.model_year.gte = query.yearMin;
    }
    if (query.yearMax) {
      where.model_year.lte = query.yearMax;
    }
  }

  // Filter by price range
  if (query.priceMin || query.priceMax) {
    where.price = {};
    if (query.priceMin) {
      where.price.gte = query.priceMin;
    }
    if (query.priceMax) {
      where.price.lte = query.priceMax;
    }
  }

  // Filter by mileage
  if (query.mileageMax) {
    where.mileage = {
      lte: query.mileageMax,
    };
  }

  // Filter by fuel type
  if (query.fuelType) {
    const translated = translateToDanish(query.fuelType, FUEL_TYPE_MAP);
    if (translated) {
      // Use OR to match any of the Danish translations
      where.fuel_types = {
        fuel_type: {
          in: translated,
        },
      };
    } else {
      // Fallback to contains search (user might use Danish directly)
      where.fuel_types = {
        fuel_type: {
          contains: query.fuelType,
          mode: 'insensitive',
        },
      };
    }
  }

  // Filter by body type
  if (query.bodyType) {
    where.body_types = {
      body_type: {
        contains: query.bodyType,
        mode: 'insensitive',
      },
    };
  }

  // Filter by transmission
  if (query.transmission) {
    const translated = translateToDanish(query.transmission, TRANSMISSION_MAP);
    if (translated) {
      where.transmission_types = {
        transmission_type: {
          in: translated,
        },
      };
    } else {
      // Fallback to contains search
      where.transmission_types = {
        transmission_type: {
          contains: query.transmission,
          mode: 'insensitive',
        },
      };
    }
  }

  // Filter by drivetrain
  if (query.drivetrain) {
    const translated = translateToDanish(query.drivetrain, DRIVETRAIN_MAP);
    if (translated) {
      where.drivetrains = {
        drivetrain: {
          in: translated,
        },
      };
    } else {
      // Fallback to contains search
      where.drivetrains = {
        drivetrain: {
          contains: query.drivetrain,
          mode: 'insensitive',
        },
      };
    }
  }

  // Filter by location
  if (query.location) {
    where.car_locations = {
      car_location: {
        contains: query.location,
        mode: 'insensitive',
      },
    };
  }

  // Query the database with relations
  let cars = await prisma.car.findMany({
    where,
    take: limit,
    include: {
      makes: true,
      models: true,
      fuel_types: true,
      transmission_types: true,
      drivetrains: true,
      body_types: true,
      colors: true,
      interior_colors: true,
      car_locations: true,
      sources: true,
    },
    orderBy: {
      id: 'desc', // Most recent listings first
    },
  });

  console.log('[DB] Initial query returned', cars.length, 'results');
  
  // Fallback: if no results with model filter, try brand-only search
  if (cars.length === 0 && query.model && query.manufacturer) {
    console.log('[DB] No results with model filter, falling back to brand-only search for', query.manufacturer);
    
    // Remove model filter and try again
    const { models, ...whereWithoutModel } = where;
    
    cars = await prisma.car.findMany({
      where: whereWithoutModel,
      take: limit,
      include: {
        makes: true,
        models: true,
        fuel_types: true,
        transmission_types: true,
        drivetrains: true,
        body_types: true,
        colors: true,
        interior_colors: true,
        car_locations: true,
        sources: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    
    console.log('[DB] Fallback query returned', cars.length, 'results');
  }

  // Map to CarListing interface
  const results = cars.map((car) => ({
    id: car.id,
    make: car.makes?.make || null,
    model: car.models?.model || null,
    model_year: car.model_year,
    price: car.price,
    mileage: car.mileage,
    fuel_type: car.fuel_types?.fuel_type || null,
    transmission_type: car.transmission_types?.transmission_type || null,
    drivetrain: car.drivetrains?.drivetrain || null,
    body_type: car.body_types?.body_type || null,
    color: car.colors?.color || null,
    interior_color: car.interior_colors?.interior_color || null,
    description: car.description,
    url: car.url,
    first_registration: car.first_registration,
    engine_displacement: car.engine_displacement,
    power: car.power,
    doors: car.doors,
    seats: car.seats,
    number_of_owners: car.number_of_owners,
    vin: car.vin,
    source: car.sources?.source || car.source,
    car_location: car.car_locations?.car_location || null,
  }));
  
  console.log('[DB] Returning', results.length, 'formatted results');
  return results;
};

//Get market statistics from the database
export const getCarStats = async (): Promise<{
  totalListings: number;
  makes: string[];
  avgPrice: number;
  priceRange: { min: number; max: number };
  avgMileage: number;
  totalByFuelType: { [key: string]: number };
  totalByBodyType: { [key: string]: number };
}> => {
  // Get total count
  const totalListings = await prisma.car.count();

  // Get all makes (manufacturers)
  const makesData = await prisma.make.findMany({
    select: { make: true },
    orderBy: { make: 'asc' },
  });
  const makes = makesData
    .map((m) => m.make)
    .filter((m): m is string => m !== null);

  // Get price statistics
  const priceStats = await prisma.car.aggregate({
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
    where: {
      price: { not: null },
    },
  });

  // Get mileage average
  const mileageStats = await prisma.car.aggregate({
    _avg: { mileage: true },
    where: {
      mileage: { not: null },
    },
  });

  // Get fuel type distribution
  const fuelTypeData = await prisma.car.groupBy({
    by: ['fuel_type_id'],
    _count: true,
  });
  
  const fuelTypes = await prisma.fuelType.findMany();
  const totalByFuelType: { [key: string]: number } = {};
  fuelTypeData.forEach((item) => {
    const fuelType = fuelTypes.find((ft) => ft.id === item.fuel_type_id);
    if (fuelType?.fuel_type) {
      totalByFuelType[fuelType.fuel_type] = item._count;
    }
  });

  // Get body type distribution
  const bodyTypeData = await prisma.car.groupBy({
    by: ['body_type_id'],
    _count: true,
  });
  
  const bodyTypes = await prisma.bodyType.findMany();
  const totalByBodyType: { [key: string]: number } = {};
  bodyTypeData.forEach((item) => {
    const bodyType = bodyTypes.find((bt) => bt.id === item.body_type_id);
    if (bodyType?.body_type) {
      totalByBodyType[bodyType.body_type] = item._count;
    }
  });

  return {
    totalListings,
    makes,
    avgPrice: Math.round(priceStats._avg.price || 0),
    priceRange: {
      min: priceStats._min.price || 0,
      max: priceStats._max.price || 0,
    },
    avgMileage: Math.round(mileageStats._avg.mileage || 0),
    totalByFuelType,
    totalByBodyType,
  };
};
