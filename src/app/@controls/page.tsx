'use client'
import { LoadSave } from '../../Components/Controls/LoadSave/LoadSave'
import { BaseSettings } from '../../Components/Controls/BaseSettings/BaseSettings'
import { ScrollArea } from '@mantine/core'
// import { useMantineColorScheme } from '@mantine/core'
// import {
//   ComputerDesktopIcon,
//   MoonIcon,
//   SunIcon
// } from '@heroicons/react/24/outline'

export default function ControlsPage() {
  return (
    <ScrollArea h='100vh'>
      <div className='flex flex-col gap-5 p-3'>
        <h1 className='text-2xl font-bold'>Profit Share Visualiser</h1>
        <LoadSave />
        <BaseSettings />
      </div>
    </ScrollArea>
  )
}

// const modes = ['light', 'dark', 'auto'] as const

// function ColourModeToggle() {
//   const { colorScheme, setColorScheme } = useMantineColorScheme()
//   switch (colorScheme) {
//     case 'auto':
//       return (
//         <button onClick={() => setColorScheme('light')}>
//           <ComputerDesktopIcon className='w-5' />
//         </button>
//       )
//     case 'light':
//       return (
//         <button onClick={() => setColorScheme('dark')}>
//           <MoonIcon className='w-5' />
//         </button>
//       )
//     case 'dark':
//       return (
//         <button onClick={() => setColorScheme('auto')}>
//           <SunIcon className='w-5' />
//         </button>
//       )
//   }
// }
