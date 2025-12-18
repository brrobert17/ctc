import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CarDetail } from '../types/car.types'

interface ComparisonContextType {
  comparisonCars: CarDetail[]
  addToComparison: (car: CarDetail) => void
  removeFromComparison: (carId: number) => void
  isInComparison: (carId: number) => boolean
  clearComparison: () => void
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const STORAGE_KEY = 'car-comparison-list'
const MAX_COMPARISON_CARS = 5

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonCars, setComparisonCars] = useState<CarDetail[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading comparison data from localStorage:', error)
      return []
    }
  })

  // Sync to localStorage whenever comparisonCars changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonCars))
    } catch (error) {
      console.error('Error saving comparison data to localStorage:', error)
    }
  }, [comparisonCars])

  const addToComparison = (car: CarDetail) => {
    setComparisonCars((prev) => {
      // Check if already in comparison
      if (prev.some((c) => c.id === car.id)) {
        return prev
      }
      // Limit to MAX_COMPARISON_CARS
      if (prev.length >= MAX_COMPARISON_CARS) {
        // Remove the oldest car and add the new one
        return [...prev.slice(1), car]
      }
      return [...prev, car]
    })
  }

  const removeFromComparison = (carId: number) => {
    setComparisonCars((prev) => prev.filter((car) => car.id !== carId))
  }

  const isInComparison = (carId: number) => {
    return comparisonCars.some((car) => car.id === carId)
  }

  const clearComparison = () => {
    setComparisonCars([])
  }

  return (
    <ComparisonContext.Provider
      value={{
        comparisonCars,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
