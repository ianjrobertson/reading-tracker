'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { BOOK_GENRES, formatGenre, UserBook } from './types'

type Props = {
    user: User
    onAdded: (book: UserBook) => void
}

export default function AddBookForm({ user, onAdded }: Props) {
    const supabase = createClient()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [numberOfPages, setNumberOfPages] = useState('')
    const [genre, setGenre] = useState('')
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(false)

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault()
        if (!title.trim()) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('user_book')
                .insert({
                    title: title.trim(),
                    author: author.trim() || null,
                    number_of_pages: numberOfPages ? Number(numberOfPages) : null,
                    genre: genre || null,
                    thumbnail_url: thumbnailUrl.trim() || null,
                    user_id: user.id,
                })
                .select()
                .single()

            if (error) throw error

            onAdded(data as UserBook)
            setTitle('')
            setAuthor('')
            setNumberOfPages('')
            setGenre('')
            setThumbnailUrl('')
            setSaved(true)
            setTimeout(() => setSaved(false), 1500)
        } catch (err) {
            console.error(err)
            setError(true)
            setTimeout(() => setError(false), 1500)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="mb-4 font-semibold">Add a book</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="The Hobbit"
                        required
                        className="rounded-md border bg-background p-2 text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="J.R.R. Tolkien"
                        className="rounded-md border bg-background p-2 text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Number of pages</label>
                    <input
                        type="number"
                        min="0"
                        value={numberOfPages}
                        onChange={(e) => setNumberOfPages(e.target.value)}
                        placeholder="310"
                        className="rounded-md border bg-background p-2 text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Genre</label>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="rounded-md border bg-background p-2 text-sm"
                    >
                        <option value="">Select a genre…</option>
                        {BOOK_GENRES.map((g) => (
                            <option key={g} value={g}>
                                {formatGenre(g)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Cover image URL</label>
                    <input
                        type="url"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://…"
                        className="rounded-md border bg-background p-2 text-sm"
                    />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving…' : 'Add to library'}
                </Button>
                {saved && <p className="text-sm text-green-600">Added! 🚀</p>}
                {error && <p className="text-sm text-red-600">Sorry, there was an error! 😭</p>}
            </div>
        </form>
    )
}
