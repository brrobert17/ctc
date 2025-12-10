import { useNavigate } from '@tanstack/react-router'
import { useComparison } from '../contexts/ComparisonContext'

export default function ComparisonPage() {
  const { comparisonCars, removeFromComparison, clearComparison } = useComparison()
  const navigate = useNavigate()

  if (comparisonCars.length === 0) {
    return (
      <div className="bg-slate-950 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Car Comparison</h1>
            <button
              onClick={() => navigate({ to: '/browse' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
            >
              Browse Cars
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
            <svg
              className="w-16 h-16 text-slate-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">No Cars to Compare</h2>
            <p className="text-slate-400 mb-6">
              Add at least 2 cars from their detail pages to compare them side-by-side.
            </p>
            <button
              onClick={() => navigate({ to: '/browse' })}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-md transition-colors"
            >
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Define the specifications to compare
  const specs = [
    { key: 'price', label: 'Price', format: (val: number | null) => val ? `${val.toLocaleString()} DKK` : 'N/A' },
    { key: 'model_year', label: 'Year', format: (val: number | null) => val || 'N/A' },
    { key: 'make', label: 'Make', format: (car: any) => car.makes?.make || 'N/A' },
    { key: 'model', label: 'Model', format: (car: any) => car.models?.model || 'N/A' },
    { key: 'mileage', label: 'Mileage', format: (val: number | null) => val ? `${val.toLocaleString()} km` : 'N/A' },
    { key: 'fuel_type', label: 'Fuel Type', format: (car: any) => car.fuel_types?.fuel_type || 'N/A' },
    { key: 'transmission', label: 'Transmission', format: (car: any) => car.transmission_types?.transmission_type || 'N/A' },
    { key: 'body_type', label: 'Body Type', format: (car: any) => car.body_types?.body_type || 'N/A' },
    { key: 'power', label: 'Power', format: (val: string | null) => val || 'N/A' },
    { key: 'engine_displacement', label: 'Engine', format: (val: string | null) => val || 'N/A' },
    { key: 'doors', label: 'Doors', format: (val: number | null) => val || 'N/A' },
    { key: 'seats', label: 'Seats', format: (val: number | null) => val || 'N/A' },
    { key: 'color', label: 'Color', format: (car: any) => car.colors?.color || car.color_description || 'N/A' },
    { key: 'interior_color', label: 'Interior Color', format: (car: any) => car.interior_colors?.interior_color || 'N/A' },
    { key: 'drivetrain', label: 'Drivetrain', format: (car: any) => car.drivetrains?.drivetrain || 'N/A' },
    { key: 'first_registration', label: 'First Registration', format: (val: string | null) => val || 'N/A' },
    { key: 'fuel_consumption', label: 'Fuel Consumption', format: (val: string | null) => val || 'N/A' },
    { key: 'co2_emission', label: 'CO2 Emission', format: (val: string | null) => val || 'N/A' },
    { key: 'euro_standard', label: 'Euro Standard', format: (val: string | null) => val || 'N/A' },
    { key: 'weight', label: 'Weight', format: (val: string | null) => val || 'N/A' },
    { key: 'top_speed', label: 'Top Speed', format: (val: string | null) => val || 'N/A' },
    { key: 'acceleration', label: 'Acceleration', format: (val: string | null) => val || 'N/A' },
    { key: 'number_of_owners', label: 'Owners', format: (val: number | null) => val || 'N/A' },
    { key: 'location', label: 'Location', format: (car: any) => car.car_locations?.car_location || 'N/A' },
  ]

  const getCarTitle = (car: any) => {
    return `${car.model_year || ''} ${car.makes?.make || ''} ${car.models?.model || ''}`.trim() || 'Unknown Car'
  }

  const getMainImage = (car: any) => {
    return car.car_images?.[0]?.image_url || 'https://via.placeholder.com/400x300?text=No+Image'
  }

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Car Comparison</h1>
            <p className="text-slate-400">
              Comparing {comparisonCars.length} car{comparisonCars.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: '/browse' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
            >
              Browse More
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all cars from comparison?')) {
                  clearComparison()
                }
              }}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-slate-300 min-w-[200px]">
                    Specification
                  </th>
                  {comparisonCars.map((car) => (
                    <th key={car.id} className="px-4 py-3 text-center min-w-[250px]">
                      <div className="space-y-3">
                        <div className="relative h-40 bg-slate-800 rounded-lg overflow-hidden">
                          <img
                            src={getMainImage(car)}
                            alt={getCarTitle(car)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm font-semibold text-white">{getCarTitle(car)}</h3>
                        <button
                          onClick={() => removeFromComparison(car.id)}
                          className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs font-medium rounded-md transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => navigate({ to: '/listing/$carId', params: { carId: car.id.toString() } })}
                          className="w-full px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={spec.key}
                    className={`border-b border-slate-800 ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'}`}
                  >
                    <td className="sticky left-0 z-10 px-4 py-3 text-sm font-medium text-slate-300 bg-inherit">
                      {spec.label}
                    </td>
                    {comparisonCars.map((car) => {
                      let value
                      // Handle nested properties
                      if (typeof spec.format === 'function' && spec.format.length === 1) {
                        if (['make', 'model', 'fuel_type', 'transmission', 'body_type', 'color', 'interior_color', 'drivetrain', 'location'].includes(spec.key)) {
                          value = spec.format(car)
                        } else {
                          value = spec.format((car as any)[spec.key])
                        }
                      } else {
                        value = (car as any)[spec.key]
                      }

                      return (
                        <td key={car.id} className="px-4 py-3 text-sm text-center text-slate-300">
                          {value}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Warning */}
        <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-lg p-4 md:hidden">
          <p className="text-xs text-slate-400 text-center">
            💡 Tip: For better viewing experience, try rotating your device to landscape mode or use a larger screen.
          </p>
        </div>
      </div>
    </div>
  )
}
