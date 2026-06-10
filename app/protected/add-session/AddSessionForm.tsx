'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import AddBookDialog from '@/components/books/AddBookDialog'
import { UserBook } from '@/components/books/types'

type Props = {
  user: User
}

export default function AddSessionForm({ user }: Props) {
    const supabase = createClient()
    const [books, setBooks] = useState<UserBook[]>([])
    const [bookId, setBookId] = useState('')
    const [minutes, setMinutes] = useState('')
    const [pages, setPages] = useState('')
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(false);

    async function getUserBooks() {
        try {
            const { data, error } = await supabase
                .from('user_book')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            setBooks((data ?? []) as UserBook[]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserBooks();
    }, [])

    function handleBookAdded(book: UserBook) {
        setBooks((prev) => [book, ...prev]);
        setBookId(book.id);
    }

    async function handleSubmit(e: { preventDefault: () => void }) {

        e.preventDefault();
        if (!bookId) return;
        setLoading(true);
        try {
            await supabase.from('reading_session').insert({
                        book_id: bookId,
                        pages_read: Number(pages) || 0,
                        minutes_read: Number(minutes) || 0,
                        user_id: user?.id,
                        })

            setBookId('');
            setMinutes('');
            setPages('');
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
                    <span>What book were you reading?</span>
                    {books.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>
                            You have no books yet. Add one to get started.
                        </p>
                    ) : (
                        <select
                            value={bookId}
                            onChange={e => setBookId(e.target.value)}
                            required
                            className='rounded p-1 border bg-background'
                        >
                            <option value=''>Select a book…</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}{book.author ? ` — ${book.author}` : ''}
                                </option>
                            ))}
                        </select>
                    )}
                    <AddBookDialog user={user} onAdded={handleBookAdded} triggerLabel='Add a new book' />
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
                    <button type="submit" disabled={loading || !bookId} className='bg-zinc-900 p-2 text-white  px-4 rounded-md disabled:opacity-50'>{loading ? 'saving' : 'Save Session'} </button>
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
