import dotenv from 'dotenv';
import prisma from '../database/prisma';
import { MLModelInput, PredictionResponse } from '../types/ml.types';
import { MLService } from '../services/ml.service';

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// Valid manufacturers for model input
const validManufacturers = [
  "acura",
  "audi",
  "bmw",
  "buick",
  "cadillac",
  "chevrolet",
  "chrysler",
  "dodge",
  "ford",
  "gmc",
  "honda",
  "hyundai",
  "infiniti",
  "jaguar",
  "jeep",
  "kia",
  "land rover",
  "lexus",
  "lincoln",
  "mazda",
  "mercedes-benz",
  "mitsubishi",
  "nissan",
  "porsche",
  "ram",
  "subaru",
  "tesla",
  "toyota",
  "volkswagen",
  "volvo"
];

//Map car "make" to model "manufacturers" or return other
function mapManufacturer(make: string | null | undefined): string {
  if (!make) return 'other';
  
  const makeLower = make.toLowerCase().trim();
  
  // Check if make exists in valid manufacturers list
  if (validManufacturers.includes(makeLower)) {
    return makeLower;
  }
  
  return 'other';
}

// Get the Enginesize from name or return 0
function getModelEngineSize(name: string | null | undefined): number {
    if (!name) {
        return 0;
    }

    // Match patterns like "2,0" or "1.6"
    const match = name.match(/(\d+)[,.](\d+)/);
    
    if (match) {
        const engineSize = parseFloat(`${match[1]}.${match[2]}`);
        return engineSize;
    }

    return 0;
}

//Same as notebook and MlService
const validModelVariants= [
  "base", "s", "se", "sel", "ses",
  "sl", "slt", "sle",
  "sr", "sr5",
  "sx", "sxt",

  // Toyota
  "le", "xle", "xse",

  // Honda/Kia/Hyundai
  "lx", "ex", "lxs",

  // GM / Chevrolet trims
  "lt", "1lt", "2lt", "ltz", "ls",

  // Premium trims
  "premium",
  "limited",
  "platinum",
  "luxury",
  "touring",
  "reserve",
  "denali",
  "lariat",
  "titanium",

  // Performance / sport packages
  "sport",
  "gt",
  "turbo",
  "supercharged",
  "srt", "srt8",
  "scat",
  "gti",
  "raptor",
  "hellcat",

  // Jeep-related
  "latitude",
  "trailhawk",
  "sahara",
  "rubicon",
  "overland",
  "altitude",
  "laredo",

  // Ram-related
  "big horn",
  "tradesman",
  "longhorn",
  "rebel",
  "warlock",

  // Volvo
  "inscription",
  "momentum",

  // Misc valid trims
  "prestige",
  "classic",
  "preferred",
  "premier",
];

// Get Variant from name
export function getModelVariant(name?: string | null): string {
  if (!name) return "other";

  let s = name.toLowerCase();
  s = s.replace(/[-/]/g, " ");

  for (const v of validModelVariants) {
    const pattern = new RegExp(`\\b${v.replace(" ", "\\s")}\\b`);
    if (pattern.test(s)) {
      return v;
    }
  }

  return "other";
}

//Clean name for model input similliar to Notebook
export function cleanModel(text?: string | null): string {
  if (!text) return "other";

  let s = text.toLowerCase();

  // normalize separators
  s = s.replace(/[-/]/g, " ");

  // remove drivetrain tokens
  s = s.replace(/\b(awd|4wd|4x4|fwd|rwd)\b/g, " ");

  // remove pure liter engine sizes (2,0 L)
  s = s.replace(/\b\d\,\d\s*l\b/g, " ");

  // remove turbo engine sizes (2,0t)
  s = s.replace(/\b\d\,\d\s*t\b/g, " ");

  // remove numeric engine sizes (2,0)
  s = s.replace(/\b\d\,\d\b/g, " ");

  // remove short “engine codes” like 2l, 3l
  s = s.replace(/\b\d\s*l\b/g, " ");

  // collapse spaces
  s = s.replace(/\s+/g, " ").trim();

  // remove first word (brand/manufacturer)
  const words = s.split(" ");
  if (words.length > 1) {
    s = words.slice(1).join(" ");
  }

  return s || "other";
}


