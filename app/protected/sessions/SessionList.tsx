'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { BookText, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ReadingSession {
    id: string,
    user_id: string,
    book_id: string | null,
    minutes_read: number,
    pages_read: number,
    session_date: Date,
    created_at: Date,
    user_book: { title: string | null, author: string | null } | null,
}

interface Props {
    user: User
}


export default function SessionList({ user }: Props)
{
    const supabase = createClient();
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = async (user_id: string, page: number): Promise<void> => {
        try {
            setLoading(true);
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const {data, count, error} = await supabase
                .from('reading_session')
                .select('*, user_book(title, author)', { count: 'exact'})
                .eq('user_id', user_id)
                .order('created_at', {ascending: false})
                .range(from, to)

            if (error) {
                console.error('Error fetching sessions:', error.message)
                setError(error.message);
                setSessions([]);
                setTotalPages(0);
            } else {
                setSessions(data as ReadingSession[]);
                setTotalPages(Math.ceil((count ?? 0) / pageSize));
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
            setSessions([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchSessions(user.id, page);
        }

    }, [user?.id, page])

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading sessions… 🚀</p>;
    }

    if (error) {
        return <p className="text-destructive">Error: {error}</p>;
    }

    if (sessions.length === 0) {
        return <p className="text-muted-foreground">No reading sessions yet. 😭</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                    <Card key={session.id} className="flex flex-col transition-shadow hover:shadow-md">
                        <CardHeader className="space-y-1">
                            <CardTitle className="truncate">
                                {session.user_book?.title ?? 'Unknown book'}
                            </CardTitle>
                            {session.user_book?.author && (
                                <p className="truncate text-sm text-muted-foreground">
                                    {session.user_book.author}
                                </p>
                            )}
                        </CardHeader>
                        <CardContent className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <BookText className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium tabular-nums">{session.pages_read}</span>
                                    <span className="text-muted-foreground">pages</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium tabular-nums">{session.minutes_read}</span>
                                    <span className="text-muted-foreground">min</span>
                                </span>
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                                {new Date(session.session_date).toLocaleDateString()}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={page <= 1} aria-label="Previous page">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {totalPages <= 7 ? (
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Button
                                key={pageNum}
                                variant={pageNum === page ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => goToPage(pageNum)}
                                className="tabular-nums"
                            >
                                {pageNum}
                            </Button>
                        ))
                    ) : (
                        <span className="px-2 text-sm text-muted-foreground tabular-nums">
                            Page {page} of {totalPages}
                        </span>
                    )}
                    <Button variant="outline" size="icon" onClick={goToNextPage} disabled={page >= totalPages} aria-label="Next page">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}