import { useParams } from '@tanstack/react-router'
import { PriceExplanationCard } from '../components/cardetail/PriceExplanationCard'
import { AIAdviceCard } from '../components/cardetail/AIAdviceCard'
import { CarSpecsGrid } from '../components/cardetail/CarSpecsGrid'
import { ImageGallery } from '../components/cardetail/ImageGallery'
import { useCar } from '../hooks/useCar'

export default function CarDetailPage() {
  const { carId } = useParams({ from: '/listing/$carId' })
  const { data, isLoading, isError, error } = useCar(parseInt(carId))

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
      <div className="container mx-auto px-4 py-4 text-sm text-slate-400">
        <span>Home</span> <span className="mx-2">/</span> <span>Browse</span> <span className="mx-2">/</span> <span className="text-slate-200">{carTitle}</span>
      </div>

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
            
            {/* Price Explanation */}
            <PriceExplanationCard />
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
              
              <a
                href={car.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-md mb-3 transition-colors shadow-lg shadow-sky-900/20 text-center"
              >
                View listing on {car.sources?.source || 'Source'}
              </a>
              
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
