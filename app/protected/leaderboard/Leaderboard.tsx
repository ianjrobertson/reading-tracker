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
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-600 dark:text-gray-400">Loading stats...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-600 dark:text-red-400">Error loading stats</div>
            </div>
        );
    }

    if (userStats.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-600 dark:text-gray-400">No stats available</div>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {userStats.map((stats, index) => (
                <div 
                    key={index} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                    {/* Header with rank and email */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                    {stats.email}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {stats.total_pages.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Pages
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {stats.total_minutes.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Minutes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                {stats.total_sessions}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Sessions
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {stats.avg_pages_per_session.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Avg Pages
                            </div>
                        </div>
                    </div>

                    {/* Footer with last session date */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Last Session: {new Date(stats.last_session_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}