import { LineChartSeries } from '@mantine/charts'
import { ChartSettings, Milestone } from './chart-settings'
import { prop } from 'ramda'

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
  { name: 'companyShare', label: 'Company Share', color: 'orange.6' },
  { name: 'partnerShare', label: 'Partner Share', color: 'green.4' }
] satisfies LineChartSeries[]

export type SeriesNames = (typeof series)[number]['name']

export const dataKey = 'saleNumber'

export const DEFAULT_MILESTONE = {
  0: {
    milestoneNumber: 0,
    label: 'Starting Milestone',
    basis: 'sales',
    basisTotal: 0,
    costComponent: 1,
    partnerShare: 0,
    companyShare: 1,
    sharedDiscount: 0,
    partnerDiscount: 0,
    companyDiscount: 0
  } satisfies Milestone
}

export const DEFAULT_NUM_ITEMS = 500
export const DEFAULT_SALE_PRICE = 30
export const DEFAULT_ITEM_KEY = 'default-item'
export const DEFAULT_DISPLAY_DATA = series.map(prop('name'))

export const DEFAULT_SETTINGS = {
  id: DEFAULT_ITEM_KEY,
  name: 'Basic Settings',
  description: 'Default settings for the chart.',
  numItemsToSell: DEFAULT_NUM_ITEMS,
  salePrice: DEFAULT_SALE_PRICE,
  totalProjectCosts: DEFAULT_NUM_ITEMS * DEFAULT_SALE_PRICE * 0.2,
  allCostsRecoupedBy: DEFAULT_NUM_ITEMS,
  milestones: DEFAULT_MILESTONE,
  dataToDisplay: DEFAULT_DISPLAY_DATA
} satisfies Partial<ChartSettings>
