import { useState } from 'react'

export interface PriceFilter {
  minPrice: number
  maxPrice: number
}

export interface YearFilter {
  minYear: number
  maxYear: number
}

export interface MileageFilter {
  minMileage: number
  maxMileage: number
}

interface FiltersSidebarProps {
  priceFilter: PriceFilter
  onPriceChange: (filter: PriceFilter) => void
  yearFilter: YearFilter
  onYearChange: (filter: YearFilter) => void
  mileageFilter: MileageFilter
  onMileageChange: (filter: MileageFilter) => void
  selectedBodyTypes: string[]
  onBodyTypesChange: (types: string[]) => void
  selectedFuelTypes: string[]
  onFuelTypesChange: (types: string[]) => void
  selectedTransmissions: string[]
  onTransmissionsChange: (types: string[]) => void
}

const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'Stationcar']
const FUEL_TYPES = ['Benzin', 'Diesel', 'Hybrid', 'El']
const TRANSMISSIONS = ['Automatisk', 'Manuel']

export function FiltersSidebar({ priceFilter, onPriceChange, yearFilter, onYearChange, mileageFilter, onMileageChange, selectedBodyTypes, onBodyTypesChange, selectedFuelTypes, onFuelTypesChange, selectedTransmissions, onTransmissionsChange }: FiltersSidebarProps) {
  const [isAdvanced, setIsAdvanced] = useState(false)

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between bg-slate-900 p-1 rounded-lg border border-slate-800">
        <button 
          onClick={() => setIsAdvanced(false)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!isAdvanced ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Novice filters
        </button>
        <button 
          onClick={() => setIsAdvanced(true)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${isAdvanced ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Advanced filters
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-200">Price Range</label>
          <span className="text-sm font-bold text-sky-400">
            {priceFilter.minPrice.toLocaleString()} - {priceFilter.maxPrice.toLocaleString()} DKK
          </span>
        </div>
        <div className="relative h-2 mt-6 mb-2">
          {/* Track background */}
          <div className="absolute inset-0 bg-slate-800 rounded-lg" />
          {/* Active range highlight */}
          <div 
            className="absolute h-full bg-sky-500 rounded-lg"
            style={{
              left: `${(priceFilter.minPrice / 1000000) * 100}%`,
              right: `${100 - (priceFilter.maxPrice / 1000000) * 100}%`
            }}
          />
          {/* Min price slider */}
          <input 
            type="range" 
            min="0" 
            max="1000000" 
            step="10000" 
            value={priceFilter.minPrice} 
            onChange={(e) => {
              const newMin = Number(e.target.value)
              onPriceChange({ 
                ...priceFilter, 
                minPrice: Math.min(newMin, priceFilter.maxPrice - 20000) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-l-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-r-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-l-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-r-0"
          />
          {/* Max price slider */}
          <input 
            type="range" 
            min="0" 
            max="1000000" 
            step="10000" 
            value={priceFilter.maxPrice} 
            onChange={(e) => {
              const newMax = Number(e.target.value)
              onPriceChange({ 
                ...priceFilter, 
                maxPrice: Math.max(newMax, priceFilter.minPrice + 20000) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-r-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-l-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-r-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-l-0"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 DKK</span>
          <span>1M+ DKK</span>
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-200">Year Range</label>
          <span className="text-sm font-bold text-sky-400">
            {yearFilter.minYear} - {yearFilter.maxYear}
          </span>
        </div>
        <div className="relative h-2 mt-6 mb-2">
          {/* Track background */}
          <div className="absolute inset-0 bg-slate-800 rounded-lg" />
          {/* Active range highlight */}
          <div 
            className="absolute h-full bg-sky-500 rounded-lg"
            style={{
              left: `${((yearFilter.minYear - 1990) / (2025 - 1990)) * 100}%`,
              right: `${100 - ((yearFilter.maxYear - 1990) / (2025 - 1990)) * 100}%`
            }}
          />
          {/* Min year slider */}
          <input 
            type="range" 
            min="1990" 
            max="2025" 
            step="1" 
            value={yearFilter.minYear} 
            onChange={(e) => {
              const newMin = Number(e.target.value)
              onYearChange({ 
                ...yearFilter, 
                minYear: Math.min(newMin, yearFilter.maxYear - 1) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-l-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-r-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-l-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-r-0"
          />
          {/* Max year slider */}
          <input 
            type="range" 
            min="1990" 
            max="2025" 
            step="1" 
            value={yearFilter.maxYear} 
            onChange={(e) => {
              const newMax = Number(e.target.value)
              onYearChange({ 
                ...yearFilter, 
                maxYear: Math.max(newMax, yearFilter.minYear + 1) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-r-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-l-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-r-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-l-0"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>1990</span>
          <span>2025</span>
        </div>
      </div>

      {/* Mileage Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-200">Mileage Range</label>
          <span className="text-sm font-bold text-sky-400">
            {mileageFilter.minMileage.toLocaleString()} - {mileageFilter.maxMileage.toLocaleString()} km
          </span>
        </div>
        <div className="relative h-2 mt-6 mb-2">
          {/* Track background */}
          <div className="absolute inset-0 bg-slate-800 rounded-lg" />
          {/* Active range highlight */}
          <div 
            className="absolute h-full bg-sky-500 rounded-lg"
            style={{
              left: `${(mileageFilter.minMileage / 500000) * 100}%`,
              right: `${100 - (mileageFilter.maxMileage / 500000) * 100}%`
            }}
          />
          {/* Min mileage slider */}
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="5000" 
            value={mileageFilter.minMileage} 
            onChange={(e) => {
              const newMin = Number(e.target.value)
              onMileageChange({ 
                ...mileageFilter, 
                minMileage: Math.min(newMin, mileageFilter.maxMileage - 10000) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-l-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-r-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-l-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-r-0"
          />
          {/* Max mileage slider */}
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="5000" 
            value={mileageFilter.maxMileage} 
            onChange={(e) => {
              const newMax = Number(e.target.value)
              onMileageChange({ 
                ...mileageFilter, 
                maxMileage: Math.max(newMax, mileageFilter.minMileage + 10000) 
              })
            }}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:rounded-r-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:border-l-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:rounded-r-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:border-l-0"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 km</span>
          <span>500k+ km</span>
        </div>
        {/* Novice Tooltip */}
        <div className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Lower mileage usually means less wear and tear.
        </div>
      </div>

      {/* Body Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-200">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((type) => (
            <label key={type} className="cursor-pointer">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={selectedBodyTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onBodyTypesChange([...selectedBodyTypes, type])
                  } else {
                    onBodyTypesChange(selectedBodyTypes.filter(t => t !== type))
                  }
                }}
              />
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 peer-checked:bg-sky-900/30 peer-checked:text-sky-400 peer-checked:border-sky-500/50 hover:border-slate-600 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-200">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((type) => (
            <label key={type} className="cursor-pointer">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={selectedFuelTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFuelTypesChange([...selectedFuelTypes, type])
                  } else {
                    onFuelTypesChange(selectedFuelTypes.filter(t => t !== type))
                  }
                }}
              />
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 peer-checked:bg-sky-900/30 peer-checked:text-sky-400 peer-checked:border-sky-500/50 hover:border-slate-600 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-200">Transmission</label>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map((type) => (
            <label key={type} className="cursor-pointer">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={selectedTransmissions.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onTransmissionsChange([...selectedTransmissions, type])
                  } else {
                    onTransmissionsChange(selectedTransmissions.filter(t => t !== type))
                  }
                }}
              />
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 peer-checked:bg-sky-900/30 peer-checked:text-sky-400 peer-checked:border-sky-500/50 hover:border-slate-600 transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvanced && (
        <div className="pt-6 border-t border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-200">Min Horsepower</label>
            <input 
              type="range" 
              min="50" 
              max="500" 
              step="10" 
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>50 HP</span>
              <span>500+ HP</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-200">Min Engine Size</label>
              <span className="text-sm font-bold text-sky-400">1.6 L</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="60" 
              step="1" 
              defaultValue="16"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0.8 L</span>
              <span>6.0+ L</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Cylinders</label>
            <div className="flex flex-wrap gap-2">
              {['3', '4', '5', '6', '8+'].map((cyl) => (
                <label key={cyl} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="inline-block w-8 h-8 leading-8 text-center rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 peer-checked:bg-sky-900/30 peer-checked:text-sky-400 peer-checked:border-sky-500/50 hover:border-slate-600 transition-colors">
                    {cyl}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Drivetrain</label>
            <div className="flex flex-wrap gap-2">
              {['FWD', 'RWD', 'AWD'].map((type) => (
                <label key={type} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 peer-checked:bg-sky-900/30 peer-checked:text-sky-400 peer-checked:border-sky-500/50 hover:border-slate-600 transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-slate-200">Seller Type</label>
             <div className="space-y-2">
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900" />
                 <span className="text-sm text-slate-400 group-hover:text-slate-300">Dealer</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900" />
                 <span className="text-sm text-slate-400 group-hover:text-slate-300">Private Seller</span>
               </label>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
