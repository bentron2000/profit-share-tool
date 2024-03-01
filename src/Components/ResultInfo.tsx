import { chartSettings } from '@/lib/chart-settings'

export function ResultInfo() {
  const { numItemsToSell, salePrice, editionCosts } = chartSettings()
  return (
    <>
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
    </>
  )
}
