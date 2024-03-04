'use client'
import React from 'react'
import { PropsWithChildren } from 'react'
import { Modal, ModalProps } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { cn } from '@/lib/utils'

interface ChartModalProps extends Omit<ModalProps, 'opened' | 'onClose'> {
  icon: React.ReactNode
  // footer: a render prop function that gives the close function as a parameter returns a React.ReactNode
  footer: (close: () => void) => React.ReactNode
  buttonText?: string
  modalTitle?: string
  disabled?: boolean
  buttonClassNames?: string
}

export function ChartModal({
  icon,
  buttonText,
  modalTitle,
  footer,
  children,
  buttonClassNames,
  disabled,
  ...props
}: PropsWithChildren<ChartModalProps>) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <button
        disabled={disabled}
        onClick={open}
        className={cn(
          'flex grow items-center gap-1 rounded-md p-1 text-xs font-light ring-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600',
          buttonClassNames
        )}
      >
        {icon}
        {buttonText}
      </button>
      <Modal withCloseButton={false} opened={opened} onClose={close} centered>
        <div className='gap-2'>
          <h2 className='text-lg font-semibold'>{modalTitle}</h2>
          {children}
          {footer(close)}
        </div>
      </Modal>
    </>
  )
}
