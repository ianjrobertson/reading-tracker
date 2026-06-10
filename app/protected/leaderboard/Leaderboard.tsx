'use client';
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { BookText, Clock, Flame, TrendingUp, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const MEDALS = ['🥇', '🥈', '🥉'];

function Rank({ index }: { index: number }) {
    if (index < 3) {
        return <span className="text-2xl leading-none">{MEDALS[index]}</span>;
    }
    return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground tabular-nums">
            {index + 1}
        </span>
    );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof BookText; value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-base font-bold tabular-nums leading-none">{value}</span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
        </div>
    );
}

type Props = {
    currentUserId?: string
}

export default function LeaderboardList({ currentUserId }: Props) {
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
        return <p className="text-muted-foreground">Loading leaderboard…</p>;
    }

    if (error) {
        return <p className="text-destructive">Error loading leaderboard</p>;
    }

    if (userStats.length === 0) {
        return <p className="text-muted-foreground">No stats available yet.</p>;
    }

    return (
        <div className="flex flex-col gap-3">
            {userStats.map((stats, index) => {
                const isCurrentUser = stats.user_id === currentUserId;
                return (
                    <Card
                        key={stats.user_id}
                        className={cn(
                            'transition-shadow hover:shadow-md',
                            isCurrentUser && 'ring-2 ring-primary'
                        )}
                    >
                        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <Rank index={index} />
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {stats.email}
                                        {isCurrentUser && (
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>
                                        )}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <CalendarDays className="h-3 w-3" />
                                        Last read {new Date(stats.last_session_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 sm:gap-6">
                                <MiniStat icon={BookText} value={stats.total_pages.toLocaleString()} label="Pages" />
                                <MiniStat icon={Clock} value={stats.total_minutes.toLocaleString()} label="Min" />
                                <MiniStat icon={Flame} value={stats.total_sessions.toLocaleString()} label="Sessions" />
                                <MiniStat icon={TrendingUp} value={(stats.avg_pages_per_session || 0).toFixed(1)} label="Avg pg" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}
