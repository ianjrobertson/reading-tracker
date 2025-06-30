'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface ReadingSession {
    id: string,
    user_id: string,
    minutes: number,
    pages: number,
    notes: string,
    session_date: Date,
    created_at: Date,
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
                .from('reading_sessions')
                .select('*', { count: 'exact'})
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
        return <div>Loading sessions... 🚀</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
    <div>
        {sessions.length === 0 ? (
            <p>No reading sessions found. 😭</p>
        ) : (
            <>
                <div>
                    {sessions.map((session) => (
                        <div key={session.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <p><strong>Date:</strong> {new Date(session.session_date).toLocaleDateString()}</p>
                            <p><strong>Minutes:</strong> {session.minutes}</p>
                            <p><strong>Pages:</strong> {session.pages}</p>
                            <p><strong>Notes:</strong> {session.notes}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={page <= 1}
                        style={{ padding: '8px 16px' }}
                        className='cursor-pointer'
                    >
                        Previous
                    </button>
                    
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    
                    <button 
                        onClick={goToNextPage} 
                        disabled={page >= totalPages}
                        style={{ padding: '8px 16px' }}
                        className='cursor-pointer'
                    >
                        Next
                    </button>
                </div>

                {/* Page Number Buttons (for smaller page counts) */}
                {totalPages <= 10 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                disabled={pageNum === page}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: pageNum === page ? '#007bff' : '#f8f9fa',
                                    color: pageNum === page ? 'white' : 'black',
                                    border: '1px solid #ccc'
                                }}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                )}
            </>
        )}
    </div>
);
}