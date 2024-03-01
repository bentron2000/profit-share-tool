'use client'
import { chartSettings } from '../../../lib/chart-settings'
import { ValueSlider } from '../../Shared/ValueSlider'

export function ProjectCostsSlider() {
  const { setProjectCosts, totalProjectCosts } = chartSettings()
  return (
    <ValueSlider
      value={totalProjectCosts}
      onChange={setProjectCosts}
      min={100}
      max={10000}
      title='Cost base'
      label={value => `$${new Intl.NumberFormat('en-AU').format(value)}`}
    />
  )
}
