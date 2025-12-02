import { Link } from '@tanstack/react-router'
import modely from '../../assets/modely.webp'
import id4 from '../../assets/id4.webp'
import elroq from '../../assets/elroq.webp'

const HERO_CARS = [
  {
    id: 1,
    image: modely,
    title: '2023 Tesla Model Y',
    subtitle: 'Long Range AWD',
    price: '359,900 DKK',
    badge: 'Fairly priced',
    badgeColor: 'bg-sky-500',
    confidence: 'High',
    confidenceColor: 'bg-emerald-500',
    confidenceText: 'text-emerald-400',
    featured: true
  },
  {
    id: 2,
    image: id4,
    title: '2021 VW ID.4',
    subtitle: '1st Edition',
    price: '249,900 DKK',
    badge: 'Underpriced',
    badgeColor: 'bg-emerald-500',
    confidence: 'High',
    confidenceColor: 'bg-emerald-500',
    confidenceText: 'text-emerald-400',
    featured: false
  },
  {
    id: 3,
    image: elroq,
    title: '2024 Skoda Elroq',
    subtitle: 'Sportline',
    price: '299,900 DKK',
    badge: 'Overpriced',
    badgeColor: 'bg-red-500',
    confidence: 'High',
    confidenceColor: 'bg-emerald-500',
    confidenceText: 'text-emerald-400',
    featured: false
  }
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl mb-6">
              Check if a used car is <span className="text-sky-400">fairly priced</span>
            </h1>
            <p className="max-w-lg text-lg text-slate-400 mb-8">
              Car Trading Companion aggregates listings from sites like Bilbasen and DBA and uses AI to highlight good-value cars for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/browse" 
                className="inline-flex items-center justify-center rounded-md bg-sky-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-sky-900/20 hover:bg-sky-500 transition-colors"
              >
                Browse used cars
              </Link>
              <button 
                onClick={() => document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-8 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                How it works
              </button>
            </div>
            
            {/* Quick Search Placeholder - logic will be in a separate component if complex, but simple here for layout */}
            <div className="mt-12 pt-8 border-t border-slate-800">
               <div className="flex flex-col sm:flex-row gap-3">
                 <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                   <option>Select Make</option>
                   <option>Volkswagen</option>
                   <option>Ford</option>
                   <option>BMW</option>
                 </select>
                 <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                   <option>Select Model</option>
                 </select>
                 <button className="bg-slate-800 text-sky-400 font-medium px-6 py-2 rounded-md hover:bg-slate-700 transition-colors whitespace-nowrap">
                   Search
                 </button>
               </div>
            </div>
          </div>

          {/* Right Hero Visual - Bento Grid 3 items */}
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HERO_CARS.map((car) => (
                <div 
                  key={car.id} 
                  className={`relative rounded-xl bg-slate-800 p-2.5 shadow-xl shadow-black/20 border border-slate-700 hover:border-slate-600 transition-colors group cursor-default ${car.featured ? 'sm:col-span-2' : ''}`}
                >
                  {/* Image */}
                  <div className={`${car.featured ? 'aspect-[2.5/1]' : 'aspect-[16/9]'} rounded-lg bg-slate-700 mb-2 relative overflow-hidden`}>
                     <img src={car.image} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className={`absolute top-2 right-2 ${car.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm`}>
                       {car.badge}
                     </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">{car.title}</h3>
                        <p className="text-xs text-slate-400">{car.subtitle}</p>
                      </div>
                      {car.featured && (
                         <div className="text-base font-bold text-white">{car.price}</div>
                      )}
                    </div>
                    
                    {!car.featured && (
                       <div className="text-base font-bold text-white">{car.price}</div>
                    )}
                    
                    {/* AI Confidence Bar */}
                    <div className="pt-1.5 border-t border-slate-700/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-slate-500">AI Confidence</span>
                        <span className={`text-[10px] font-medium ${car.confidenceText}`}>{car.confidence}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full w-[85%] rounded-full ${car.confidenceColor}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Decorative Elements behind grid */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-500/5 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