//Convert Danish horsepower to SAE horsepower (1 hk = 0.986 hp) or return 0
function getHorsepower(power: string | null | undefined): number {
  if (!power) return 0;
  
  const hkMatch = power.match(/(\d+)\s*hk/i);
  if (hkMatch) {
    const metricHp = parseInt(hkMatch[1]);

    return Math.round(metricHp * 0.986);
  }
  
  return 0;
}

//Map transmission type to model for missing values return manual
function mapTransmission(transmissionType: number | null | undefined): string {
  if (!transmissionType) return 'manual';
  
  if (transmissionType === 1) return 'automatic';
  if (transmissionType === 2 || transmissionType === 3) return 'manual';
  
  return 'other';
}

//Map drivetrain type to model, for missing values return fwd
function mapDrivetrain(drivetrainType: number | null | undefined): string {
    if (!drivetrainType) return 'fwd';

    if (drivetrainType === 1) return 'rwd';
    if (drivetrainType === 2) return '4wd';
    if (drivetrainType === 3) return 'fwd';

    return 'other';
}

//Map fuel type to model fuel types or return other
function mapFuelType(fuelType: string | null | undefined): string {
  if (!fuelType) return 'other';
  
  const fuelLower = fuelType.toLowerCase().trim();
  
  if (fuelLower === 'benzin') return 'gas';
  if (fuelLower === 'diesel') return 'diesel';
  if (fuelLower === 'el') return 'electric';
  if (fuelLower.includes('hybrid')) return 'hybrid';
  if (fuelLower.includes('plug-in')) return 'hybrid';
  
  return 'other';
}

const validExteriorColors = [
  "beige",
  "black",
  "blue",
  "brown",
  "gold",
  "gray",
  "green",
  "orange",
  "purple",
  "red",
  "silver",
  "white",
  "yellow"
];

// Danish to English color mapping
const danishToEnglishColorMap: Record<string, string> = {
  "Beige": "Beige",
  "Blå": "Blue",
  "Blåmetal": "Blue metal",
  "Brun": "Brown",
  "Brunmetal": "Brown metal",
  "Champagnemetal": "Champagne metal",
  "Grå": "Grey",
  "Gråmetal": "Grey metal",
  "Grøn": "Green",
  "Grønmetal": "Green metal",
  "Hvid": "White",
  "Hvidmetal": "White metal",
  "Koks": "Coke",
  "Koksmetal": "Coke metal",
  "Lysgrønmetal": "Light green metal",
  "Mørkblåmetal": "Dark blue metal",
  "Mørkrødmetal": "Dark red metal",
  "Rød": "Red",
  "Rødmetal": "Red metal",
  "Sort": "Black",
  "Sortmetal": "Black metal",
  "Sølv": "Silver",
  "Sølvmetal": "Silver metal"
};

// Map car exterior color to model input or other
function mapExteriorColor(exterior_color: string | null | undefined): string {
  if (!exterior_color) return "other";

  // First, translate Danish to English if mapping exists
  const translatedColor = danishToEnglishColorMap[exterior_color] || exterior_color;
  
  const value = translatedColor.toLowerCase();

  // Metal colors are set to premium category
  if (value.includes("metal")) {
    return "premium";
  }

  // Check if the base color (without metal) is in valid colors
  if (validExteriorColors.includes(value)) {
    return value;
  }

  return "other";
}


interface MappingInfo {
  manufacturer: { db: string; input: string };
  color: { db: string; input: string };
  fuel: { db: string; input: string };
  transmission: { db: number | string; input: string };
  drivetrain: { db: number | string; input: string };
}

