'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "./(components)/utils/supabase-provider";

export default function Home() {
  const {supabase, session} = useSupabase();
  const router = useRouter();

  //Session does not yet exist
  return (
    <div className="font-bold text-blue-800 flex flex-col">
      <div className="mt-8 p-4 flex items-center justify-center">
        <span className="text-4xl font-bold text-blue-700">
          Welcome to&nbsp;<br className="sm:hidden"/>Accessibili-TOE
        </span>
      </div>
      <div className="mt-4 p-4 flex items-center justify-center">
        <Link className="p-4 rounded-xl bg-blue-700 text-slate-50 hover:bg-blue-600" 
          href="/joinSession">
          Start a Match
        </Link>
      </div>
    </div>
  )
}
