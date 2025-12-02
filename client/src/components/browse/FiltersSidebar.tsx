import { useState } from 'react'

export function FiltersSidebar() {
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [price, setPrice] = useState(150000)
  const [year, setYear] = useState(2018)
  const [mileage, setMileage] = useState(100000)

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
          <label className="text-sm font-medium text-slate-200">Max Price</label>
          <span className="text-sm font-bold text-sky-400">{price.toLocaleString()} DKK</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1000000" 
          step="5000" 
          value={price} 
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 DKK</span>
          <span>1M+ DKK</span>
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-200">Min Year</label>
          <span className="text-sm font-bold text-sky-400">{year}</span>
        </div>
        <input 
          type="range" 
          min="1990" 
          max="2025" 
          step="1" 
          value={year} 
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>1990</span>
          <span>2025</span>
        </div>
      </div>

      {/* Mileage Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-200">Max Mileage</label>
          <span className="text-sm font-bold text-sky-400">{mileage.toLocaleString()} km</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="500000" 
          step="5000" 
          value={mileage} 
          onChange={(e) => setMileage(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 km</span>
          <span>500k+ km</span>
        </div>
        {/* Novice Tooltip - Always visible here for demo */}
        <div className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Lower mileage usually means less wear and tear.
        </div>
      </div>

      {/* Body Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-200">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {['Hatchback', 'Sedan', 'SUV', 'Station Wagon'].map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="checkbox" className="peer sr-only" />
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
          {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="checkbox" className="peer sr-only" />
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
          {['Manual', 'Automatic'].map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="checkbox" className="peer sr-only" />
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
