'use client'
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { BookOpen, Clock, Flame, TrendingUp, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/stat-tile";

interface Props {
    user: User
    className?: string,
    showAverages?: boolean,
    showLastSession?: boolean,
}

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

export default function TotalSessions({ user, className, showAverages, showLastSession }: Props) {
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
        return <p className={`text-muted-foreground ${className ?? ''}`}>Loading stats…</p>;
    }

    if (error) {
        return <p className={`text-destructive ${className ?? ''}`}>Error loading stats</p>;
    }

    if (!stats) {
        return (
            <Card className={`p-6 text-muted-foreground ${className ?? ''}`}>
                No stats yet — log your first reading session to get started. 📖
            </Card>
        );
    }

    return (
        <div className={`flex flex-col gap-4 ${className ?? ''}`}>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile icon={BookOpen} label="Pages read" value={stats.total_pages.toLocaleString()} />
                <StatTile icon={Clock} label="Minutes read" value={stats.total_minutes.toLocaleString()} />
                <StatTile icon={Flame} label="Sessions" value={stats.total_sessions.toLocaleString()} />
                <StatTile
                    icon={TrendingUp}
                    label="Avg pages"
                    value={Math.round(stats.avg_pages_per_session || 0).toLocaleString()}
                    hint="per session"
                />
            </div>

            {(showAverages || showLastSession) && (
                <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    {showAverages && (
                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Avg minutes / session</span>
                                <span className="font-semibold tabular-nums">
                                    {Math.round(stats.avg_minutes_per_session || 0)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Avg pages / session</span>
                                <span className="font-semibold tabular-nums">
                                    {Math.round(stats.avg_pages_per_session || 0)}
                                </span>
                            </div>
                        </div>
                    )}
                    {showLastSession && stats.last_session_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>Last session {new Date(stats.last_session_date).toLocaleDateString()}</span>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
