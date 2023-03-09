'use client';

import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as bcrypt from "bcrypt";

export default function SignUpPage() {
  const { supabase, session } = useSupabase()
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(
    () => {
      if (session != null) return router.push("");
    },
    [session]
  );

  async function signInCallback(e: any) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            first_name: name,
            age: 27,
          }
        }
      }
    )
    if (data.user) {
      await fetch(`api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email
        })
      });
      
      //Email Verification
      return router.replace("user");
    }

    console.log(error);
  }
  return (
    <div>
      <form>
        <div>
        <input type="name" onChange={(e: any) => setName(e.target.value)}></input>
        <input type="email" onChange={(e: any) => setEmail(e.target.value)}></input>
        <input type="password" onChange={(e: any) => setPassword(e.target.value)}></input>
        <button onClick={(e:any) => signInCallback(e)}>Submit</button>
        </div>
      </form>
    </div>
  );
}