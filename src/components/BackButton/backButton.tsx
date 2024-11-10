import { ActionIcon } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function BackButton({ fn }: { fn?: any }) {
    const router = useRouter()
    return (
        <ActionIcon variant="light" size='lg' aria-label="Back to previous page"
            onClick={fn === undefined ? () => router.back() : () => fn()}><IconArrowLeft /></ActionIcon>
    )
}
