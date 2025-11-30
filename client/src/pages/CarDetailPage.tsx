import { PriceExplanationCard } from '../components/cardetail/PriceExplanationCard'
import { AIAdviceCard } from '../components/cardetail/AIAdviceCard'
import { CarSpecsGrid } from '../components/cardetail/CarSpecsGrid'
import { ImageGallery } from '../components/cardetail/ImageGallery'

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1580273916550-e323be2ed5f6?auto=format&fit=crop&w=1600&q=80",
]

export default function CarDetailPage() {
  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      {/* Breadcrumb Mock */}
      <div className="container mx-auto px-4 py-4 text-sm text-slate-400">
        <span>Home</span> <span className="mx-2">/</span> <span>Browse</span> <span className="mx-2">/</span> <span className="text-slate-200">2019 Volkswagen Golf</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Summary */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">2019 Volkswagen Golf 1.5 TSI</h1>
                <div className="flex flex-wrap gap-2">
                   <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">Hatchback</span>
                   <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">Petrol</span>
                   <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">Manual</span>
                   <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">Dealer</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-bold text-white mb-1">129,900 DKK</div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-400 text-sm font-medium">Underpriced</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={MOCK_IMAGES} />

            {/* Car Specs */}
            <CarSpecsGrid />
            
            {/* Price Explanation */}
            <PriceExplanationCard />
          </div>

          {/* Sidebar Content - Right Column */}
          <div className="space-y-6">
            {/* AI Est box */}
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
              
              <button className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-md mb-3 transition-colors shadow-lg shadow-sky-900/20">
                View listing on Bilbasen
              </button>
              
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
