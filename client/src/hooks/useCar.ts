import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { carApi } from '../utils/carApi';
import type { CarDetailResponse } from '../types/car.types';

/**
 * React Query hook for fetching a single car by ID
 * @param id - Car ID
 * @param options - Additional React Query options
 * @returns Query result with car details, loading state, and error handling
 */
export function useCar(
  id: number,
  options?: Omit<UseQueryOptions<CarDetailResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => carApi.getCarById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    enabled: !!id && id > 0, // Only fetch if valid ID
    ...options,
  });
}
