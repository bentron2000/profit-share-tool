'use client'
import { chartSettings } from '../_data/chart-settings'
import { LoadSave } from '../../Components/LoadSave/LoadSave'
import { Milestones } from '../../Components/MilestoneSettings/Milestones'
import { ValueSlider } from '../../Components/ValueSlider'

export default function ControlsPage() {
  return (
    <div className='h-screen overflow-scroll'>
      <div className='flex flex-col gap-5  p-3'>
        <h1 className='text-2xl font-bold'>Profit Share Visualiser</h1>
        <LoadSave />
        <ScenarioSettings />
      </div>
    </div>
  )
}

function ScenarioSettings() {
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
