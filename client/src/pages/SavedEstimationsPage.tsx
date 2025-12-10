import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LoginPrompt } from '../components/auth/LoginPrompt'
import { getSavedEstimations, deleteSavedEstimation } from '../utils/auth'
import { capitalizeManufacturer, formatDrivetrain, formatTransmission, capitalizeColor, formatFuelType, formatModel } from '../utils/estimateInputDisplayformatting'

interface SavedEstimation {
  id: string
  createdAt: string
  year: number
  mileage: number
  mpg_avg: number
  engine_size_l: number
  hp: number
  manufacturer: string
  model: string
  transmission: string
  drivetrain: string
  fuel_type: string
  exterior_color: string
  accidents_or_damage: number
  one_owner: number
  personal_use_only: number
  danish_market: number
  predicted_price: number
  currency: string
  original_price_usd?: number
}

export default function SavedEstimationsPage() {
  const { isLoggedIn, isLoading } = useAuth()
  const [estimations, setEstimations] = useState<SavedEstimation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch saved estimations
  useEffect(() => {
    const fetchEstimations = async () => {
      try {
        setLoading(true)
        const response = await getSavedEstimations()
        setEstimations(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch estimations:', err)
        setError('Failed to load saved estimations')
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) {
      fetchEstimations()
    }
  }, [isLoggedIn])

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
        message="You need to login to view your saved estimations."
      />
    );
  }

  const handleDelete = async (estimationId: string) => {
    if (!confirm('Are you sure you want to delete this estimation?')) {
      return
    }

    try {
      await deleteSavedEstimation(estimationId)
      setEstimations(prev => prev.filter(est => est.id !== estimationId))
    } catch (err) {
      console.error('Failed to delete estimation:', err)
      alert('Failed to delete estimation. Please try again.')
    }
  }

  const handleReEstimate = (estimation: SavedEstimation) => {
    // Create the form data object from the saved estimation
    const formData = {
      year: estimation.year,
      mileage: estimation.mileage,
      mpg_avg: estimation.mpg_avg,
      engine_size_l: estimation.engine_size_l,
      hp: estimation.hp,
      manufacturer: estimation.manufacturer,
      model: estimation.model,
      transmission: estimation.transmission,
      drivetrain: estimation.drivetrain,
      fuel_type: estimation.fuel_type,
      exterior_color: estimation.exterior_color,
      accidents_or_damage: estimation.accidents_or_damage,
      one_owner: estimation.one_owner,
      personal_use_only: estimation.personal_use_only,
      danish_market: estimation.danish_market
    }

    // Navigate to estimation page with the form data as URL params
    const searchParams = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
    
    console.log('Navigating with params:', searchParams.toString())
    
    // Use window.location to ensure URL params are properly set
    window.location.href = `/estimate?${searchParams.toString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number, danishMarket: number) => {
    if (danishMarket === 1) {
      return `${price.toLocaleString('da-DK')} DKK`
    } else {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Estimations</h1>
          <p className="text-slate-400">View and manage your saved car price estimations.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <span className="ml-3 text-slate-400">Loading estimations...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && estimations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No saved estimations</h3>
            <p className="text-slate-400 mb-4">You haven't saved any price estimations yet.</p>
            <a 
              href="/estimate" 
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
            >
              Get Price Estimation
            </a>
          </div>
        )}

        {/* Estimations Grid */}
        {!loading && !error && estimations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {estimations.map((estimation) => (
              <div key={estimation.id} className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
                {/* Car Info Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {estimation.year} {capitalizeManufacturer(estimation.manufacturer)} {formatModel(estimation.model)}
                    </h3>
                    {/* Market Flag - Inline with model name */}
                    {estimation.danish_market === 1 ? (
                      <img
                        src="https://flagcdn.com/w20/dk.png"
                        srcSet="https://flagcdn.com/w40/dk.png 2x"
                        width="20"
                        alt="Denmark"
                        className="rounded shadow-sm ml-2"
                        title="Danish Market"
                      />
                    ) : (
                      <img
                        src="https://flagcdn.com/w20/us.png"
                        srcSet="https://flagcdn.com/w40/us.png 2x"
                        width="20"
                        alt="United States"
                        className="rounded shadow-sm ml-2"
                        title="US Market"
                      />
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    Saved on {formatDate(estimation.createdAt)}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Estimated Price</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatPrice(estimation.predicted_price, estimation.danish_market)}
                  </p>
                </div>

                {/* Car Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mileage:</span>
                    <span className="text-white">
                      {estimation.mileage.toLocaleString()} {estimation.danish_market === 1 ? 'km' : 'miles'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transmission:</span>
                    <span className="text-white">{formatTransmission(estimation.transmission)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drivetrain:</span>
                    <span className="text-white">{formatDrivetrain(estimation.drivetrain)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Type:</span>
                    <span className="text-white">{formatFuelType(estimation.fuel_type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Color:</span>
                    <span className="text-white">{capitalizeColor(estimation.exterior_color)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market:</span>
                    <span className="text-white">
                      {estimation.danish_market === 1 ? 'Danish' : 'US'} Market
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReEstimate(estimation)}
                    className="flex-1 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-estimate
                  </button>
                  <button
                    onClick={() => handleDelete(estimation.id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
