export interface Car {
  id: number;
  make: string | null;
  model: string | null;
  year: number | null;
  location: string | null;
  price: number | null;
  image: string | null;
  transmission: string | null;
  fuelType: string | null;
  mileage: number | null;
  url: string | null;
  source: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CarsResponse {
  success: boolean;
  message: string;
  data: Car[];
  pagination: PaginationMeta;
}

export interface CarsQueryParams {
  page?: number;
  limit?: number;
}
