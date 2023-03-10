'use client'

import { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link"
import { useSupabase } from "../utils/supabase-provider";

export default function NavBar({ session }: { session: Session | null }) {
  const { supabase } = useSupabase();
  const authButtons = session
    ? [{label: "Profile", href: "/user"}, {label: "Logout", href: "/?logout=True", logout: true}]
    : [{label: "Login", href: "/login"}, {label: "Signup", href: "/signup"}];

  async function logoutCallback() {
    await Promise.all([
      supabase.auth.signOut(),
      supabase.auth.stopAutoRefresh()
    ]);
  }

  return (
    <div className="w-screen">
      <nav className="border-b-[0.5px] border-slate-800 bg-slate-200">
        <div className="flex items-center justify-between flex-row h-24">
          <Link 
            href="/"
            className="p-6 w-1/2 h-full text-blue-800 font-bold text-2xl text-center sm:text-4xl bg-slate-300 hover:bg-slate-400 hover:text-blue-700">
            Accessibili-<strong>TOE</strong>
          </Link>
          <div className="right-0 mr-2 flex w-1/2 h-full">
            {authButtons.map((i, idx) => 
              <Link
                key={idx} 
                href={`${i.href}`}
                onClick={() => {
                  i.logout
                    ? logoutCallback()
                    : null;
                }}
                className={`p-6 sm:p-8 w-1/2 h-full text-center place-items-center font-bold text-lg sm:text-2xl bg-slate-${200 + idx * 100} text-blue-600 hover:bg-slate-400 hover:text-blue-700 hover:z-20 hover:shadow-md`}>
                {i.label}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}