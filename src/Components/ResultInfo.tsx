import { chartSettings } from '@/lib/chart-settings'
import { SeriesData } from '@/lib/use-chart-data'
import { last } from 'ramda'

export function ResultInfo({ data }: { data: SeriesData[] }) {
  const {
    numItemsToSell,
    salePrice,
    totalProjectCosts: editionCosts
  } = chartSettings()
  console.log({ data })
  return (
    <div className='flex flex-col gap-2'>
      <InfoItem
        label='Total Possible Revenue'
        value={`$${new Intl.NumberFormat('en-AU').format(salePrice * numItemsToSell)}`}
      />
      <InfoItem
        label='Total Costs:'
        value={`$${new Intl.NumberFormat('en-AU').format(editionCosts)}`}
      />
      <InfoItem
        label='Total Company Component / % of revenue'
        value={`$${new Intl.NumberFormat('en-AU').format(last(data)?.companyComponent || 0)} / ${(
          ((last(data)?.companyComponent || 0) / (salePrice * numItemsToSell)) *
          100
        ).toFixed(2)}%`}
      />
      <InfoItem
        label='Total Partner / % of revenue'
        value={`$${new Intl.NumberFormat('en-AU').format(last(data)?.partnerShare || 0)} / ${(
          ((last(data)?.partnerShare || 0) / (salePrice * numItemsToSell)) *
          100
        ).toFixed(2)}%`}
      />
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return <p className='rounded-md p-2 ring-1'>{`${label} : ${value}`}</p>
}
