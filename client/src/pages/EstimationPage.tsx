import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { LoginPrompt } from '../components/auth/LoginPrompt'
import { fetchWithAuth, saveEstimation } from '../utils/auth'
import { capitalizeManufacturer, formatDrivetrain, formatTransmission, capitalizeColor, formatFuelType, formatModel } from '../utils/estimateInputDisplayformatting'
import modelInputDb from '../db/model_input_db.json'
import manufacturerModelMap from '../db/manufacturer_model_map.json'
import type { EstimationUserInput } from '../types/ml.types'
import { useNavigate } from '@tanstack/react-router'

const { manufacturerToModels, modelToManufacturer } = manufacturerModelMap as {
  manufacturerToModels: Record<string, string[]>;
  modelToManufacturer: Record<string, string>;
};

interface EstimationResult {
  predicted_price: number
  currency?: string
  original_price_usd?: number
}

function EstimationForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentEstimationSaved, setCurrentEstimationSaved] = useState(false)
  const [saveEstimationError, setSaveEstimationError] = useState<string | null>(null)
  const [modelSearchTerm, setModelSearchTerm] = useState('')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [manufacturerSearchTerm, setManufacturerSearchTerm] = useState('')
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false)
  const [yearError, setYearError] = useState('')
  const [manufacturerError, setManufacturerError] = useState('')
  const [modelError, setModelError] = useState('')
  const [formData, setFormData] = useState<EstimationUserInput>({
    year: 0,
    mileage: 0,
    mpg_avg: 0,
    engine_size_l: 0,
    hp: 0,
    manufacturer: '',
    model: '',
    transmission: '',
    drivetrain: '',
    fuel_type: '',
    exterior_color: '',
    accidents_or_damage: 0,
    one_owner: 0,
    personal_use_only: 0,
    danish_market: 0
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.has('year')) {
      const prefilledData: Partial<EstimationUserInput> = {}

      const year = urlParams.get('year')
      const mileage = urlParams.get('mileage')
      const mpg_avg = urlParams.get('mpg_avg')
      const engine_size_l = urlParams.get('engine_size_l')
      const hp = urlParams.get('hp')
      const manufacturer = urlParams.get('manufacturer')
      const model = urlParams.get('model')
      const transmission = urlParams.get('transmission')
      const drivetrain = urlParams.get('drivetrain')
      const fuel_type = urlParams.get('fuel_type')
      const exterior_color = urlParams.get('exterior_color')
      const accidents_or_damage = urlParams.get('accidents_or_damage')
      const one_owner = urlParams.get('one_owner')
      const personal_use_only = urlParams.get('personal_use_only')
      const danish_market = urlParams.get('danish_market')

      if (year) prefilledData.year = Number(year)
      if (mileage) prefilledData.mileage = Number(mileage)
      if (mpg_avg) prefilledData.mpg_avg = Number(mpg_avg)
      if (engine_size_l) prefilledData.engine_size_l = Number(engine_size_l)
      if (hp) prefilledData.hp = Number(hp)
      if (manufacturer) prefilledData.manufacturer = manufacturer
      if (model) prefilledData.model = model
      if (transmission) prefilledData.transmission = transmission
      if (drivetrain) prefilledData.drivetrain = drivetrain
      if (fuel_type) prefilledData.fuel_type = fuel_type
      if (exterior_color) prefilledData.exterior_color = exterior_color
      if (accidents_or_damage) prefilledData.accidents_or_damage = Number(accidents_or_damage)
      if (one_owner) prefilledData.one_owner = Number(one_owner)
      if (personal_use_only) prefilledData.personal_use_only = Number(personal_use_only)
      if (danish_market) prefilledData.danish_market = Number(danish_market)

      setFormData(prev => ({ ...prev, ...prefilledData }))
      if (prefilledData.manufacturer) {
        setManufacturerSearchTerm(capitalizeManufacturer(prefilledData.manufacturer))
      }
      if (prefilledData.model) {
        setModelSearchTerm(formatModel(prefilledData.model))
      }

      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      const response = await fetchWithAuth(`${API_BASE_URL}/ml/estimate`, {
        method: 'POST',
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

    const numericFields = ['engine_size_l', 'mpg_avg']

    setFormData(prev => {
      let processedValue: any = value

      if (type === 'checkbox') {
        processedValue = checked ? 1 : 0
      } else if (type === 'number' || numericFields.includes(name)) {
        processedValue = Number(value)
      }

      const newData = {
        ...prev,
        [name]: processedValue
      }

      if (name === 'manufacturer') {
        const availableModels = manufacturerToModels[value as string] || []
        const currentModel = prev.model

        if (value && currentModel && !availableModels.includes(currentModel)) {
          newData.model = ''
        }
      }

      if (name === 'model') {
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

    setManufacturerError('')
    setModelError('')
    setYearError('')

    let hasErrors = false
    if (!formData.manufacturer) {
      setManufacturerError('Please select a manufacturer from the dropdown list.')
      hasErrors = true
    }

    if (!formData.model) {
      setModelError('Please select a model from the dropdown list.')
      hasErrors = true
    }

    if (formData.year < 1980 || formData.year > 2026) {
      setYearError('Please enter a valid year between 1980 and 2026.')
      hasErrors = true
    }
    if (hasErrors) {
      return
    }

    setCurrentEstimationSaved(false)
    setSaveEstimationError(null)
    mutation.mutate(formData)
  }

  const handleSaveEstimation = async () => {
    if (mutation.data) {
      try {
        await saveEstimation(formData, mutation.data.data)
        setCurrentEstimationSaved(true)
        setSaveEstimationError(null)
      } catch (error) {
        setSaveEstimationError('Failed to save estimation. Please try again.')
      }
    }
  }

  const handleModelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setModelSearchTerm(value)
    setShowModelDropdown(value.length > 0)

    setModelError('')
    setFormData(prev => ({ ...prev, model: '' }))
  }

  const handleModelSelect = (selectedModel: string) => {
    setFormData(prev => ({ ...prev, model: selectedModel }))
    setModelSearchTerm(formatModel(selectedModel))
    setShowModelDropdown(false)
  }

  const handleManufacturerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setManufacturerSearchTerm(value)
    setShowManufacturerDropdown(value.length > 0)

    setManufacturerError('')
    setModelError('')

    setFormData(prev => ({ ...prev, manufacturer: '', model: '' }))
    setModelSearchTerm('')
  }

  const handleManufacturerSelect = (selectedManufacturer: string) => {
    setFormData(prev => ({ ...prev, manufacturer: selectedManufacturer, model: '' }))
    setManufacturerSearchTerm(capitalizeManufacturer(selectedManufacturer))
    setShowManufacturerDropdown(false)
    setModelSearchTerm('')
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const year = parseInt(value)

    setYearError('')
    setFormData(prev => ({ ...prev, year: year || 0 }))
    if (value && (!isNaN(year))) {
      if (year < 1980) {
        setYearError('Year must be 1980 or later')
      } else if (year > 2026) {
        setYearError('Year cannot be later than 2026')
      }
    }
  }

  const availableModels = formData.manufacturer && manufacturerToModels[formData.manufacturer]
    ? manufacturerToModels[formData.manufacturer]
    : modelInputDb.model.sort()

  const filteredModels = availableModels.filter(model =>
    formatModel(model).toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
    model.toLowerCase().includes(modelSearchTerm.toLowerCase())
  )
  const filteredManufacturers = modelInputDb.manufacturer.filter(manufacturer =>
    capitalizeManufacturer(manufacturer).toLowerCase().startsWith(manufacturerSearchTerm.toLowerCase()) ||
    manufacturer.toLowerCase().startsWith(manufacturerSearchTerm.toLowerCase())
  )

  return (
  <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Car Price Estimation</h1>
        <p className="text-slate-400">Get an AI-powered estimate for your vehicle's market value</p>
      </div>

      {user?.tier !== 'LIFETIME' && (
        <div className="mb-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
          <p className="text-slate-200 font-medium">Free plan includes 1 estimation total.</p>
          <p className="text-slate-400 text-sm mt-1">
            You can save your first estimation. Upgrade to Lifetime for unlimited estimations.
          </p>
          <button
            onClick={() => navigate({ to: '/pricing' })}
            className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors"
          >
            View pricing
          </button>
        </div>
      )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year Input */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
                <div className="relative">
                  <input
                    type="number"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleYearChange}
                    placeholder="e.g. 2020"
                    min="1980"
                    max="2026"
                    required
                    className={`w-full bg-slate-950 border rounded px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      yearError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : formData.year >= 1980 && formData.year <= 2026
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-slate-800 focus:ring-sky-500'
                    }`}
                  />
                  {/* Validation*/}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {yearError ? (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : formData.year >= 1980 && formData.year <= 2026 ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </div>
                </div>
                {yearError && <p className="text-red-400 text-sm mt-1">{yearError}</p>}
              </div>

              {/* Mileage Input */}
              <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    {formData.danish_market === 1 ? 'Mileage (km)' : 'Mileage (miles)'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage || ''}
                      onChange={handleChange}
                      placeholder={formData.danish_market === 1 ? 'e.g. 50000' : 'e.g. 30000'}
                      required
                      min="0"
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${formData.mileage > 0
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    />
                    {/* Validation */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {formData.mileage > 0 ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manufacturer Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Manufacturer</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="manufacturer"
                      value={manufacturerSearchTerm || (formData.manufacturer ? capitalizeManufacturer(formData.manufacturer) : '')}
                      onChange={handleManufacturerSearch}
                      onFocus={() => setShowManufacturerDropdown(true)}
                      onBlur={() => setTimeout(() => setShowManufacturerDropdown(false), 200)}
                      placeholder="Type to search manufacturers..."
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${manufacturerError
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.manufacturer
                            ? 'border-emerald-500 focus:ring-emerald-500'
                            : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    />
                    {/* Validation*/}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {manufacturerError ? (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : formData.manufacturer ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : manufacturerSearchTerm ? (
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : null}
                    </div>
                  </div>

                  {/* Dropdown with filtered results */}
                  {showManufacturerDropdown && filteredManufacturers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredManufacturers.slice(0, 10).map(manufacturer => (
                        <button
                          key={manufacturer}
                          type="button"
                          onClick={() => handleManufacturerSelect(manufacturer)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-100 border-b border-slate-800 last:border-b-0"
                        >
                          {capitalizeManufacturer(manufacturer)}
                        </button>
                      ))}
                      {filteredManufacturers.length > 10 && (
                        <div className="px-3 py-2 text-slate-400 text-sm">
                          {filteredManufacturers.length - 10} more results...
                        </div>
                      )}
                    </div>
                  )}
                  {manufacturerError && (
                    <p className="text-red-400 text-sm mt-1">{manufacturerError}</p>
                  )}
                </div>

                {/* Model Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Model</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="model"
                      value={modelSearchTerm || (formData.model ? formatModel(formData.model) : '')}
                      onChange={handleModelSearch}
                      onFocus={() => setShowModelDropdown(true)}
                      onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                      placeholder="Type to search models..."
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${modelError
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.model
                            ? 'border-emerald-500 focus:ring-emerald-500'
                            : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    />
                    {/* Validation */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {modelError ? (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : formData.model ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : modelSearchTerm ? (
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : null}
                    </div>
                  </div>

                  {/* Dropdown with filtered results */}
                  {showModelDropdown && filteredModels.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredModels.slice(0, 10).map(model => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => handleModelSelect(model)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-100 border-b border-slate-800 last:border-b-0"
                        >
                          {formatModel(model)}
                        </button>
                      ))}
                      {filteredModels.length > 10 && (
                        <div className="px-3 py-2 text-slate-400 text-sm">
                          {filteredModels.length - 10} more results...
                        </div>
                      )}
                    </div>
                  )}
                  {modelError && (
                    <p className="text-red-400 text-sm mt-1">{modelError}</p>
                  )}
                </div>

                {/* Engine Size Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Engine Size (L)</label>
                  <div className="relative">
                    <select
                      name="engine_size_l"
                      value={formData.engine_size_l || ''}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${formData.engine_size_l > 0
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    >
                      <option value="">Select Engine Size</option>
                      {modelInputDb.engine_size_l.sort().map(f => (
                        <option key={f} value={f}>{f}L</option>
                      ))}
                    </select>
                    {/* Validation */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.engine_size_l > 0 ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Fuel Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Fuel Type</label>
                  <div className="relative">
                    <select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${formData.fuel_type
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    >
                      <option value="">Select Fuel Type</option>
                      {modelInputDb.fuel_type.sort().map(f => (
                        <option key={f} value={f}>{formatFuelType(f)}</option>
                      ))}
                    </select>
                    {/* Validation */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.fuel_type ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Drivetrain Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Drivetrain</label>
                  <div className="relative">
                    <select
                      name="drivetrain"
                      value={formData.drivetrain}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${formData.drivetrain
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    >
                      <option value="">Select Drivetrain</option>
                      {modelInputDb.drivetrain.sort().map(d => (
                        <option key={d} value={d}>{formatDrivetrain(d)}</option>
                      ))}
                    </select>
                    {/* Validation */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.drivetrain ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Transmission Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Transmission</label>
                  <div className="relative">
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${formData.transmission
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    >
                      <option value="">Select Transmission</option>
                      {modelInputDb.transmission.sort().map(t => (
                        <option key={t} value={t}>{formatTransmission(t)}</option>
                      ))}
                    </select>
                    {/* Validation */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.transmission ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Color Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                  <div className="relative">
                    <select
                      name="exterior_color"
                      value={formData.exterior_color}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 ${formData.exterior_color
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    >
                      <option value="">Select Color</option>
                      {modelInputDb.exterior_color.sort().map(c => (
                        <option key={c} value={c}>{capitalizeColor(c)}</option>
                      ))}
                    </select>
                    {/* Validation */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {formData.exterior_color ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Horsepower Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Horsepower</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="hp"
                      value={formData.hp || ''}
                      onChange={handleChange}
                      placeholder="e.g. 250"
                      required
                      min="0"
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${formData.hp > 0
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    />
                    {/* Validation */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {formData.hp > 0 ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* MPG/Fuel Economy Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    {formData.danish_market === 1 ? 'Fuel Economy (km/l)' : 'MPG Average'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="mpg_avg"
                      value={formData.mpg_avg || ''}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.1"
                      placeholder={formData.danish_market === 1 ? "e.g. 12.5" : "e.g. 28.5"}
                      className={`w-full bg-slate-950 border rounded px-3 py-2 pr-10 text-slate-100 focus:outline-none focus:ring-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${formData.mpg_avg > 0
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-800 focus:ring-sky-500'
                        }`}
                    />
                    {/* Validation */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {formData.mpg_avg > 0 ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
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

            {/* AI Model Information */}
            <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-slate-200 mb-1">About Our AI Estimations</p>
                  <p className="mb-2">
                    Estimations are generated by an AI model trained on historical car sale data from the USA (2023).
                    For the most accurate results, we recommend using the <strong>US Market</strong> option.
                  </p>
                  <p className="text-xs text-amber-400 mb-2 leading-relaxed font-medium">
                    Note: Danish market pricing is still in development. These estimations are for guidance only and may not reflect actual Danish market values.
                  </p>
                  <p className="text-slate-400">
                    💡 <strong>Tip:</strong> If you can't find your exact option in the dropdown menus, select the closest available option or "Other" for better accuracy.
                  </p>
                </div>
              </div>
            </div>
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
                  <p><strong>Model:</strong> LightGBM Regressor</p>
                </div>

                {/* Save Estimation Button */}
                <button
                  onClick={handleSaveEstimation}
                  disabled={currentEstimationSaved}
                  className={`mt-4 w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${currentEstimationSaved
                      ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                >
                  {currentEstimationSaved ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Estimation
                    </>
                  )}
                </button>

                {saveEstimationError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-left">
                    <p className="font-bold">Error</p>
                    <p>{saveEstimationError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>Fill out the form to see the price estimation</p>
              </div>
            )}

            {mutation.isError && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                 <p className="font-bold">Error</p>
                 <p>{mutation.error.message}</p>
                 {mutation.error.message.includes('Free tier limit reached') && (
                   <button
                     onClick={() => navigate({ to: '/pricing' })}
                     className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors"
                   >
                     Upgrade to Lifetime
                   </button>
                 )}
                 <p className="text-xs mt-2 opacity-75">Ensure backend and ML service are running.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EstimationPage() {
  const { isLoggedIn, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginPrompt
        title="Login Required"
        message="You need to login to access the Price Estimation feature."
      />
    );
  }

  // Render the estimation form for authenticated users
  return <EstimationForm />;
}
