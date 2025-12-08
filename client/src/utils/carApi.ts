import { api } from './api';
import type { CarsResponse, CarsQueryParams, CarDetailResponse } from '../types/car.types';

export const carApi = {
  /**
   * Fetch cars with core information
   * @param params - Query parameters for pagination
   * @returns Promise with cars data and pagination metadata
   */
  getCars: async (params?: CarsQueryParams): Promise<CarsResponse> => {
    return api.get<CarsResponse>('/cars/core', params as Record<string, string | number>);
  },

  /**
   * Fetch a single car by ID with all details
   * @param id - Car ID
   * @returns Promise with full car details
   */
  getCarById: async (id: number): Promise<CarDetailResponse> => {
    return api.get<CarDetailResponse>(`/cars/${id}`);
  },
};
