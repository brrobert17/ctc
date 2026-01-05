import { useState, useEffect } from 'react'
import { FiltersSidebar } from '../components/browse/FiltersSidebar'
import { ListingCard, type ListingCardProps } from '../components/browse/ListingCard'
import { useCars } from '../hooks/useCars'
import { getPriceBadge } from '../utils/pricing'
import { useFilters } from '../context/FilterContext'
import type { Car } from '../types/car.types'

// Transform API car data to ListingCard props
function transformCarToListing(car: Car): ListingCardProps {
  return {
    id: String(car.id),
    title: `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim() || 'Unknown Car',
    price: car.price || 0,
    fairPrice: car.estimatedPrice || 0,
    image: car.image || 'https://via.placeholder.com/400x250?text=No+Image',
    mileage: car.mileage || 0,
    year: car.year || 0,
    location: car.location || 'Unknown',
    transmission: car.transmission || 'Unknown',
    fuel: car.fuelType || 'Unknown',
    badge: getPriceBadge(car.price, car.estimatedPrice, 5),
    confidence: 'Medium', // TODO: Get confidence from ML model
    source: car.source || 'Unknown',
    sourceUrl: car.url || '#',
  };
}

export default function BrowsePage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 24 // Number of cars per page
  
  // Get filter state from context
  const {
    priceFilter,
    setPriceFilter,
    yearFilter,
    setYearFilter,
    mileageFilter,
    setMileageFilter,
    selectedBodyTypes,
    setSelectedBodyTypes,
    selectedFuelTypes,
    setSelectedFuelTypes,
    selectedTransmissions,
    setSelectedTransmissions,
    searchQuery,
    setSearchQuery,
    appliedPriceFilter,
    appliedYearFilter,
    appliedMileageFilter,
    appliedBodyTypes,
    appliedFuelTypes,
    appliedTransmissions,
    appliedSearch,
    sortBy,
    setSortBy,
    applyFilters,
    resetFilters,
    hasAppliedFilters,
  } = useFilters()

  // Debounced search 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== appliedSearch) {
        applyFilters()
        setPage(1)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset to page 1 when sort changes
  useEffect(() => {
    setPage(1)
  }, [sortBy])

  // Fetch cars using React Query with filters
  const { data, isLoading, isError, error } = useCars({ 
    page, 
    limit,
    ...(appliedPriceFilter.minPrice > 0 && { minPrice: appliedPriceFilter.minPrice }),
    ...(appliedPriceFilter.maxPrice < 1000000 && { maxPrice: appliedPriceFilter.maxPrice }),
    ...(appliedYearFilter.minYear > 1990 && { minYear: appliedYearFilter.minYear }),
    ...(appliedYearFilter.maxYear < 2025 && { maxYear: appliedYearFilter.maxYear }),
    ...(appliedMileageFilter.minMileage > 0 && { minMileage: appliedMileageFilter.minMileage }),
    ...(appliedMileageFilter.maxMileage < 500000 && { maxMileage: appliedMileageFilter.maxMileage }),
    ...(appliedBodyTypes.length > 0 && { bodyTypes: appliedBodyTypes }),
    ...(appliedFuelTypes.length > 0 && { fuelTypes: appliedFuelTypes }),
    ...(appliedTransmissions.length > 0 && { transmissions: appliedTransmissions }),
    ...(appliedSearch.trim() && { search: appliedSearch.trim() }),
    ...(sortBy && { sortBy })
  })

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
           <div className="relative">
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search by make, model, or keywords..." 
               className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-md py-2.5 pl-10 pr-10 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
             />
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
               <circle cx="11" cy="11" r="8"/>
               <line x1="21" y1="21" x2="16.65" y2="16.65"/>
             </svg>
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="18" y1="6" x2="6" y2="18"/>
                   <line x1="6" y1="6" x2="18" y2="18"/>
                 </svg>
               </button>
             )}
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
                <FiltersSidebar 
                  priceFilter={priceFilter}
                  onPriceChange={setPriceFilter}
                  yearFilter={yearFilter}
                  onYearChange={setYearFilter}
                  mileageFilter={mileageFilter}
                  onMileageChange={setMileageFilter}
                  selectedBodyTypes={selectedBodyTypes}
                  onBodyTypesChange={setSelectedBodyTypes}
                  selectedFuelTypes={selectedFuelTypes}
                  onFuelTypesChange={setSelectedFuelTypes}
                  selectedTransmissions={selectedTransmissions}
                  onTransmissionsChange={setSelectedTransmissions}
                />
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0 space-y-2">
                <button 
                  onClick={() => {
                    applyFilters()
                    setPage(1) // Reset to first page when filters change
                  }}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md transition-colors shadow-lg shadow-sky-900/20"
                >
                  Apply Filters
                </button>
                {hasAppliedFilters && (
                  <button 
                    onClick={() => {
                      resetFilters()
                      setPage(1)
                    }}
                    className="w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-medium py-2 rounded-md transition-colors border border-red-600/50"
                  >
                    Remove Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Listings Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Browse used cars</h1>
                <p className="text-slate-400 text-sm">
                  {isLoading ? 'Loading...' : `Found ${data?.pagination.totalCount || 0} listings`}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md py-2 px-3 focus:outline-none focus:border-sky-500"
                >
                  <option value="">Estimated Cars (AI)</option>
                  <option value="price_asc">Lowest price</option>
                  <option value="price_desc">Highest price</option>
                  <option value="mileage_asc">Lowest mileage</option>
                  <option value="mileage_desc">Highest mileage</option>
                  <option value="year_desc">Newest year</option>
                  <option value="year_asc">Oldest year</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {isError && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 rounded-lg p-4 mb-6">
                <p className="font-medium">Error loading cars</p>
                <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Something went wrong'}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[16/10] bg-slate-800" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="h-8 bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Listings Grid */}
            {!isLoading && !isError && data && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.data.map((car) => (
                    <ListingCard key={car.id} {...transformCarToListing(car)} />
                  ))}
                </div>
                
                {/* Empty State */}
                {data.data.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400">No cars found</p>
                  </div>
                )}

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!data.pagination.hasPreviousPage}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium px-6 py-3 rounded-md border border-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-slate-400">
                      Page {data.pagination.page} of {data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium px-6 py-3 rounded-md border border-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
