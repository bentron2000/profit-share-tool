'use client'
import { LoadSave } from '../../Components/Controls/LoadSave/LoadSave'
import { BaseSettings } from '../../Components/Controls/BaseSettings'

export default function ControlsPage() {
  return (
    <div className='h-screen overflow-scroll'>
      <div className='flex flex-col gap-5  p-3'>
        <h1 className='text-2xl font-bold'>Profit Share Visualiser</h1>
        <LoadSave />
        <BaseSettings />
      </div>
    </div>
  )
}
