'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

type Props = {
  user: User
}

export default function SessionList({ user }: Props)
{
    const supabase = createClient()
    type Session = {
        id: string;
        user_id: string;
        creation_date: string;
        // Add other fields from your 'reading_sessions' table as needed
    };

    const [sessions, setSessions] = useState<Session[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 15;
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSessions = async () => {
        setLoading(true);

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await supabase
            .from('reading_sessions')
            .select('*', { count: 'exact' }) // count needed for pagination
            .eq('user_id', user?.id)
            .order('creation_date', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching sessions:', error);
        } else {
            setSessions(data);
            setTotalPages(count !== null ? Math.ceil(count / pageSize) : null);
    }
    setLoading(false);
    };

  

    return (
        <>
        
        </>
    )

}