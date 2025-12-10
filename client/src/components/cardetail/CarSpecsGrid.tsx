import type { CarDetail } from '../../types/car.types'

interface CarSpecsGridProps {
  car: CarDetail
}

export function CarSpecsGrid({ car }: CarSpecsGridProps) {
  const specs = [
    { label: 'Make', value: car.makes?.make },
    { label: 'Model', value: car.models?.model },
    { label: 'Year', value: car.model_year },
    { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : null },
    { label: 'Transmission', value: car.transmission_types?.transmission_type },
    { label: 'Fuel Type', value: car.fuel_types?.fuel_type },
    { label: 'Engine', value: car.engine_displacement ? `${car.engine_displacement}${car.power ? ` (${car.power})` : ''}` : car.power },
    { label: 'Body Type', value: car.body_types?.body_type },
    { label: 'Doors', value: car.doors },
    { label: 'Seats', value: car.seats },
    { label: 'Color', value: car.colors?.color || car.color_description },
    { label: 'Interior Color', value: car.interior_colors?.interior_color },
    { label: 'Drivetrain', value: car.drivetrains?.drivetrain },
    { label: 'Location', value: car.car_locations?.car_location },
    { label: 'Number of Owners', value: car.number_of_owners },
    { label: 'VIN', value: car.vin },
    { label: 'First Registration', value: car.first_registration },
    { label: 'Fuel Consumption', value: car.fuel_consumption },
    { label: 'CO2 Emission', value: car.co2_emission },
    { label: 'Euro Standard', value: car.euro_standard },
    { label: 'Weight', value: car.weight },
    { label: 'Top Speed', value: car.top_speed },
    { label: 'Acceleration', value: car.acceleration },
  ].filter(spec => spec.value != null && spec.value !== '')

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 bg-slate-800/50 border-b border-slate-800">
        <h3 className="font-bold text-white">Car Details</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800">
        {specs.map((spec, index) => (
          <div key={index} className="bg-slate-900 p-4 flex justify-between items-center">
            <span className="text-slate-400 text-sm">{spec.label}</span>
            <span className="text-slate-200 font-medium">{spec.value}</span>
          </div>
        ))}
      </div>

      {car.car_features && car.car_features.length > 0 && (
        <>
          <div className="p-4 bg-slate-800/50 border-t border-slate-800">
            <h3 className="font-bold text-white">Features</h3>
          </div>
          <div className="p-4 bg-slate-900">
            <div className="flex flex-wrap gap-2">
              {car.car_features.map((feature, index) => (
                feature.features?.name && (
                  <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full border border-slate-700">
                    {feature.features.name}
                  </span>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
