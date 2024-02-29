import { LineChartSeries } from '@mantine/charts'

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
  { name: 'moncoeurShare', label: 'Moncoeur Share', color: 'orange.6' },
  { name: 'artistShare', label: 'Artist Share', color: 'green.4' }
] satisfies LineChartSeries[]

export type SeriesNames = (typeof series)[number]['name']

export const dataKey = 'saleNumber'
