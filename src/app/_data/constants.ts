import { LineChartSeries } from '@mantine/charts'
import { SettingsListItem } from './persistence'
import { ChartSettings } from './chart-settings'

export const series = [
  {
    name: 'revenue',
    label: 'Revenue',
    color: 'indigo.4',
    strokeDasharray: '3 7'
  },
  {
    name: 'costsRemaining',
    label: 'Costs Remaining to Recoup',
    color: 'red.2'
  },
  { name: 'costsRecovered', label: 'Costs Recovered', color: 'red.1' },
  { name: 'companyShare', label: 'Moncoeur Share', color: 'orange.6' },
  { name: 'partnerShare', label: 'Artist Share', color: 'green.4' }
] satisfies LineChartSeries[]

export type SeriesNames = (typeof series)[number]['name']

export const dataKey = 'saleNumber'

const DEFAULT_MILESTONE = new Map([
  [
    0,
    {
      milestoneNumber: 0,
      label: 'First Sale',
      basis: 'sales',
      basisPercentage: 0,
      costComponent: 0.8,
      partnerShare: 0,
      companyShare: 1,
      sharedDiscount: 0,
      partnerDiscount: 0,
      companyDiscount: 0
    }
  ]
])

export const DEFAULT_NUM_ITEMS = 500
export const DEFAULT_SALE_PRICE = 30
export const DEFAULT_ITEM_KEY = 'default-item'

export const DEFAULT_SETTINGS = {
  listEntry: {
    value: DEFAULT_ITEM_KEY,
    label: 'Basic Settings',
    description: 'Default settings for the chart.'
  } satisfies SettingsListItem,
  settings: {
    numItemsToSell: DEFAULT_NUM_ITEMS,
    salePrice: DEFAULT_SALE_PRICE,
    editionCosts: DEFAULT_NUM_ITEMS * DEFAULT_SALE_PRICE * 0.2,
    allCostsRecoupedBy: DEFAULT_NUM_ITEMS,
    milestones: DEFAULT_MILESTONE
  } as ChartSettings
} as const
