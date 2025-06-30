import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Reading Tracker 📕</h2>
        <Link href='/protected/add-session'><p className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded p-1">Add a reading session</p></Link>
        <Link href='/protected/sessions'><p className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded p-1">View my stats</p></Link>
        <Link href='/protected/leaderboard'><p className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded p-1">View the reading leaderboard</p></Link>
      </div>
      <div>
      </div>
    </div>
  );
}
