'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AddBookDialog from '@/components/books/AddBookDialog'
import { formatGenre, UserBook } from '@/components/books/types'

type Props = {
    user: User
}

export default function Library({ user }: Props) {
    const supabase = createClient()
    const [books, setBooks] = useState<UserBook[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('user_book')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching books:', error.message)
                setBooks([])
            } else {
                setBooks(data as UserBook[])
            }
            setLoading(false)
        }

        if (user?.id) fetchBooks()
    }, [user?.id])

    const handleAdded = (book: UserBook) => {
        setBooks((prev) => [book, ...prev])
    }

    const handleDelete = async (id: string) => {
        const previous = books
        // Optimistically remove from the UI.
        setBooks((prev) => prev.filter((b) => b.id !== id))

        const { error } = await supabase.from('user_book').delete().eq('id', id)
        if (error) {
            console.error('Error deleting book:', error.message)
            setBooks(previous)
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <AddBookDialog user={user} onAdded={handleAdded} />
            </div>

            {loading ? (
                <p className="text-muted-foreground">Loading your library…</p>
            ) : books.length === 0 ? (
                <p className="text-muted-foreground">
                    No books yet. Add your first one above! 📖
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <Card key={book.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
                                <div className="flex flex-col gap-1">
                                    <CardTitle>{book.title}</CardTitle>
                                    {book.author && (
                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Delete book"
                                    onClick={() => handleDelete(book.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-1 items-end gap-4">
                                {book.thumbnail_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={book.thumbnail_url}
                                        alt={book.title ?? 'Book cover'}
                                        className="h-24 w-16 rounded object-cover"
                                    />
                                )}
                                <div className="flex flex-col gap-2">
                                    {book.genre && (
                                        <Badge variant="secondary" className="w-fit">
                                            {formatGenre(book.genre)}
                                        </Badge>
                                    )}
                                    {book.number_of_pages != null && (
                                        <p className="text-sm text-muted-foreground">
                                            {book.number_of_pages} pages
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
