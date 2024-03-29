'use client'
import { LineChart } from '@mantine/charts'
import { useMemo } from 'react'
import { calculateSeries } from '../../lib/use-chart-data'
import { unstable_noStore as noStore } from 'next/cache'
import { chartSettings } from '../../lib/chart-settings'
import { dataKey, series } from '../../lib/constants'
import { milestonesToReferenceLines } from '../../lib/reference-lines'
import { ChartSettings } from '@/Components/ChartSettings'
import { ResultInfo } from '@/Components/ResultInfo'
import { ResponsiveContainer } from 'recharts'

export default function ChartPage() {
  noStore()

  const settings = chartSettings()

  const data = useMemo(() => calculateSeries(settings), [settings])

  const referenceLines = useMemo(
    () => milestonesToReferenceLines(data, settings),
    [data, settings]
  )

  return (
    <div className='p-3'>
      <ChartSettings />
      <div className='flex w-4/5 flex-col gap-8 p-2'>
        <ResponsiveContainer height={'75vh'}>
          <LineChart
            data={data}
            dataKey={dataKey}
            withLegend
            series={series.filter(item =>
              settings.dataToDisplay.includes(item.name)
            )}
            dotProps={{ r: 0 }}
            yAxisProps={{ domain: [0, 'dataMax'] }}
            referenceLines={referenceLines}
            curveType='linear'
            valueFormatter={value =>
              `$${new Intl.NumberFormat('en-AU').format(value)}`
            }
          />
        </ResponsiveContainer>
        <ResultInfo data={data} />
      </div>
    </div>
  )
}
