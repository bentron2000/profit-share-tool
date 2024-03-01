import { Checkbox, Menu } from '@mantine/core'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { chartSettings } from '@/app/_data/chart-settings'
import { series } from '@/app/_data/constants'
import { without } from 'ramda'

export function DisplaySettings() {
  const { dataToDisplay, setDataToDisplay } = chartSettings()
  return (
    <Menu closeOnClickOutside closeOnItemClick={false}>
      <Menu.Target>
        <WrenchScrewdriverIcon className='w-5' />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item>
          <div className='flex flex-col gap-3'>
            {series.map(item => (
              <Checkbox
                key={item.name}
                label={item.name}
                checked={dataToDisplay.includes(item.name)}
                onChange={event => {
                  if (event.target.checked) {
                    setDataToDisplay([...dataToDisplay, item.name])
                  } else {
                    setDataToDisplay(without([item.name], dataToDisplay))
                  }
                }}
              />
            ))}
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
