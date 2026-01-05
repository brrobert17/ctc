import { createContext, useContext, useState, type ReactNode } from 'react'

// Filter types
export interface PriceFilter {
  minPrice: number
  maxPrice: number
}

export interface YearFilter {
  minYear: number
  maxYear: number
}

export interface MileageFilter {
  minMileage: number
  maxMileage: number
}

// Default filter values
export type SortOption = 'price_asc' | 'price_desc' | 'mileage_asc' | 'mileage_desc' | 'year_asc' | 'year_desc' | '';

export const DEFAULT_FILTERS = {
  price: { minPrice: 0, maxPrice: 1000000 } as PriceFilter,
  year: { minYear: 1990, maxYear: 2025 } as YearFilter,
  mileage: { minMileage: 0, maxMileage: 500000 } as MileageFilter,
  bodyTypes: [] as string[],
  fuelTypes: [] as string[],
  transmissions: [] as string[],
  search: '',
  sortBy: '' as SortOption,
}

interface FilterContextType {
  // Current filter values 
  priceFilter: PriceFilter
  setPriceFilter: (filter: PriceFilter) => void
  yearFilter: YearFilter
  setYearFilter: (filter: YearFilter) => void
  mileageFilter: MileageFilter
  setMileageFilter: (filter: MileageFilter) => void
  selectedBodyTypes: string[]
  setSelectedBodyTypes: (types: string[]) => void
  selectedFuelTypes: string[]
  setSelectedFuelTypes: (types: string[]) => void
  selectedTransmissions: string[]
  setSelectedTransmissions: (types: string[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  
  appliedPriceFilter: PriceFilter
  appliedYearFilter: YearFilter
  appliedMileageFilter: MileageFilter
  appliedBodyTypes: string[]
  appliedFuelTypes: string[]
  appliedTransmissions: string[]
  appliedSearch: string
  appliedSortBy: SortOption
  
  applyFilters: () => void
  resetFilters: () => void
  hasAppliedFilters: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  // Current filter values
  const [priceFilter, setPriceFilter] = useState<PriceFilter>(DEFAULT_FILTERS.price)
  const [yearFilter, setYearFilter] = useState<YearFilter>(DEFAULT_FILTERS.year)
  const [mileageFilter, setMileageFilter] = useState<MileageFilter>(DEFAULT_FILTERS.mileage)
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(DEFAULT_FILTERS.bodyTypes)
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(DEFAULT_FILTERS.fuelTypes)
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(DEFAULT_FILTERS.transmissions)
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_FILTERS.search)
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_FILTERS.sortBy)
  
  const [appliedPriceFilter, setAppliedPriceFilter] = useState<PriceFilter>(DEFAULT_FILTERS.price)
  const [appliedYearFilter, setAppliedYearFilter] = useState<YearFilter>(DEFAULT_FILTERS.year)
  const [appliedMileageFilter, setAppliedMileageFilter] = useState<MileageFilter>(DEFAULT_FILTERS.mileage)
  const [appliedBodyTypes, setAppliedBodyTypes] = useState<string[]>(DEFAULT_FILTERS.bodyTypes)
  const [appliedFuelTypes, setAppliedFuelTypes] = useState<string[]>(DEFAULT_FILTERS.fuelTypes)
  const [appliedTransmissions, setAppliedTransmissions] = useState<string[]>(DEFAULT_FILTERS.transmissions)
  const [appliedSearch, setAppliedSearch] = useState<string>(DEFAULT_FILTERS.search)
  const [appliedSortBy, setAppliedSortBy] = useState<SortOption>(DEFAULT_FILTERS.sortBy)

  const hasAppliedFilters = 
    appliedPriceFilter.minPrice > 0 ||
    appliedPriceFilter.maxPrice < 1000000 ||
    appliedYearFilter.minYear > 1990 ||
    appliedYearFilter.maxYear < 2025 ||
    appliedMileageFilter.minMileage > 0 ||
    appliedMileageFilter.maxMileage < 500000 ||
    appliedBodyTypes.length > 0 ||
    appliedFuelTypes.length > 0 ||
    appliedTransmissions.length > 0 ||
    appliedSearch.trim().length > 0

  const applyFilters = () => {
    setAppliedPriceFilter(priceFilter)
    setAppliedYearFilter(yearFilter)
    setAppliedMileageFilter(mileageFilter)
    setAppliedBodyTypes(selectedBodyTypes)
    setAppliedFuelTypes(selectedFuelTypes)
    setAppliedTransmissions(selectedTransmissions)
    setAppliedSearch(searchQuery)
    setAppliedSortBy(sortBy)
  }

  const resetFilters = () => {
    setPriceFilter(DEFAULT_FILTERS.price)
    setYearFilter(DEFAULT_FILTERS.year)
    setMileageFilter(DEFAULT_FILTERS.mileage)
    setSelectedBodyTypes(DEFAULT_FILTERS.bodyTypes)
    setSelectedFuelTypes(DEFAULT_FILTERS.fuelTypes)
    setSelectedTransmissions(DEFAULT_FILTERS.transmissions)
    setSearchQuery(DEFAULT_FILTERS.search)
    setAppliedPriceFilter(DEFAULT_FILTERS.price)
    setAppliedYearFilter(DEFAULT_FILTERS.year)
    setAppliedMileageFilter(DEFAULT_FILTERS.mileage)
    setAppliedBodyTypes(DEFAULT_FILTERS.bodyTypes)
    setAppliedFuelTypes(DEFAULT_FILTERS.fuelTypes)
    setAppliedTransmissions(DEFAULT_FILTERS.transmissions)
    setAppliedSearch(DEFAULT_FILTERS.search)
    setAppliedSortBy(DEFAULT_FILTERS.sortBy)
  }

  return (
    <FilterContext.Provider value={{
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
      sortBy,
      setSortBy,
      appliedPriceFilter,
      appliedYearFilter,
      appliedMileageFilter,
      appliedBodyTypes,
      appliedFuelTypes,
      appliedTransmissions,
      appliedSearch,
      appliedSortBy,
      applyFilters,
      resetFilters,
      hasAppliedFilters,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
