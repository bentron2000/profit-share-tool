'use client'
import { chartSettings } from '../../../lib/chart-settings'
import { ValueSlider } from '../../Shared/ValueSlider'

export function AllCostsRecoupedBySlider() {
  const { allCostsRecoupedBy, setallCostsRecoupedBy, numItemsToSell } =
    chartSettings()
  return (
    <ValueSlider
      value={allCostsRecoupedBy}
      onChange={setallCostsRecoupedBy}
      min={0} // the total number of items minus
      max={numItemsToSell}
      step={1}
      title='Recoup all costs by sale #'
    />
  )
}
