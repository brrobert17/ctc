import { useState } from 'react'
import { getPriceBadge, type PriceBadge } from '../../utils/pricing'

interface PriceExplanationCardProps {
  listingPrice: number
  estimatedPrice: number
}

export function PriceExplanationCard({ listingPrice, estimatedPrice }: PriceExplanationCardProps) {
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const badge = getPriceBadge(listingPrice, estimatedPrice, 5)
  const difference = listingPrice - estimatedPrice
  const absDifference = Math.abs(difference)
  const percentDiff = Math.abs((difference / estimatedPrice) * 100).toFixed(1)

  const badgeConfig: Record<PriceBadge, { color: string; bgColor: string; message: string }> = {
    'Underpriced': {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500',
      message: `This car is listed for ${listingPrice.toLocaleString()} DKK, which is approximately ${absDifference.toLocaleString()} DKK (${percentDiff}%) below our estimated fair market value.`
    },
    'Fairly priced': {
      color: 'text-sky-400',
      bgColor: 'bg-sky-500',
      message: `This car is listed for ${listingPrice.toLocaleString()} DKK, which is within ${percentDiff}% of our estimated fair market value of ${estimatedPrice.toLocaleString()} DKK.`
    },
    'Overpriced': {
      color: 'text-red-400',
      bgColor: 'bg-red-500',
      message: `This car is listed for ${listingPrice.toLocaleString()} DKK, which is approximately ${absDifference.toLocaleString()} DKK (${percentDiff}%) above our estimated fair market value.`
    }
  }

  const config = badge ? badgeConfig[badge] : badgeConfig['Fairly priced']

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        Price Analysis: <span className={config.color}>{badge || 'Fairly priced'}</span>
      </h3>

      <p className="text-slate-400 mb-6">{config.message}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">Listing Price</span>
          <span className="text-white font-medium">{listingPrice.toLocaleString()} DKK</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">AI Estimated Value</span>
          <span className="text-white font-medium">{estimatedPrice.toLocaleString()} DKK</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-sm">Difference</span>
          <span className={`font-medium ${config.color}`}>
            {difference > 0 ? '+' : ''}{difference.toLocaleString()} DKK ({percentDiff}%)
          </span>
        </div>

        <div className="pt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Underpriced</span>
            <span>Fair</span>
            <span>Overpriced</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-emerald-500/30 rounded-l-full"></div>
              <div className="w-1/3 bg-sky-500/30"></div>
              <div className="w-1/3 bg-red-500/30 rounded-r-full"></div>
            </div>
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ${config.bgColor}`}
              style={{
                left: `${Math.min(Math.max(((difference / estimatedPrice) * 100 + 15) / 30 * 100, 2), 98)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center relative">
        <button
          onClick={() => setShowInfoPopup(!showInfoPopup)}
          className="text-sky-400 text-sm hover:text-sky-300 font-medium underline underline-offset-4 decoration-sky-400/30 hover:decoration-sky-300"
        >
          Learn more about how our price estimation works
        </button>

        {showInfoPopup && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl z-10">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-white mb-2">How We Estimate Prices</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use a Machine Learning model trained on US used car sales data to estimate fair market values.
                </p>
                <p className="text-xs text-amber-400 mt-2 leading-relaxed font-medium">
                  Note: Danish market pricing is still in development. These estimates are for guidance only and may not reflect actual Danish market values.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="border-8 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
