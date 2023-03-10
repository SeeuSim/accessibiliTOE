'use client'
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";

export default function JoinSession() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  if (!session) return router.push("/login");

  return (
    <main className="h-[100vh] w-screen">
      <div className="w-full grid grid-cols-1 grid-rows-2 p-2 pr-4">
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-200 hover:bg-slate-400">
          <div className="flex justify-center items-center">
            <span className="text-4xl font-bold">
              Create a session
            </span>
          </div>
        </div>
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-300 hover:bg-slate-400">
          <div className="flex justify-center items-center">
            <span className="text-4xl font-bold">
              Join a session
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}