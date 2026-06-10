'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddBookForm from './AddBookForm'
import { UserBook } from './types'

type Props = {
    user: User
    onAdded: (book: UserBook) => void
    triggerLabel?: string
}

export default function AddBookDialog({ user, onAdded, triggerLabel = 'Add a book' }: Props) {
    const [open, setOpen] = useState(false)

    const handleAdded = (book: UserBook) => {
        onAdded(book)
        setOpen(false)
    }

    return (
        <>
            <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                {triggerLabel}
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-xl border bg-card p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <AddBookForm user={user} onAdded={handleAdded} />
                    </div>
                </div>
            )}
        </>
    )
}
