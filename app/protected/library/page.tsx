import Library from "./Library";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">My Library 📚</h1>
                <p className="text-muted-foreground">The books in your personal collection</p>
            </div>
            <Library user={data.user} />
        </div>
    );
}
