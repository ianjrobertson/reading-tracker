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
        <>
            <h1 className="text-xl">Reading Sessions for <span className="">{data.user.email}</span> 📈</h1>
            <TotalSessions user={data.user} compact={false} showAverages={true}></TotalSessions>
            <SessionList user={data.user}></SessionList>
        </>
    )
}