import { useParams, useNavigate } from '@tanstack/react-router'
import { PriceExplanationCard } from '../components/cardetail/PriceExplanationCard'
import { AIAdviceCard } from '../components/cardetail/AIAdviceCard'
import { CarSpecsGrid } from '../components/cardetail/CarSpecsGrid'
import { ImageGallery } from '../components/cardetail/ImageGallery'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { useCar } from '../hooks/useCar'
import { useComparison } from '../contexts/ComparisonContext'

export default function CarDetailPage() {
  const { carId } = useParams({ from: '/listing/$carId' })
  const { data, isLoading, isError, error } = useCar(parseInt(carId))
  const { comparisonCars, addToComparison, removeFromComparison, isInComparison } = useComparison()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading car details...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Error loading car details</p>
          <p className="text-slate-500">{error instanceof Error ? error.message : 'Something went wrong'}</p>
        </div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Car not found</p>
      </div>
    )
  }

  const car = data.data
  const carTitle = `${car.model_year || ''} ${car.makes?.make || ''} ${car.models?.model || ''}`.trim() || 'Unknown Car'
  const images = car.car_images.map(img => img.image_url).filter(Boolean) as string[]
  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Browse', path: '/browse' },
          { label: carTitle },
        ]}
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Summary */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{carTitle}</h1>
                <div className="flex flex-wrap gap-2">
                  {car.body_types?.body_type && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {car.body_types.body_type}
                    </span>
                  )}
                  {car.fuel_types?.fuel_type && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {car.fuel_types.fuel_type}
                    </span>
                  )}
                  {car.transmission_types?.transmission_type && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {car.transmission_types.transmission_type}
                    </span>
                  )}
                  {car.listing_types?.listing_type && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {car.listing_types.listing_type}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-bold text-white mb-1">{car.price?.toLocaleString() || 'N/A'} DKK</div>
                {/* TODO: Add ML prediction badge */}
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={images.length > 0 ? images : ['https://via.placeholder.com/1600x900?text=No+Images']} />

            {/* Car Specs */}
            <CarSpecsGrid car={car} />
            
            {/* Price Explanation - Only show when estimated price exists */}
            {car.estimated_price && car.price && (
              <PriceExplanationCard 
                listingPrice={car.price} 
                estimatedPrice={car.estimated_price} 
              />
            )}
          </div>

          {/* Sidebar Content - Right Column */}
          <div className="space-y-6">
            {/* AI Est box - Only show if ML prediction data is available */}
            {/* TODO: Add ML prediction fields to CarDetail type and check for them here */}
            {false && (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-2">AI Fair Price Estimate</h3>
                <div className="text-2xl font-bold text-white mb-1">135,000 DKK</div>
                <div className="text-xs text-slate-500 mb-4">Range: 132,000 - 138,000 DKK</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Confidence</span>
                    <span className="text-emerald-400 font-medium">High</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[90%] rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Card */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Compare Cars</h3>
              
              {isInComparison(car.id) ? (
                <button
                  onClick={() => removeFromComparison(car.id)}
                  className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-md mb-3 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                    </svg>
                    Remove from Comparison
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => addToComparison(car)}
                  className="block w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-md mb-3 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                      <path d="M12 5v14"/>
                    </svg>
                    Add to Comparison
                  </div>
                </button>
              )}

              {comparisonCars.length >= 2 && (
                <button
                  onClick={() => navigate({ to: '/compare' })}
                  className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-md transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="7" height="9" x="3" y="3" rx="1"/>
                      <rect width="7" height="5" x="14" y="3" rx="1"/>
                      <rect width="7" height="9" x="14" y="12" rx="1"/>
                      <rect width="7" height="5" x="3" y="16" rx="1"/>
                    </svg>
                    View Comparison ({comparisonCars.length})
                  </div>
                </button>
              )}

              <p className="text-xs text-slate-500 text-center mt-3">
                {isInComparison(car.id) 
                  ? `${comparisonCars.length} car${comparisonCars.length !== 1 ? 's' : ''} in comparison` 
                  : comparisonCars.length > 0 
                    ? `${comparisonCars.length} car${comparisonCars.length !== 1 ? 's' : ''} already in comparison` 
                    : 'Add cars to compare side-by-side'}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Seller Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  D
                </div>
                <div>
                  <div className="font-medium text-white">Dansk Auto Import</div>
                  <div className="text-sm text-slate-400">Dealer</div>
                </div>
              </div>
              
              <div className="relative group mb-3">
                <span
                  className="block w-full bg-slate-800 text-slate-500 font-medium py-3 rounded-md transition-colors shadow-lg shadow-slate-950/20 text-center cursor-not-allowed select-none"
                  aria-disabled="true"
                  tabIndex={0}
                >
                  View listing on {car.sources?.source || 'Source'}
                </span>
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mt-[-10px] hidden group-hover:block group-focus-within:block z-20">
                  <div className="max-w-[340px] bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md shadow-xl px-3 py-2 text-center">
                    Demo version: external listing links are disabled (GDPR/legal).
                  </div>
                  <div className="mx-auto w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 text-center">
                Opens in a new tab. We do not handle payments.
              </p>
            </div>

            {/* AI Advice */}
            <AIAdviceCard />

            {/* Disclaimer */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <p className="text-xs text-slate-500 leading-relaxed">
                Car Trading Companion provides estimates based on available data. Always verify the condition of the car and all documents before purchasing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
