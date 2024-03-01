'use client'
import React, { useCallback } from 'react'
import { Popover, TextInput, Textarea } from '@mantine/core'
import { PencilIcon } from '@heroicons/react/24/outline'
import { chartSettings } from '@/lib/chart-settings'

export function EditNameDescription() {
  const { saveSettings, name, description } = chartSettings()

  const nameRef = React.createRef<HTMLInputElement>()
  const descRef = React.createRef<HTMLTextAreaElement>()

  const handleEdit = useCallback(() => {
    saveSettings({
      name: nameRef.current?.value || name,
      description: descRef.current?.value
    })
  }, [nameRef, descRef, saveSettings, name])

  return (
    <Popover
      width={300}
      trapFocus
      position='bottom'
      withArrow
      shadow='md'
      onClose={handleEdit}
    >
      <Popover.Target>
        <PencilIcon className='m-2 w-5' />
      </Popover.Target>
      <Popover.Dropdown>
        <TextInput
          ref={nameRef}
          defaultValue={name}
          label='Name'
          placeholder='Enter a name for this scenario'
        />
        <Textarea
          ref={descRef}
          label='Description'
          resize='vertical'
          placeholder='Enter a description for this scenario'
          defaultValue={description}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
