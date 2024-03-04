'use client'
import { Bars3Icon, TrashIcon } from '@heroicons/react/24/outline'
import { Menu } from '@mantine/core'
import { ChartModal } from '@/Components/Shared/ChartModal'
import { Milestone, chartSettings } from '@/lib/chart-settings'

export function MilestoneMenu({ milestone }: { milestone: Milestone }) {
  const { deleteMilestone } = chartSettings()
  if (milestone.milestoneNumber === 0) return null
  return (
    <Menu closeOnClickOutside closeOnItemClick={false}>
      <Menu.Target>
        <Bars3Icon className='w-5' />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <ChartModal
            icon={<TrashIcon className='w-5 text-red-400' />}
            buttonClassNames='ring-0 gap-2'
            buttonText='Delete'
            modalTitle='Delete Milestone'
            footer={close => (
              <div className='mt-3 flex gap-3'>
                <button
                  onClick={() => {
                    deleteMilestone(milestone)
                  }}
                  className='rounded-sm bg-red-300 px-2 py-1 font-bold'
                >
                  Delete
                </button>
                <button
                  onClick={close}
                  className='rounded-sm bg-green-300 px-2 py-1'
                >
                  Cancel
                </button>
              </div>
            )}
          >
            <div className='flex flex-col gap-3'>
              <p className='mt-2 text-sm'>
                Are you sure? This cannot be undone.
              </p>
            </div>
          </ChartModal>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
