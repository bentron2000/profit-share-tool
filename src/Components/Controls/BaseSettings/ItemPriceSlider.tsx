'use client'
import { chartSettings } from '../../../lib/chart-settings'
import { ValueSlider } from '../../Shared/ValueSlider'

export function ItemPriceSlider() {
  const { salePrice, setSalePrice } = chartSettings()
  return (
    <ValueSlider
      value={salePrice}
      onChange={setSalePrice}
      min={10}
      max={100}
      title='Item Sale Price'
    />
  )
}
