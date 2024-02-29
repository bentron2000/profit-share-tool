'use client'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { LineChart } from '@mantine/charts'
import { prop } from 'ramda'
import { useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { calculateSeries } from '../_data/use-chart-data'

import { Checkbox, Menu } from '@mantine/core'
import { unstable_noStore as noStore } from 'next/cache'
import { chartSettings } from '../_data/chart-settings'
import { dataKey, series } from '../_data/constants'
import { milestonesToReferenceLines } from '../_data/reference-lines'

export default function ChartPage() {
  noStore()
  const settings = chartSettings()
  const data = useMemo(() => calculateSeries(settings), [settings])
  const referenceLines = useMemo(
    () => milestonesToReferenceLines(data)(settings),
    [data, settings]
  )

  const { numItemsToSell, salePrice, editionCosts } = settings

  const [show, setShow] = useState<Set<string>>(
    new Set(series.map(prop('name')))
  )

  console.log({ show })
  return (
    <div className='p-3'>
      <div className='flex gap-3'>
        Chart
        <Menu closeOnClickOutside closeOnItemClick={false}>
          <Menu.Target>
            <WrenchScrewdriverIcon className='w-5' />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item>
              <div className='flex flex-col gap-3'>
                {series.map(item => (
                  <Checkbox
                    key={item.name}
                    label={item.name}
                    checked={show.has(item.name)}
                    onChange={event => {
                      if (event.target.checked) {
                        const newValue = new Set(show)
                        newValue.add(item.name)
                        setShow(newValue)
                      } else {
                        const newValue = new Set(show)
                        newValue.delete(item.name)
                        setShow(newValue)
                      }
                    }}
                  />
                ))}
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div
        className='flex w-4/5 flex-col 
      gap-8'
      >
        <ErrorBoundary fallback={<WTF />}>
          <LineChart
            h={700}
            data={data}
            dataKey={dataKey}
            withLegend
            series={series.filter(item => show.has(item.name))}
            dotProps={{ r: 0 }}
            referenceLines={referenceLines}
            curveType='linear'
            valueFormatter={value =>
              `$${new Intl.NumberFormat('en-AU').format(value)}`
            }
          />
        </ErrorBoundary>
        <p>
          Total Possible Revenue:
          {` $${new Intl.NumberFormat('en-AU').format(
            salePrice * numItemsToSell
          )}`}
        </p>
        <p>
          Total Costs:
          {` $${new Intl.NumberFormat('en-AU').format(editionCosts)}`}
        </p>
      </div>
    </div>
  )
}

function WTF() {
  return <div>WTF</div>
}
