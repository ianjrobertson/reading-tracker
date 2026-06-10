import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import  LeaderboardList  from "./Leaderboard";

export default async function Leaderboard() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Leaderboard 🏆</h1>
                <p className="text-muted-foreground">See how you rank among other readers</p>
            </div>
            <LeaderboardList currentUserId={data.user.id} />
        </div>
    )
}