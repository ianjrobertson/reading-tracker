'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

type Props = {
  user: User
}

export default function AddSessionForm({ user }: Props) {
    const supabase = createClient()
    const [minutes, setMinutes] = useState('')
    const [pages, setPages] = useState('')

    async function handleSubmit(e: { preventDefault: () => void }) {

        e.preventDefault()
        await supabase.from('reading_sessions').insert({
            minutes: Number(minutes),
            pages: Number(pages),
            user_id: user?.id, // or get user ID server-side and pass it down
            })
        // handle success, clear form, etc.
    }

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="number"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="Minutes"
        />
        <input
            type="number"
            value={pages}
            onChange={e => setPages(e.target.value)}
            placeholder="Pages"
        />
        <button type="submit">Add Session</button>
        </form>
    )
}