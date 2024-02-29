'use client'

import { filter, last, sum } from 'ramda'
import { ChartSettings, Milestone } from './chart-settings'
import { SeriesNames } from './constants'

type OtherKeys = 'saleNumber' | 'milestoneId'

export type SeriesData = Record<SeriesNames | OtherKeys, number>

export const exists = <T>(n?: T | null): n is T => Boolean(n)

export const calculateSeries = (settings: ChartSettings) => {
  // create a new array containing the integers from 1 to editionSize
  const newArray = Array.from({ length: settings.editionSize }, (_, i) => i + 1)

  const data = newArray.reduce<SeriesData[]>((acc, saleNumber) => {
    const previous = last(acc)
    const milestone = getMileStone(saleNumber, previous, settings)

    // Revenue is the sale price minus any discounts
    const revenue =
      settings.salePrice -
      settings.salePrice *
        sum(
          filter(exists, [
            milestone?.artistDiscount,
            milestone?.moncoeurDiscount,
            milestone?.sharedDiscount
          ])
        )

    const costComponent = calculateCostComponent(
      saleNumber,
      previous,
      settings,
      milestone
    )

    const grossMargin = revenue - costComponent

    const rawArtistShare = grossMargin * (milestone?.artistShare || 0)
    const rawMoncoeurShare = grossMargin * (milestone?.moncoeurShare || 0)

    const hasArtistDiscount = !!milestone?.artistDiscount
    const hasMoncoeurDiscount = !!milestone?.moncoeurDiscount

    // if the artist provided a discount, but moncoeur did not, we need to reduce the artist share by that amount and add it to the moncoeur share
    const artistDiscountComponent = hasArtistDiscount
      ? rawArtistShare * milestone.artistDiscount
      : 0
    // if moncoeur provided a discount, but the artist did not, we need to reduce the moncoeur share by that amount and add it to the artist share
    const moncoeurDiscountComponent = hasMoncoeurDiscount
      ? rawMoncoeurShare * milestone.moncoeurDiscount
      : 0

    const netArtistShare =
      rawArtistShare -
      artistDiscountComponent +
      (hasMoncoeurDiscount ? moncoeurDiscountComponent : 0)

    const netMoncoeurShare =
      rawMoncoeurShare -
      moncoeurDiscountComponent +
      (hasArtistDiscount ? artistDiscountComponent : 0)

    const costsRemaining = previous?.costsRemaining
      ? previous.costsRemaining - costComponent
      : settings.editionCosts

    const thedata = {
      saleNumber,
      costsRecovered: previous?.costsRecovered
        ? previous.costsRecovered + costComponent
        : costComponent,
      costsRemaining,
      revenue: previous?.revenue ? previous.revenue + revenue : revenue,
      artistShare: previous?.artistShare
        ? previous.artistShare + netArtistShare
        : netArtistShare,
      moncoeurShare: previous?.moncoeurShare
        ? previous.moncoeurShare + netMoncoeurShare
        : netMoncoeurShare,
      milestoneId: milestone?.milestoneNumber || 0
    }
    return [...acc, thedata]
  }, [])

  return data
}

function calculateCostComponent(
  saleNumber: number,
  previous: SeriesData | undefined,
  settings: ChartSettings,
  milestone?: Milestone
): number {
  // if we've already recouped all costs, we don't need to calculate anything
  if ((previous?.costsRecovered || 0) >= settings.editionCosts) {
    return 0
  }

  if (milestone?.basis === 'costs' && milestone.evenDistribution) {
    // we divide the costs up evenly across the remaining sales up to allCostsRecoupedBy
    const remainingCosts =
      settings.editionCosts - (previous?.costsRecovered || 0)
    const remainingSales = settings.allCostsRecoupedBy - saleNumber + 1
    return remainingCosts / remainingSales
  }

  // otherwise, we calculate the cost component based on the cost component of the milestone
  return settings.salePrice * (milestone?.costComponent || 0)
}

/**
 * gets the milestone that applies for this sale
 */
function getMileStone(
  saleNumber: number,
  previous: SeriesData | undefined,
  settings: ChartSettings
): Milestone | undefined {
  const { milestones } = settings
  const previousMilestoneId = previous?.milestoneId || 0
  const nextMilestoneId = previousMilestoneId + 1
  const nextMilestone = milestones.get(nextMilestoneId)

  if (!nextMilestone) {
    // There is no next milestone. The previous one applies.
    return milestones.get(previousMilestoneId)
  }

  if (nextMilestone.basis === 'sales') {
    if (
      typeof nextMilestone.basisTotal === 'number' &&
      saleNumber >= nextMilestone.basisTotal
    ) {
      return nextMilestone
    }
    if (
      typeof nextMilestone.basisPercentage === 'number' &&
      saleNumber / settings.editionSize >= nextMilestone.basisPercentage
    ) {
      return nextMilestone
    }
  }

  if (nextMilestone.basis === 'costs') {
    const costsRecouped = previous?.costsRecovered || 0
    if (nextMilestone.evenDistribution) {
      return nextMilestone
    }
    if (
      typeof nextMilestone.basisTotal === 'number' &&
      costsRecouped >= nextMilestone.basisTotal
    ) {
      return nextMilestone
    }
    if (
      typeof nextMilestone.basisPercentage === 'number' &&
      costsRecouped / settings.editionCosts >= nextMilestone.basisPercentage
    ) {
      return nextMilestone
    }
  }

  if (nextMilestone.basis === 'revenue') {
    const revenue = previous?.revenue || 0
    if (
      typeof nextMilestone.basisTotal === 'number' &&
      revenue >= nextMilestone.basisTotal
    ) {
      return nextMilestone
    }
    if (
      typeof nextMilestone.basisPercentage === 'number' &&
      revenue / (settings.salePrice * settings.editionSize) >=
        nextMilestone.basisPercentage
    ) {
      return nextMilestone
    }
  }

  // The next milestone has not been reached. The previous one applies.
  return milestones.get(previousMilestoneId)
}
