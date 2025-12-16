export type PriceBadge = 'Underpriced' | 'Fairly priced' | 'Overpriced'

export function getPriceBadge(
  listingPrice: number | null | undefined,
  estimatedPrice: number | null | undefined,
  thresholdPercent: number = 5
): PriceBadge | undefined {
  if (listingPrice == null || estimatedPrice == null) return undefined
  if (!Number.isFinite(listingPrice) || !Number.isFinite(estimatedPrice)) return undefined
  if (listingPrice <= 0 || estimatedPrice <= 0) return undefined

  const diffRatio = (listingPrice - estimatedPrice) / estimatedPrice
  const thresholdRatio = thresholdPercent / 100

  if (Math.abs(diffRatio) <= thresholdRatio) return 'Fairly priced'
  if (diffRatio > thresholdRatio) return 'Overpriced'
  return 'Underpriced'
}
