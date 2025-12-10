import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { carApi } from '../utils/carApi';
import type { CarsResponse, CarsQueryParams } from '../types/car.types';

/**
 * React Query hook for fetching cars with pagination
 * @param params - Query parameters (page, limit)
 * @param options - Additional React Query options
 * @returns Query result with cars data, loading state, and error handling
 */
export function useCars(
  params?: CarsQueryParams,
  options?: Omit<UseQueryOptions<CarsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => carApi.getCars(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    ...options,
  });
}
