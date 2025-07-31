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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Reading Sessions Leaderboard 📈
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    See how you rank among other readers
                </p>
            </div>
            <LeaderboardList />
        </div>
    )
}