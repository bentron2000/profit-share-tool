'use client'
import { chartSettings } from '../../../lib/chart-settings'
import { ValueSlider } from '../../Shared/ValueSlider'

export function VolumeSlider() {
  const { numItemsToSell, setnumItemsToSell } = chartSettings()
  return (
    <ValueSlider
      value={numItemsToSell}
      onChange={setnumItemsToSell}
      title='Total Sales Volume'
      min={100}
      max={1000}
    />
  )
}
