'use client';

import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(
    () => {
      if (session != null) return router.push("");
    },
    [session]
  );

  async function signInCallback(e:any) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.user) {
      return router.replace("");
    }
    console.log(error);
  }

  return (
    <div>
      <form>
        <div>
        <input type="email" onChange={(e: any) => setEmail(e.target.value)}></input>
        <input type="password" onChange={(e: any) => setPassword(e.target.value)}></input>
        <button onClick={(e:any) => signInCallback(e)}>Submit</button>
        </div>
      </form>
    </div>
  );
}