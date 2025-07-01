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
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(false);

    async function handleSubmit(e: { preventDefault: () => void }) {

        e.preventDefault();
        setLoading(true);
        try {
            await supabase.from('reading_sessions').insert({
                        notes: notes,
                        minutes: Number(minutes),
                        pages: Number(pages),
                        user_id: user?.id, // or get user ID server-side and pass it down
                        })

            setSaved(true);
            setTimeout(() => {
                setSaved(false)
            }, 1500);
        } catch(error) {
            console.error(error);
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 1500);
        } finally {
            setLoading(false);
            
        }
    }

    return (
        <div className='flex m-3'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col space-y-4 mb-4'>
                    <span>
                        What were you reading?
                    </span>
                    <textarea className='rounded p-1' placeholder='once upon a time...' onChange={e => setNotes(e.target.value)}>
                    </textarea>
                    <span>Enter Number of Minutes</span>
                    <input
                        type="number"
                        value={minutes}
                        onChange={e => setMinutes(e.target.value)}
                        placeholder="Minutes"
                        className='rounded p-1'
                    />
                    <span>Or Number of Pages</span>
                    <input
                        type="number"
                        value={pages}
                        onChange={e => setPages(e.target.value)}
                        placeholder="Pages"
                        className='rounded p-1'
                    />
                    
                </div>
                <div className='flex flex-col justify-end'>
                    <button type="submit" className='bg-zinc-900 p-2 text-white  px-4 rounded-md'>{loading ? 'saving' : 'Save Session'} </button>
                    {saved && (
                        <p className='text-green-600'>Saved Succesfully! 🚀</p>
                    )}
                    {error && (
                        <p className='text-red-600'>Sorry there was an error! 😭</p>
                    )}
                </div>
            </form> 
        </div>
        
    )
}