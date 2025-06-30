import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SessionList from "./SessionList";

export default async function sessions() {
    const supabase = await createClient();

    const { data, error} = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return (
        <>
            <h1 className="text-xl">Reading Sessions for <span className="">{data.user.email}</span></h1>
            <SessionList user={data.user}></SessionList>
        </>
    )
}