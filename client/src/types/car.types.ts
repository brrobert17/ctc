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
  estimatedPrice: number | null;
  danishMarket: number |null;
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

export interface CarDetail {
  id: number;
  make_id: number | null;
  model_id: number | null;
  fuel_type_id: number | null;
  body_type_id: number | null;
  color_id: number | null;
  transmission_type_id: number | null;
  drivetrain_id: number | null;
  listing_type_id: number | null;
  category_id: number | null;
  interior_color_id: number | null;
  car_location_id: number | null;
  source_id: number | null;
  source: string | null;
  name: string | null;
  price: number | null;
  description: string | null;
  url: string | null;
  first_registration: string | null;
  mileage: number | null;
  model_year: number | null;
  engine_displacement: string | null;
  power: string | null;
  top_speed: string | null;
  acceleration: string | null;
  fuel_consumption: string | null;
  co2_emission: string | null;
  euro_standard: string | null;
  weight: string | null;
  towing_weight: string | null;
  doors: number | null;
  seats: number | null;
  periodic_tax: string | null;
  vin: string | null;
  trunk_size: string | null;
  width: string | null;
  battery_capacity: string | null;
  range: string | null;
  energy_consumption: string | null;
  dc_charging_time_10_80_percent: string | null;
  fast_charging_dc: string | null;
  home_charging_ac: string | null;
  next_inspection_date: string | null;
  latest_inspection_date: string | null;
  number_of_gears: number | null;
  number_of_owners: number | null;
  new_price: string | null;
  manufactured: string | null;
  color_description: string | null;
  estimated_price: number | null;
  danish_market: number | null;
  makes: { make: string | null } | null;
  models: { model: string | null } | null;
  fuel_types: { fuel_type: string | null } | null;
  body_types: { body_type: string | null } | null;
  colors: { color: string | null } | null;
  transmission_types: { transmission_type: string | null } | null;
  drivetrains: { drivetrain: string | null } | null;
  listing_types: { listing_type: string | null } | null;
  categorys: { category: string | null } | null;
  interior_colors: { interior_color: string | null } | null;
  car_locations: { car_location: string | null } | null;
  sources: { source: string | null } | null;
  car_images: { image_url: string | null }[];
  car_features: { features: { name: string | null } }[];
}

export interface CarDetailResponse {
  success: boolean;
  message: string;
  data: CarDetail;
}