function mapCarToMLInput(car: any): { mlInput: MLModelInput; mappingInfo: MappingInfo } | null {
  try {
    // Convert mileage from km to miles (1 km = 0.621371 miles)
    const mileageInMiles = car.mileage ? Math.round(car.mileage * 0.621371) : 0;
    
    // Convert fuel consumption from km/l to mpg (1 km/l = 2.35214 mpg)
    const fuelConsumptionKmL = car.fuel_consumption ? parseFloat(car.fuel_consumption) : 0;
    const mpgAvg = fuelConsumptionKmL ? parseFloat((fuelConsumptionKmL * 2.35214).toFixed(1)) : 0;

    // Extract values for model processing
    const model = cleanModel(car.name);
    const modelVariant = getModelVariant(car.name);
    
    // Map values and store both DB and input
    const manufacturerInput = mapManufacturer(car.makes?.make);
    const drivetrainInput = mapDrivetrain(car.drivetrain_id);
    const transmissionInput = mapTransmission(car.transmission_type_id);
    const fuelTypeInput = mapFuelType(car.fuel_types?.fuel_type);
    const colorInput = mapExteriorColor(car.colors?.color);
    
    const engineSize = car.engine_displacement ? parseFloat(car.engine_displacement) : 0;
    const year = car.model_year || new Date().getFullYear();

    // Calculate car age
    const carAge = new Date().getFullYear() - year;

    // Create model combinations
    const modelEngine = `${model}_${engineSize}`;
    const modelDrivetrain = `${model}_${drivetrainInput}`;
    const modelFull = `${model}_${engineSize}_${drivetrainInput}`;

    const mlInput: MLModelInput = {
      year: car.model_year,
      mileage: mileageInMiles,
      mpg_avg: mpgAvg,
      engine_size_l: getModelEngineSize(car.name),
      hp: getHorsepower(car.power),
      manufacturer: manufacturerInput,
      model: model,
      transmission: transmissionInput,
      drivetrain: drivetrainInput,
      fuel_type: fuelTypeInput,
      exterior_color: colorInput,
      accidents_or_damage: 0, // Default
      one_owner: (!car.number_of_owners || car.number_of_owners === 1) ? 1 : 0,
      personal_use_only: 1, // Default
      danish_market: car.danish_market,
      car_age: carAge,
      model_variant: modelVariant,
      model_engine: modelEngine,
      model_drivetrain: modelDrivetrain,
      model_full: modelFull,
    };

    const mappingInfo: MappingInfo = {
      manufacturer: { db: car.makes?.make || 'N/A', input: manufacturerInput },
      color: { db: car.colors?.color || 'N/A', input: colorInput },
      fuel: { db: car.fuel_types?.fuel_type || 'N/A', input: fuelTypeInput },
      transmission: { db: car.transmission_types?.id || 'N/A', input: transmissionInput },
      drivetrain: { db: car.drivetrains?.id || 'N/A', input: drivetrainInput }
    };

    return { mlInput, mappingInfo };
  } catch (error) {
    console.error(`Error mapping car ${car.id}:`, error);
    return null;
  }
}

// Process db car records to MLinput
async function processCar(car: any): Promise<{ estimated_price: number; danish_market: number; mappingInfo: MappingInfo } | null> {
  try {
    // Map car data to ML input format
    const result = mapCarToMLInput(car);
    
    if (!result) {
      console.log(`Skipping car ${car.id} - unable to map data`);
      return null;
    }

    const { mlInput, mappingInfo } = result;

    const originalMarket = mlInput.danish_market;

    // Call ML model
    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mlInput),
    });

    if (!mlResponse.ok) {
      console.error(`ML service error for car ${car.id}:`, mlResponse.statusText);
      return null;
    }

    const mlPrediction = await mlResponse.json();
    
    // Convert response based on market
    const convertedResponse = MLService.convertMLResponse(mlPrediction, mlInput.danish_market);

    return {
      estimated_price: convertedResponse.predicted_price,
      danish_market: originalMarket,
      mappingInfo,
    };
  } catch (error) {
    console.error(`Error processing car ${car.id}:`, error);
    return null;
  }
}

