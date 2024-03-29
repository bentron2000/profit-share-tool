'use client'
import type { ChartReferenceLineProps } from '@mantine/charts'
import { ChartSettings } from './chart-settings'
import { SeriesData, exists } from './use-chart-data'

const labelPosition: ChartReferenceLineProps['labelPosition'] = 'insideTopLeft'

export const milestonesToReferenceLines = (
  data: SeriesData[],
  settings: ChartSettings
): ChartReferenceLineProps[] => {
  const staticLines = [
    {
      y: settings.totalProjectCosts,
      label: 'break even',
      color: 'red.6',
      strokeDasharray: '3 3'
    } satisfies ChartReferenceLineProps
  ]
  const milestoneLines = Object.values(settings.milestones)
    .map(milestone => {
      // special case for starting milestone at index 0
      if (milestone.milestoneNumber === 0) {
        return {
          x: 1,
          label: milestone.label,
          color: 'blue.6',
          strokeDasharray: '3 3',
          labelPosition
        } satisfies ChartReferenceLineProps
      }

      if (milestone.basis === 'sales') {
        if (milestone.basisPercentage) {
          return {
            x: Math.round(milestone.basisPercentage * settings.numItemsToSell),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        } else if (milestone.basisTotal) {
          return {
            x: Math.round(milestone.basisTotal),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        }
      }
      if (milestone.basis === 'revenue') {
        if (milestone.basisPercentage) {
          // find the sale number that corresponds to this percentage of total revenue
          const totalRevenue = settings.salePrice * settings.numItemsToSell
          const revenueThreshold = milestone.basisPercentage * totalRevenue
          const saleNumber = revenueThreshold / settings.salePrice
          return {
            x: Math.round(saleNumber),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        } else if (milestone.basisTotal) {
          // find the sale number that corresponds to this total revenue
          const saleNumber = milestone.basisTotal / settings.salePrice
          return {
            x: Math.round(saleNumber),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        }
      }
      if (milestone.basis === 'costs') {
        if (milestone.basisPercentage) {
          // find the sale number that corresponds to this percentage of total costs
          const costsThreshold =
            milestone.basisPercentage * settings.totalProjectCosts
          const saleNumber =
            data.find(
              d => d?.costsRecovered && d?.costsRecovered >= costsThreshold
            )?.saleNumber || 0
          return {
            x: Math.round(saleNumber),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        } else if (milestone.basisTotal) {
          // find the sale number that corresponds to this total costs
          const saleNumber = milestone.basisTotal / settings.salePrice
          return {
            x: Math.round(saleNumber),
            label: milestone.label,
            color: 'blue.6',
            strokeDasharray: '3 3',
            labelPosition
          } satisfies ChartReferenceLineProps
        }
      }
    })
    .filter(exists)
  const lines = [...staticLines, ...milestoneLines]
  return lines
}
