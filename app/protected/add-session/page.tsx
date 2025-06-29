import AddSessionForm from "./AddSessionForm"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function AddSessionPage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
      }

    return (
        <div>
            <h1 className="text-xl">Create a new reading session</h1>
            <AddSessionForm user={data?.user}></AddSessionForm>
        </div>
    )
}