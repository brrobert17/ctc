export interface EstimationUserInput {
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