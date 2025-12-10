import { UserInput, MLModelInput, ValidationResult, PredictionResponse } from '../types/ml.types';

export class MLService {

  static async processUserInput(userInput: UserInput): Promise<any> {
    
    // Convert Danish units to US units if needed (ML model expects US units)
    let convertedInput = { ...userInput };
    if (userInput.danish_market === 1) {
      convertedInput = this.convertDanishToUSUnits(userInput);
    }
    
    // Process model information to get features
    const modelInfo = await this.processModelInformation(
      convertedInput.model,
      convertedInput.drivetrain,
      convertedInput.engine_size_l,
      convertedInput.year
    );
    
    // Combine converted input with processed model information
    const processedData = {
      ...convertedInput,
      ...modelInfo
    };
    
    return {
      processed_data: processedData,
      original_market: userInput.danish_market,
      message: 'Data processed successfully'
    };
  }

 // Convert Danish market units to US units for ML model processing
  static convertDanishToUSUnits(input: UserInput): UserInput {
    return {
      ...input,
      // Convert mileage: km to miles (1 km = 0.621371 miles)
      mileage: Math.round(input.mileage * 0.621371),

      // Convert fuel economy: km/l to mpg (1 km/l = 2.35214 mpg)
      mpg_avg: parseFloat((input.mpg_avg * 2.35214).toFixed(1)),

      // Keep danish_market flag for response conversion
      danish_market: input.danish_market
    };
  }

  // Convert ML model response based on original market selection
  static convertMLResponse(mlResponse: any, originalMarket: number): any {
    if (originalMarket === 1) {
      // Danish market: convert USD to DKK (approximate rate: 1 USD = 6.44 DKK)
      const exchangeRate = 6.44;
      return {
        ...mlResponse,
        predicted_price: Math.round(mlResponse.predicted_price * exchangeRate),
        currency: 'DKK',
        original_price_usd: mlResponse.predicted_price
      };
    } else {
      // US market
      return {
        ...mlResponse,
        currency: 'USD'
      };
    }
  }


  static async processModelInformation(model: string, drive_train: string, engine_size_l: number, year: number) {
    // Extract Model variant from base model
    const modelVariant = this.extractModelVariant(model);
    
    // Calculate car age: current year - year
    const carAge = new Date().getFullYear() - year;
    
    // Create model combinations according to the notebook feature engineering
    const modelEngine = model + "_" + engine_size_l.toString();
    const modelDrivetrain = model + "_" + drive_train;
    const modelFull = model + "_" + engine_size_l.toString() + "_" + drive_train;
    
    const modelOutput = {
      car_age: carAge,
      model_variant: modelVariant,
      model_engine: modelEngine,
      model_drivetrain: modelDrivetrain,
      model_full: modelFull
    };
    
    return modelOutput;
  }

  // Extract model variant from model string following the notebook logic
  static extractModelVariant(text: string): string {
    const VARIANTS = [
      // Common trims
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

    if (!text || text.trim() === '') {
      return "other";
    }

    let s = text.toLowerCase();
    
    // If the model is "other", variant should also be "other"
    if (s.trim() === 'other') {
      return "other";
    }
    // Normalize separators
    s = s.replace(/[-/]/g, ' ');

    for (const variant of VARIANTS) {
      // Loops whole model looking for variant match
      const pattern = new RegExp(`\\b${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (pattern.test(s)) {
        return variant;
      }
    }

    return "other";
  }
}
