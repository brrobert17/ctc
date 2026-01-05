import { api } from './api';
import type { CarsResponse, CarsQueryParams, CarDetailResponse } from '../types/car.types';

export const carApi = {

  //Fetch a single car by ID with all details
  getCars: async (params?: CarsQueryParams): Promise<CarsResponse> => {
    const queryParams: Record<string, string | number> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams[key] = value.join(',');
            }
          } else {
            queryParams[key] = value;
          }
        }
      });
    }
    return api.get<CarsResponse>('/cars/core', queryParams);
  },

  getCarById: async (id: number): Promise<CarDetailResponse> => {
    return api.get<CarDetailResponse>(`/cars/${id}`);
  },
};
