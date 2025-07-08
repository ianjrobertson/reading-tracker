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
        // <div>Coming Soon 🛠️</div>
        <>
            <h1 className="text-xl">Reading Sessions Leaderboard 📈</h1>
            <LeaderboardList></LeaderboardList>
        </>
    )
}