import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface CarListing {
  manufacturer: string;
  model: string;
  year: string;
  mileage: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  fuel_type: string;
  mpg: string;
  exterior_color: string;
  interior_color: string;
  accidents_or_damage: string;
  one_owner: string;
  personal_use_only: string;
  seller_name: string;
  seller_rating: string;
  driver_rating: string;
  driver_reviews_num: string;
  price_drop: string;
  price: string;
}

let carsCache: CarListing[] | null = null;

export const loadCarsDatabase = async (): Promise<CarListing[]> => {
  if (carsCache) {
    return carsCache;
  }

  const csvPath = path.join(__dirname, '../../../temp/cars.csv');
  const cars: CarListing[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CarListing) => {
        cars.push(row);
      })
      .on('end', () => {
        carsCache = cars;
        console.log(`Loaded ${cars.length} car listings from database`);
        resolve(cars);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const searchCars = async (query: {
  manufacturer?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuelType?: string;
  limit?: number;
}): Promise<CarListing[]> => {
  const cars = await loadCarsDatabase();
  let results = cars;

  if (query.manufacturer) {
    const mfg = query.manufacturer.toLowerCase();
    results = results.filter((car) =>
      car.manufacturer.toLowerCase().includes(mfg)
    );
  }

  if (query.model) {
    const mdl = query.model.toLowerCase();
    results = results.filter((car) => car.model.toLowerCase().includes(mdl));
  }

  if (query.yearMin) {
    results = results.filter((car) => parseInt(car.year) >= query.yearMin!);
  }

  if (query.yearMax) {
    results = results.filter((car) => parseInt(car.year) <= query.yearMax!);
  }

  if (query.priceMin) {
    results = results.filter((car) => parseFloat(car.price) >= query.priceMin!);
  }

  if (query.priceMax) {
    results = results.filter((car) => parseFloat(car.price) <= query.priceMax!);
  }

  if (query.mileageMax) {
    results = results.filter(
      (car) => parseFloat(car.mileage) <= query.mileageMax!
    );
  }

  if (query.fuelType) {
    const fuel = query.fuelType.toLowerCase();
    results = results.filter((car) => car.fuel_type.toLowerCase().includes(fuel));
  }

  const limit = query.limit || 10;
  return results.slice(0, limit);
};

export const getCarStats = async (): Promise<{
  totalListings: number;
  manufacturers: string[];
  avgPrice: number;
  priceRange: { min: number; max: number };
}> => {
  const cars = await loadCarsDatabase();

  const manufacturers = Array.from(
    new Set(cars.map((car) => car.manufacturer))
  ).sort();

  const prices = cars.map((car) => parseFloat(car.price)).filter((p) => !isNaN(p));
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  // Find min/max without spread operator to avoid stack overflow on large datasets
  let minPrice = prices[0];
  let maxPrice = prices[0];
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
  }

  return {
    totalListings: cars.length,
    manufacturers,
    avgPrice: Math.round(avgPrice),
    priceRange: {
      min: Math.round(minPrice),
      max: Math.round(maxPrice),
    },
  };
};