// Process All cars from db
async function estimateAllCars() {
  console.log('Starting car estimation process...');
  
  try {
    // Fetch all cars for processing
    const cars = await prisma.car.findMany({
      include: {
        makes: true,
        models: true,
        transmission_types: true,
        drivetrains: true,
        fuel_types: true,
        colors: true,
      },
    });

    if (!cars || cars.length === 0) {
      console.log('No cars found to process');
      return;
    }

    console.log(`Found ${cars.length} cars to process`);
    console.log('Estimation started...\n');

    let processed = 0;
    let skipped = 0;
    let totalPercentageOff = 0;
    let under5Percent = 0;
    let under10Percent = 0;
    let under20Percent = 0;
    let under25Percent = 0;
    let under50Percent = 0;
    let over150Percent = 0;

    // Process each car
    for (const car of cars) {

      // Check if manufacturer is valid (not 'other'), it gives better accuracy but much less data to use so it's unused for now.
     /*const manufacturer = mapManufacturer(car.makes?.make);
      if (manufacturer === 'other') {
        skipped++;
        continue;
      }*/

      // Check if engine size is available
      const engineSize = getModelEngineSize(car.name);
      if (engineSize === 0) {
        skipped++;
        continue;
      }

      // Check if horsepower size is available
      const horsepower = getHorsepower(car.power);
      if (horsepower === 0) {
        skipped++;
        continue;
      }


      const result = await processCar(car);
      
      if (result) {
        // Calculate accuracy using estimated price as denominator (matches frontend)
        const actualPrice = car.price || 0;
        const estimatedPrice = result.estimated_price;
        const difference = actualPrice - estimatedPrice;
        const percentageOff = estimatedPrice > 0 ? ((difference / estimatedPrice) * 100) : 0;
        const absPercentageOff = Math.abs(percentageOff);
        
        // Only save to database if accuracy is within 20%
        if (absPercentageOff <= 20) {
          await prisma.car.update({
            where: { id: car.id },
            data: {
              estimated_price: result.estimated_price,
              danish_market: result.danish_market,
            },
          });
        }
        
        // Analysis
        totalPercentageOff += absPercentageOff;
        
        if (absPercentageOff <= 5) {
          under5Percent++;
        }
        if (absPercentageOff <= 10) {
          under10Percent++;
        }
        if (absPercentageOff <= 20) {
          under20Percent++;
        }
        if (absPercentageOff <= 25) {
          under25Percent++;
        }
        if (absPercentageOff <= 50) {
          under50Percent++;
        }
        if (absPercentageOff > 150) {
          over150Percent++;
        }
        
        const model = cleanModel(car.name);
        const variant = getModelVariant(car.name);
        
        // Use mapping info from result
        const { mappingInfo } = result;
        
        console.log(`Car: ${car.id}, Model: ${model}, Variant: ${variant}`);
        console.log(`  Manufacturer - DB: ${mappingInfo.manufacturer.db}, Input: ${mappingInfo.manufacturer.input}`);
        console.log(`  Color - DB: ${mappingInfo.color.db}, Input: ${mappingInfo.color.input}`);
        console.log(`  Fuel - DB: ${mappingInfo.fuel.db}, Input: ${mappingInfo.fuel.input}`);
        console.log(`  Transmission - DB: ${mappingInfo.transmission.db}, Input: ${mappingInfo.transmission.input}`);
        console.log(`  Drivetrain - DB: ${mappingInfo.drivetrain.db}, Input: ${mappingInfo.drivetrain.input}`);
        console.log(`  Price: ${actualPrice}, Estimation: ${result.estimated_price}, Difference: ${difference} (${percentageOff.toFixed(2)}%)\n`);
        processed++;
      } else {
        console.log(`Car: ${car.id} skipped - processing failed`);
        skipped++;
      }
    }

    const averagePercentageOff = processed > 0 ? (totalPercentageOff / processed).toFixed(2) : 0;
    console.log(`\n✓ Estimations complete: ${processed} cars processed, ${skipped} cars skipped`);
    console.log(`Average percentage off: ${averagePercentageOff}%`);
    console.log(`Cars within 5% accuracy: ${under5Percent} (${processed > 0 ? ((under5Percent / processed) * 100).toFixed(2) : 0}%)`);
    console.log(`Cars within 10% accuracy: ${under10Percent} (${processed > 0 ? ((under10Percent / processed) * 100).toFixed(2) : 0}%)`);
    console.log(`Cars within 20% accuracy: ${under20Percent} (${processed > 0 ? ((under20Percent / processed) * 100).toFixed(2) : 0}%)`);
    console.log(`Cars within 25% accuracy: ${under25Percent} (${processed > 0 ? ((under25Percent / processed) * 100).toFixed(2) : 0}%)`);
    console.log(`Cars within 50% accuracy: ${under50Percent} (${processed > 0 ? ((under50Percent / processed) * 100).toFixed(2) : 0}%)`);
    console.log(`Cars over 150% off: ${over150Percent} (${processed > 0 ? ((over150Percent / processed) * 100).toFixed(2) : 0}%)`);
    
  } catch (error) {
    console.error('Error in estimation process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
estimateAllCars()
  .then(() => {
    console.log('Script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
