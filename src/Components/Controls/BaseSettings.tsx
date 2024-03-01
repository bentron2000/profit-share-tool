'use client'
import { chartSettings } from '../../lib/chart-settings'
import { Milestones } from './MilestoneSettings/Milestones'
import { ValueSlider } from '../Shared/ValueSlider'

export function BaseSettings() {
  const {
    numItemsToSell,
    setnumItemsToSell,
    salePrice,
    setSalePrice,
    editionCosts,
    setEditionCosts,
    allCostsRecoupedBy,
    setallCostsRecoupedBy
  } = chartSettings()
  return (
    <div className='flex flex-col gap-10'>
      <ValueSlider
        value={numItemsToSell}
        onChange={setnumItemsToSell}
        title='Edition Size'
        min={100}
        max={1000}
      />
      <ValueSlider
        value={salePrice}
        onChange={setSalePrice}
        min={10}
        max={100}
        title='Sale Price'
      />
      <ValueSlider
        value={editionCosts}
        onChange={setEditionCosts}
        min={100}
        max={10000}
        title='Cost base'
        label={value => `$${new Intl.NumberFormat('en-AU').format(value)}`}
      />
      <ValueSlider
        value={allCostsRecoupedBy}
        onChange={setallCostsRecoupedBy}
        min={0} // the total number of items minus
        max={numItemsToSell}
        step={1}
        title='Recoup all costs by sale #'
      />
      <Milestones />
    </div>
  )
}
