'use client'
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Props {
    user: User
    compact?: boolean
    className?: string,
    showUserId?: boolean,
    showAverages?: boolean,
    showLastSession?: boolean,
}

interface TotalSessions {
    user_id: string,
    total_pages: number,
    total_minutes: number,
    total_sessions: number,
    avg_pages_per_session: number,
    avg_minutes_per_session: number,
    last_session_date: Date,
}

export default function TotalSessions({ user, compact, className, showAverages, showLastSession, showUserId }: Props) {
    const supabase = createClient();
    const [stats, setStats] = useState<TotalSessions | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserStats = async (user_id: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
        
            const { data, error } = await supabase
                .from('leaderboard_view')
                .select('*')
                .eq('user_id', user_id)
                .single(); // Use single() since we expect one result per user
            
            if (error) {
                console.error('Error fetching user stats:', error.message);
                setError(error.message);
                setStats(null);
            } else {
                setStats(data as TotalSessions);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
            setStats(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchUserStats(user.id);
        }
    }, [user])

    if (loading) {
        return <div className={className}>Loading stats...</div>;
    }

    if (error) {
        return <div className={`${className} error`}>Error loading stats</div>;
    }

    if (!stats) {
        return <div className={className}>No stats available</div>;
    }

    // Compact display for leaderboard rows
    if (compact) {
        return (
            <div className={`flex items-center gap-4 text-sm ${className}`}>
                {showUserId && (
                    <span className="font-medium text-gray-700 min-w-0 truncate">
                        {stats.user_id}
                    </span>
                )}
                <div className="flex gap-3">
                    <span className="text-blue-600 font-semibold">
                        {stats.total_minutes.toLocaleString()} min
                    </span>
                    <span className="text-green-600 font-semibold">
                        {stats.total_pages.toLocaleString()} pages
                    </span>
                    <span className="text-amber-600 font-semibold">
                        {stats.total_sessions} sessions
                    </span>
                </div>
                {showLastSession && stats.last_session_date && (
                    <span className="text-gray-500 text-xs">
                        {new Date(stats.last_session_date).toLocaleDateString()}
                    </span>
                )}
            </div>
        );
    }

    // Full card display for individual user pages
    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {showUserId ? `Stats for ${stats.user_id}` : 'Your Reading Stats'}
            </h3>
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                        {stats.total_minutes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Minutes</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                        {stats.total_pages.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Pages</div>
                </div>
                
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-3xl font-bold text-amber-600">
                        {stats.total_sessions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
                </div>
            </div>

            {/* Additional Stats */}
            {(showAverages || showLastSession) && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {showAverages && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">Averages per Session</h4>
                                <div className="space-y-2">
                                    {stats.avg_minutes_per_session && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Minutes:</span>
                                            <span className="text-sm font-medium text-blue-600">
                                                {Math.round(stats.avg_minutes_per_session)} min
                                            </span>
                                        </div>
                                    )}
                                    {stats.avg_pages_per_session && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Pages:</span>
                                            <span className="text-sm font-medium text-green-600">
                                                {Math.round(stats.avg_pages_per_session)} pages
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {showLastSession && stats.last_session_date && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">Last Activity</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Last Session:</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(stats.last_session_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}