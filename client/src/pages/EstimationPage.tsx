import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import modelInputDb from '../db/model_input_db.json'
import manufacturerModelMap from '../db/manufacturer_model_map.json'
import type { EstimationUserInput } from '../types/ml.types'

const { manufacturerToModels, modelToManufacturer } = manufacturerModelMap as {
  manufacturerToModels: Record<string, string[]>;
  modelToManufacturer: Record<string, string>;
};

interface EstimationResult {
  predicted_price: number
}

export default function EstimatePage() {
  const [formData, setFormData] = useState<EstimationUserInput>({
    year: 2025,
    mileage: 0,
    mpg_avg: 0,
    engine_size_l: 0.6,
    hp: 0,
    manufacturer: '',
    model: '',
    transmission: '',
    drivetrain: '',
    fuel_type: '',
    exterior_color: '',
    accidents_or_damage: 0,
    one_owner: 1,
    personal_use_only: 1,
    danish_market: 1, // Default to Danish market
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('http://localhost:3000/api/ml/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Estimation failed')
      }
      
      return response.json() as Promise<{ data: EstimationResult }>
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (checked ? 1 : 0) : (type === 'number' ? Number(value) : value)
      }

      // Handle dependent dropdowns
      if (name === 'manufacturer') {
        // If manufacturer changes, check if current model is valid for new manufacturer
        const availableModels = manufacturerToModels[value as string] || []
        const currentModel = prev.model
        
        // If we have a model selected, and it's not in the new manufacturer's list, reset it
        if (value && currentModel && !availableModels.includes(currentModel)) {
           newData.model = ''
        }
      }

      if (name === 'model') {
        // If model changes, auto-select manufacturer (unless it's "other")
        const selectedModel = value as string
        if (selectedModel && selectedModel.toLowerCase() !== 'other') {
          const associatedManu = modelToManufacturer[selectedModel]
          if (associatedManu) {
            newData.manufacturer = associatedManu
          }
        }
      }

      return newData
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const currentYear = new Date().getFullYear() + 1
  const years = Array.from({ length: 47 }, (_, i) => currentYear - i) // 2026 - 1980

  // Filter models based on selected manufacturer
  const availableModels = formData.manufacturer && manufacturerToModels[formData.manufacturer]
    ? manufacturerToModels[formData.manufacturer]
    : modelInputDb.model.sort()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Get AI Price Estimation</h1>
          <p className="text-slate-400">Enter car details below to get an estimated market price.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Market Selection Buttons */}
              <div className="mb-6 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="grid grid-cols-2">
                  {/* Danish Market Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, danish_market: 1 }))}
                    className={`flex items-center justify-center px-6 py-4 transition-all duration-200 font-medium cursor-pointer ${
                      formData.danish_market === 1 
                        ? 'bg-sky-600 text-white shadow-xl ring-2 ring-sky-400 ring-opacity-50' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    <img
                      src="https://flagcdn.com/w20/dk.png"
                      srcSet="https://flagcdn.com/w40/dk.png 2x"
                      width="24"
                      alt="Denmark"
                      className="mr-3"
                    />
                    <span className="text-base">Danish Market</span>
                  </button>
                  
                  {/* US Market Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, danish_market: 0 }))}
                    className={`flex items-center justify-center px-6 py-4 transition-all duration-200 font-medium cursor-pointer ${
                      formData.danish_market === 0 
                        ? 'bg-sky-600 text-white shadow-xl ring-2 ring-sky-400 ring-opacity-50' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    <img
                      src="https://flagcdn.com/w20/us.png"
                      srcSet="https://flagcdn.com/w40/us.png 2x"
                      width="24"
                      alt="United States"
                      className="mr-3"
                    />
                    <span className="text-base">US Market</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    {formData.danish_market === 1 ? 'Mileage (km)' : 'Mileage (miles)'}
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Manufacturer</label>
                  <select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select Manufacturer</option>
                    {modelInputDb.manufacturer.sort().map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Model</label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                     <option value="">Select Model</option>
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Engine Size (L)</label>
                  <select
                    name="engine_size_l"
                    value={formData.engine_size_l}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                     {modelInputDb.engine_size_l.sort().map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                 <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Fuel Type</label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select Fuel Type</option>
                    {modelInputDb.fuel_type.sort().map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Drivetrain</label>
                  <select
                    name="drivetrain"
                    value={formData.drivetrain}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select Drivetrain</option>
                    {modelInputDb.drivetrain.sort().map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                 <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select Transmission</option>
                    {modelInputDb.transmission.sort().map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                  <select
                    name="exterior_color"
                    value={formData.exterior_color}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select Color</option>
                    {modelInputDb.exterior_color.sort().map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Horsepower</label>
                  <input
                    type="number"
                    name="hp"
                    value={formData.hp}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    {formData.danish_market === 1 ? 'Fuel Economy (km/l)' : 'MPG Average'}
                  </label>
                  <input
                    type="number"
                    name="mpg_avg"
                    value={formData.mpg_avg}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder={formData.danish_market === 1 ? "e.g. 12.5" : "e.g. 28.5"}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <p className="text-sm font-medium text-slate-400">Vehicle History & Condition</p>
                <div className="flex flex-col gap-3">
                   <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accidents_or_damage"
                      checked={formData.accidents_or_damage === 1}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-slate-300">Has Accidents or Damage</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="one_owner"
                      checked={formData.one_owner === 1}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-slate-300">One Owner</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="personal_use_only"
                      checked={formData.personal_use_only === 1}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-slate-300">Personal Use Only</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
              >
                {mutation.isPending ? 'Calculating...' : 'Get Estimate'}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Estimated Price</h2>
            
            {mutation.data ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 mb-2">Based on market data</p>
                <div className="text-4xl font-extrabold text-emerald-400">
                  {formData.danish_market === 1 
                    ? `${mutation.data.data.predicted_price.toLocaleString('da-DK')} DKK`
                    : `$${mutation.data.data.predicted_price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                  }
                </div>
                <div className="mt-4 p-3 bg-slate-800 rounded text-xs text-slate-400 text-left">
                  <p><strong>Confidence:</strong> High</p>
                  <p><strong>Model:</strong> LightGBM Regressor</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <p>Fill out the form to see the price estimation</p>
              </div>
            )}
            
            {mutation.isError && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                 <p className="font-bold">Error</p>
                 <p>{mutation.error.message}</p>
                 <p className="text-xs mt-2 opacity-75">Ensure backend and ML service are running.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
