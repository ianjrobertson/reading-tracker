'use client'
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface Props {
    user: User
    compact?: boolean
    className?: string,
    showUserId?: boolean,
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

export default function TotalSessions({ user, compact, className, showUserId }: Props) {
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
            <div className={`stats-compact ${className}`}>
                {showUserId && <span className="user-id">{stats.user_id}</span>}
                <span className="minutes">{stats.total_minutes.toLocaleString()} min</span>
                <span className="pages">{stats.total_pages.toLocaleString()} pages</span>
                {stats.total_sessions && (
                    <span className="sessions">{stats.total_sessions} sessions</span>
                )}
            </div>
        );
    }

    // Full card display for individual user pages
    return (
        <div className={`stats-card ${className}`} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            margin: '10px 0'
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>
                {showUserId ? `Stats for ${stats.user_id}` : 'Your Reading Stats'}
            </h3>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: stats.total_sessions ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', 
                gap: '15px' 
            }}>
                <div className="stat-item" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#3b82f6' }}>
                        {stats.total_minutes.toLocaleString()}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9em' }}>Total Minutes</div>
                </div>
                
                <div className="stat-item" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#10b981' }}>
                        {stats.total_pages.toLocaleString()}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9em' }}>Total Pages</div>
                </div>
                
                {stats.total_sessions && (
                    <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#f59e0b' }}>
                            {stats.total_sessions.toLocaleString()}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.9em' }}>Total Sessions</div>
                    </div>
                )}
            </div>
        </div>
    );
}