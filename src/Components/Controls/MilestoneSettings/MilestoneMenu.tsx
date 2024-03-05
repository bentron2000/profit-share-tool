'use client'
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Menu, Modal, TextInput } from '@mantine/core'
import { Milestone, chartSettings } from '@/lib/chart-settings'
import { useRef, useState } from 'react'

export function MilestoneMenu({ milestone }: { milestone: Milestone }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  if (milestone.milestoneNumber === 0) return null
  return (
    <>
      <Menu closeOnClickOutside closeOnItemClick={false}>
        <Menu.Target>
          <EllipsisHorizontalIcon className='w-5' />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <button
              className='flex gap-2'
              onClick={() => setDeleteModalOpen(true)}
            >
              <TrashIcon className='w-5 text-red-400' />
              <span>Delete</span>
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              className='flex gap-2'
              onClick={() => setRenameModalOpen(true)}
            >
              <PencilSquareIcon className='w-5' />
              <span>Rename</span>
            </button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DeleteMilestoneModal
        opened={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        milestone={milestone}
      />
      <RenameMilestoneModal
        opened={renameModalOpen}
        setOpen={setRenameModalOpen}
        milestone={milestone}
      />
    </>
  )
}

function DeleteMilestoneModal({
  milestone,
  setOpen,
  opened
}: {
  milestone: Milestone
  setOpen: (open: boolean) => void
  opened: boolean
}) {
  const { deleteMilestone } = chartSettings()

  return (
    <Modal
      withCloseButton={false}
      opened={opened}
      onClose={() => setOpen(false)}
      centered
    >
      Do you want to delete this milestone?
      <br />
      This action cannot be undone.
      <div className='mt-3 flex gap-3'>
        <button
          onClick={() => {
            deleteMilestone(milestone)
            setOpen(false)
          }}
          className='rounded-sm bg-red-300 px-2 py-1 font-bold'
        >
          Delete
        </button>
        <button
          onClick={() => setOpen(false)}
          className='rounded-sm bg-green-300 px-2 py-1'
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

function RenameMilestoneModal({
  milestone,
  setOpen,
  opened
}: {
  milestone: Milestone
  setOpen: (open: boolean) => void
  opened: boolean
}) {
  const { saveMilestone } = chartSettings()
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Modal
      withCloseButton={false}
      opened={opened}
      onClose={() => setOpen(false)}
      centered
    >
      <div className='mt-3 flex flex-col gap-3'>
        <TextInput
          label='Rename Milestone'
          defaultValue={milestone.label}
          placeholder={milestone.label}
          ref={ref}
        />
        <div className='flex gap-3'>
          <button
            onClick={() => {
              if (
                ref.current === null ||
                !ref.current.value ||
                ref.current.value === milestone.label
              ) {
                setOpen(false)
                return
              }
              saveMilestone({ ...milestone, label: ref.current.value })
              setOpen(false)
            }}
            className='rounded-sm bg-green-300 px-2 py-1'
          >
            Save
          </button>
          <button
            onClick={() => setOpen(false)}
            className='rounded-sm bg-red-300 px-2 py-1'
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
