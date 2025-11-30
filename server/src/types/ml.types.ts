export interface UserInput {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  drivetrain: string;
  fuel_type: string;
  exterior_color: string;
  hp: number;
  engine_size_l: number;
  mpg_avg: number;
  accidents_or_damage: number; // 1 or 0
  one_owner: number; // 1 or 0
  personal_use_only: number; // 1 or 0
  danish_market: number; // 1 or 0
}

export interface MLModelInput {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  drivetrain: string;
  fuel_type: string;
  exterior_color: string;
  hp: number;
  engine_size_l: number;
  mpg_avg: number;
  accidents_or_damage: number;
  one_owner: number;
  personal_use_only: number;
  car_age: number;
  model_variant: string;
  model_engine: string;
  model_drivetrain: string;
  model_full: string;
  danish_market: number; // 1 or 0
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PredictionResponse {
  predicted_price: number;
  confidence?: number;
  model_version?: string;
}
