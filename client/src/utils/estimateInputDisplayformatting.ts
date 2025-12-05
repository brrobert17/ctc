// Capitalize manufacturer names
export const capitalizeManufacturer = (manufacturer: string) => {
  return manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1)
}

// Format drivetrain names
export const formatDrivetrain = (drivetrain: string) => {
  const drivetrainMap: Record<string, string> = {
    'fwd': 'Front-wheel Drive',
    'rwd': 'Rear-wheel Drive', 
    'awd': 'All-wheel Drive',
    '4wd': 'Four-wheel Drive',
    'other': 'Other'
  }
  
  return drivetrainMap[drivetrain.toLowerCase()] || drivetrain
}

// Format transmission names
export const formatTransmission = (transmission: string) => {
  const transmissionMap: Record<string, string> = {
    'automatic': 'Automatic',
    'manual': 'Manual',
    'cvt': 'CVT',
    'single_speed': 'Single Speed',
    'other': 'Other'
  }
  
  return transmissionMap[transmission.toLowerCase()] || transmission.charAt(0).toUpperCase() + transmission.slice(1)
}

// Capitalize color names
export const capitalizeColor = (color: string) => {
  return color.charAt(0).toUpperCase() + color.slice(1)
}

// Format fuel type names
export const formatFuelType = (fuelType: string) => {
  const fuelTypeMap: Record<string, string> = {
    'gas': 'Gas',
    'diesel': 'Diesel',
    'electric': 'Electric',
    'hybrid': 'Hybrid',
    'ng': 'Natural Gas',
    'flex_fuel': "Flex Fuel",
    'other': 'Other'
  }
  
  return fuelTypeMap[fuelType.toLowerCase()] || fuelType.charAt(0).toUpperCase() + fuelType.slice(1)
}

// Format model names
// Capitalize each word, fully capitalize words with 3 or fewer characters
// Remove duplicate single letters (e.g., "c class c 300" → "C Class 300")
export const formatModel = (model: string) => {
  const words = model.split(' ')
  
  if (words.length >= 3 && 
      words[0].length === 1 && 
      words[1].toLowerCase() === 'class' && 
      words[2].length === 1 && 
      words[0].toLowerCase() === words[2].toLowerCase()) {
    const filteredWords = [...words.slice(0, 2), ...words.slice(3)]
    return filteredWords
      .map(word => {
        if (word.length <= 3) {
          return word.toUpperCase()
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        }
      })
      .join(' ')
  }
  
  // Normal formatting for other cases
  return words
    .map(word => {
      if (word.length <= 3) {
        return word.toUpperCase()
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
    })
    .join(' ')
}
