import { useState, useEffect } from 'react'
import { FiltersSidebar } from '../components/browse/FiltersSidebar'
import { ListingCard, type ListingCardProps } from '../components/browse/ListingCard'
import modely from '../assets/modely.webp'
import id4 from '../assets/id4.webp'
import q8 from '../assets/q8.webp'
import corolla from '../assets/corolla.webp'
import fiesta from '../assets/fiesta.webp'
import bmw330 from '../assets/330.webp'
import cx5 from '../assets/cx5.webp'
import xc40 from '../assets/xc40.webp'

// Mock Data
const MOCK_LISTINGS: ListingCardProps[] = [
  {
    id: '1',
    title: '2019 Volkswagen Golf 1.5 TSI',
    price: 129900,
    fairPrice: 135000,
    image: id4, // Using ID4 as placeholder for Golf for now since we don't have Golf asset
    mileage: 65000,
    year: 2019,
    location: 'Copenhagen',
    transmission: 'Manual',
    fuel: 'Petrol',
    badge: 'Underpriced',
    confidence: 'High',
    source: 'Bilbasen'
  },
  {
    id: '2',
    title: '2020 Toyota Corolla Hybrid',
    price: 185000,
    fairPrice: 185000,
    image: corolla,
    mileage: 45000,
    year: 2020,
    location: 'Aarhus',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    badge: 'Fairly priced',
    confidence: 'Medium',
    source: 'DBA'
  },
  {
    id: '3',
    title: '2017 Audi Q8',
    price: 810000,
    fairPrice: 795000,
    image: q8,
    mileage: 98000,
    year: 2017,
    location: 'Odense',
    transmission: 'Automatic',
    fuel: 'Diesel',
    badge: 'Overpriced',
    confidence: 'High',
    source: 'Bilbasen'
  },
  {
    id: '4',
    title: '2021 Tesla Model Y Long Range',
    price: 359000,
    fairPrice: 365000,
    image: modely,
    mileage: 32000,
    year: 2021,
    location: 'Copenhagen',
    transmission: 'Automatic',
    fuel: 'Electric',
    badge: 'Fairly priced',
    confidence: 'High',
    source: 'Bilbasen'
  },
  {
    id: '5',
    title: '2018 Ford Fiesta ST-Line',
    price: 115000,
    fairPrice: 120000,
    image: fiesta,
    mileage: 55000,
    year: 2018,
    location: 'Aalborg',
    transmission: 'Manual',
    fuel: 'Petrol',
    badge: 'Underpriced',
    confidence: 'High',
    source: 'DBA'
  },
  {
    id: '6',
    title: '2022 BMW 330e Touring',
    price: 395000,
    fairPrice: 380000,
    image: bmw330,
    mileage: 15000,
    year: 2022,
    location: 'Copenhagen',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    badge: 'Overpriced',
    confidence: 'Medium',
    source: 'Bilbasen'
  },
  {
    id: '7',
    title: '2016 Mazda CX-5',
    price: 145000,
    fairPrice: 145000,
    image: cx5,
    mileage: 112000,
    year: 2016,
    location: 'Roskilde',
    transmission: 'Automatic',
    fuel: 'Petrol',
    badge: 'Fairly priced',
    confidence: 'Low',
    source: 'Bilbasen'
  },
  {
    id: '8',
    title: '2020 Volvo XC40',
    price: 310000,
    fairPrice: 325000,
    image: xc40,
    mileage: 42000,
    year: 2020,
    location: 'Esbjerg',
    transmission: 'Automatic',
    fuel: 'Diesel',
    badge: 'Underpriced',
    confidence: 'High',
    source: 'DBA'
  }
]

// Duplicate listings to fill the grid
const FULL_LISTINGS = [
  ...MOCK_LISTINGS,
  ...MOCK_LISTINGS.map(item => ({ ...item, id: (parseInt(item.id) + 8).toString() })),
  ...MOCK_LISTINGS.map(item => ({ ...item, id: (parseInt(item.id) + 16).toString() }))
]

export default function BrowsePage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 100) {
        setIsSearchBarVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsSearchBarVisible(false)
      } else {
        // Scrolling up
        setIsSearchBarVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      {/* Top Search Bar Area */}
      <div className={`bg-slate-900 border-b border-slate-800 sticky top-16 z-30 shadow-md transition-transform duration-300 ${isSearchBarVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
        <div className="container mx-auto px-4 py-4">
           <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
               <input 
                 type="text" 
                 placeholder="Search by make, model, or keywords..." 
                 className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
               />
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                 <circle cx="11" cy="11" r="8"/>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"/>
               </svg>
             </div>
             <div className="w-full md:w-48 relative">
               <input 
                 type="text" 
                 placeholder="Location (optional)" 
                 className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
               />
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                 <circle cx="12" cy="10" r="3"/>
               </svg>
             </div>
             <button className="md:w-auto w-full bg-sky-600 hover:bg-sky-500 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
               Search
             </button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 rounded-md border border-slate-700"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters Sidebar */}
          <aside className={`lg:w-80 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div 
              className={`sticky bg-slate-900 rounded-xl border border-slate-800 shadow-sm transition-[top,max-height] duration-300 ease-in-out flex flex-col overflow-hidden`}
              style={{ 
                top: isSearchBarVisible ? '10rem' : '5rem',
                maxHeight: isSearchBarVisible ? 'calc(100vh - 12rem)' : 'calc(100vh - 6rem)'
              }}
            >
              <div className="p-6 overflow-y-auto scrollbar-minimal flex-1">
                <h2 className="text-lg font-bold text-white mb-6">Filters</h2>
                <FiltersSidebar />
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
                <button className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md transition-colors shadow-lg shadow-sky-900/20">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Listings Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Browse used cars</h1>
                <p className="text-slate-400 text-sm">Found {FULL_LISTINGS.length} listings</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md py-2 px-3 focus:outline-none focus:border-sky-500">
                  <option>Best value (AI)</option>
                  <option>Lowest price</option>
                  <option>Highest price</option>
                  <option>Newest listings</option>
                  <option>Lowest mileage</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FULL_LISTINGS.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
            
            {/* Pagination / Load More */}
            <div className="mt-12 text-center">
              <button className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium px-8 py-3 rounded-md border border-slate-800 transition-colors">
                Load more cars
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
