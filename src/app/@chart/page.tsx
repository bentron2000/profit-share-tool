'use client'
import { LineChart } from '@mantine/charts'
import { useMemo } from 'react'
import { calculateSeries } from '../../lib/use-chart-data'
import { unstable_noStore as noStore } from 'next/cache'
import { chartSettings } from '../../lib/chart-settings'
import { dataKey, series } from '../../lib/constants'
import { milestonesToReferenceLines } from '../../lib/reference-lines'
import { DisplaySettings } from '@/Components/DisplaySettings'
import { ResultInfo } from '@/Components/ResultInfo'

export default function ChartPage() {
  noStore()

  const settings = chartSettings()

  const data = useMemo(() => calculateSeries(settings), [settings])

  const referenceLines = useMemo(
    () => milestonesToReferenceLines(data)(settings),
    [data, settings]
  )

  return (
    <div className='p-3'>
      <div className='flex gap-3'>
        Chart
        <DisplaySettings />
      </div>
      <div className='flex w-4/5 flex-col gap-8'>
        <LineChart
          h={700}
          data={data}
          dataKey={dataKey}
          withLegend
          series={series.filter(item =>
            settings.dataToDisplay.includes(item.name)
          )}
          dotProps={{ r: 0 }}
          referenceLines={referenceLines}
          curveType='linear'
          valueFormatter={value =>
            `$${new Intl.NumberFormat('en-AU').format(value)}`
          }
        />
        <ResultInfo />
      </div>
    </div>
  )
}
