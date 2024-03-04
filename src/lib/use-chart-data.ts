'use client'

import { filter, last, sum } from 'ramda'
import { ChartSettings, Milestone } from './chart-settings'
import { SeriesNames } from './constants'
import { isEvenDistributionPreviouslySet } from '@/Components/Controls/MilestoneSettings/milestoneTools'

type OtherKeys = 'saleNumber' | 'milestoneId'

export type SeriesData = Record<SeriesNames | OtherKeys, number>

export const exists = <T>(n?: T | null): n is T => Boolean(n)

export const calculateSeries = (settings: ChartSettings) => {
  // create a new array containing the integers from 1 to numItemsToSell
  const newArray = Array.from(
    { length: settings.numItemsToSell },
    (_, i) => i + 1
  )

  const data = newArray.reduce<SeriesData[]>((acc, saleNumber) => {
    const previous = last(acc)
    const milestone = getMileStone(saleNumber, previous, settings)

    if (!milestone) {
      return acc
    }

    // Revenue is the sale price minus any discounts
    const revenue =
      settings.salePrice -
      settings.salePrice *
        sum(
          filter(exists, [
            milestone?.partnerDiscount,
            milestone?.companyDiscount,
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

    const rawpartnerShare = grossMargin * (milestone?.partnerShare || 0)
    const rawcompanyShare = grossMargin * (milestone?.companyShare || 0)

    const haspartnerDiscount = !!milestone?.partnerDiscount
    const hascompanyDiscount = !!milestone?.companyDiscount

    // if the partner provided a discount, but the company did not, we need to reduce the partner share by that amount and add it to the company share
    const partnerDiscountComponent = haspartnerDiscount
      ? rawpartnerShare * milestone.partnerDiscount
      : 0
    // if the company provided a discount, but the partner did not, we need to reduce the company share by that amount and add it to the parner share
    const companyDiscountComponent = hascompanyDiscount
      ? rawcompanyShare * milestone.companyDiscount
      : 0

    const netpartnerShare =
      rawpartnerShare -
      partnerDiscountComponent +
      (hascompanyDiscount ? companyDiscountComponent : 0)

    const netcompanyShare =
      rawcompanyShare -
      companyDiscountComponent +
      (haspartnerDiscount ? partnerDiscountComponent : 0)

    const costsRemaining = previous?.costsRemaining
      ? previous.costsRemaining - costComponent
      : settings.totalProjectCosts

    const thedata = {
      saleNumber,
      costsRecovered: previous?.costsRecovered
        ? previous.costsRecovered + costComponent
        : costComponent,
      costsRemaining,
      revenue: previous?.revenue ? previous.revenue + revenue : revenue,
      partnerShare: previous?.partnerShare
        ? previous.partnerShare + netpartnerShare
        : netpartnerShare,
      companyShare: previous?.companyShare
        ? previous.companyShare + netcompanyShare
        : netcompanyShare,
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
  milestone: Milestone
): number {
  // if we've already recouped all costs, we don't need to calculate anything
  if ((previous?.costsRecovered || 0) >= settings.totalProjectCosts) {
    return 0
  }

  const useEvenDistribution =
    milestone.evenDistribution ||
    isEvenDistributionPreviouslySet(milestone, settings.milestones)

  if (useEvenDistribution) {
    // we divide the costs up evenly across the remaining sales up to allCostsRecoupedBy
    const remainingCosts =
      settings.totalProjectCosts - (previous?.costsRecovered || 0)
    const remainingSales = settings.allCostsRecoupedBy - saleNumber

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
  const nextMilestone = milestones[previousMilestoneId + 1]

  if (!nextMilestone) {
    // There is no next milestone. The previous one still applies.
    return milestones[previousMilestoneId]
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
      saleNumber / settings.numItemsToSell >= nextMilestone.basisPercentage
    ) {
      return nextMilestone
    }
  }

  if (nextMilestone.basis === 'costs') {
    const costsRecouped = previous?.costsRecovered || 0

    if (
      typeof nextMilestone.basisTotal === 'number' &&
      costsRecouped >= nextMilestone.basisTotal
    ) {
      return nextMilestone
    }
    if (
      typeof nextMilestone.basisPercentage === 'number' &&
      costsRecouped / settings.totalProjectCosts >=
        nextMilestone.basisPercentage
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
      revenue / (settings.salePrice * settings.numItemsToSell) >=
        nextMilestone.basisPercentage
    ) {
      return nextMilestone
    }
  }

  // The next milestone has not been reached. The previous one applies.
  return milestones[previousMilestoneId]
}
