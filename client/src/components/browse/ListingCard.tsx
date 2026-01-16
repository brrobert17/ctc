import { Link } from '@tanstack/react-router'

export interface ListingCardProps {
  id: string
  title: string
  price: number
  fairPrice: number
  image: string
  mileage: number
  year: number
  location: string
  transmission: string
  fuel: string
  badge?: 'Underpriced' | 'Fairly priced' | 'Overpriced'
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  sourceUrl?: string
}

export function ListingCard({ 
  id, title, price, fairPrice, image, mileage, year, location, transmission, fuel, badge, confidence, source, sourceUrl
}: ListingCardProps) {
  
  const badgeColors = {
    'Underpriced': 'bg-emerald-500 text-white',
    'Fairly priced': 'bg-sky-500 text-white',
    'Overpriced': 'bg-red-500 text-white'
  }

  const confidenceColors = {
    'High': 'bg-emerald-500',
    'Medium': 'bg-amber-500',
    'Low': 'bg-red-500'
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Area */}
      <Link 
        to="/listing/$carId" 
        params={{ carId: id }} 
        className="aspect-[16/10] w-full overflow-hidden bg-slate-800 relative block"
      >
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" 
          style={{ objectPosition: '50% 80%' }}
        />
        {badge && (
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded shadow-sm ${badgeColors[badge]}`}>
            {badge}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 pt-12">
          <div className="flex justify-between items-end">
            <div className="text-white font-bold text-lg">{price.toLocaleString()} DKK</div>
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-3 space-y-3">
        <div>
          <Link to="/listing/$carId" params={{ carId: id }}>
            <h3 className="text-base font-bold text-white line-clamp-1 hover:text-sky-400 transition-colors">{title}</h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1">{year} • {transmission} • {fuel}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {mileage.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </div>
        </div>

        <div className="mt-auto flex gap-3 pt-2">
          <Link 
            to="/listing/$carId"
            params={{ carId: id }}
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-center py-2 rounded-md text-sm font-medium transition-colors"
          >
            View details
          </Link>
          <a 
            href={sourceUrl || '#'} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-md text-sm font-medium transition-colors"
          >
            {source}
          </a>
        </div>
      </div>
    </div>
  )
}
