import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SessionList from "./SessionList";
import TotalSessions from "./TotalSessions";

export default async function sessions() {
    const supabase = await createClient();

    const { data, error} = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Reading Stats 📈</h1>
                <p className="text-muted-foreground">Your reading activity, {data.user.email}</p>
            </div>
            <TotalSessions user={data.user} showAverages showLastSession />
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Recent sessions</h2>
                <SessionList user={data.user} />
            </div>
        </div>
    )
}