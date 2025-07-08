'use client';
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface TotalSessions {
    user_id: string,
    email: string,
    total_pages: number,
    total_minutes: number,
    total_sessions: number,
    avg_pages_per_session: number,
    avg_minutes_per_session: number,
    last_session_date: Date,
}


export default function LeaderboardList() {
    const supabase = createClient();

    const [userStats, setUserStats] = useState<TotalSessions[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase.from('leaderboard_view').select('*').order('total_pages', { ascending: false });

            if (error) {
                setError(error.message);
                setUserStats([]);
            } else {
                setUserStats(data as TotalSessions[])
            }

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
            setUserStats([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStats();
    }, [])

    if (loading) {
        return <div className="">Loading stats...</div>;
    }

    if (error) {
        return <div className=''>Error loading stats</div>;
    }

    if (userStats.length === 0) {
        return <div className=''>No stats available</div>;
    }
    

    return (
        <>
            {userStats.map((stats, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-700 dark:text-white min-w-0 truncate">
                        {stats.email}
                    </span>
                    <div className="flex gap-3">
                        <span className="text-green-600 font-semibold">
                            {stats.total_pages.toLocaleString()} pages
                        </span>
                        <span className="text-blue-600 font-semibold">
                            {stats.total_minutes.toLocaleString()} min
                        </span>
                        <span className="text-amber-600 font-semibold">
                            {stats.total_sessions} sessions
                        </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                        Last Session: {new Date(stats.last_session_date).toLocaleDateString()}
                    </span>
                </div>
            ))}
        </>
    )
}