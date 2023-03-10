'use client';

import { useSupabase } from "app/(components)/utils/supabase-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Required = () => <p className="text-red-500">*</p>;

export default function LoginPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPwd] = useState(false);

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
            first_name: fname,
            last_name: lname
          }
        }
      }
    )
    if (data.user) {
      await fetch(`api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          name: `${fname} ${lname}`,
          email: email
        })
      });
      
      //Email Verification
      return router.replace("/messages/signUpSuccess");
    }

    console.log(error);
  }

  return (
    <div className="h-full w-screen bg-slate-100 flex items-center justify-center">
      <form className="w-10/12 sm:w-2/3 bg-white h-screen">
        <div className="h-10 my-4 mt-6 px-2 flex flex-row items-center justify-center">
          <span className="font-bold text-4xl self-center">Create an Account</span>
        </div>
        <div className="px-4">
          Already have an account?&nbsp;
          <Link
              className=" text-slate-900 p-2 bg-slate-100 font-bold hover:bg-slate-200" 
              href="/login">Sign In</Link>
        </div>
        <div className="flex flex-col">
          <div className="pl-2 sm:pl-4 py-2 sm:py-5 grid grid-cols-1 grid-rows-2 gap-y-2 sm:grid-cols-2 sm:grid-rows-1">
            <div className="w-full flex flex-col">
              <label className="font-bold text-xl mb-4 flex flex-row">First Name:<Required/></label>
              <input 
                className="w-11/12 h-12 text-3xl bg-slate-100 text-slate-900 border border-slate-500"
                type="text"
                required={true}
                onChange={(e: any) => setFName(e.target.value)}/>
            </div>
            <div className="w-full flex flex-col">
              <label className="font-bold text-xl mb-4 flex flex-row">Last Name:<Required/></label>
              <input 
                className="w-11/12 h-12 text-3xl bg-slate-100 text-slate-900 border border-slate-500"
                type="text"
                required={true}
                onChange={(e: any) => setLName(e.target.value)}/>
            </div>
          </div>
          <div className="pl-2 sm:pl-4 py-2 sm:py-5 flex flex-col">
            <label className="font-bold text-xl mb-4 flex flex-row">Email Address:<Required/></label>
            <input 
              className="w-11/12 h-12 text-3xl bg-slate-100 text-slate-900 border border-slate-500"
              type="email"
              required={true}
              onChange={(e: any) => setEmail(e.target.value)}/>
          </div>
          <div className="pl-2 sm:pl-4 py-2 sm:py-5 flex flex-col">
            <div className="flex justify-between w-11/12">
              <label className="font-bold text-xl mb-4 flex flex-row">Password:<Required/></label>
              <button 
                className="h-15 bg-slate-700 text-white px-2 sm:px-4 py-1 sm:py-2 text-md sm:text-lg rounded-md mb-4 hover:bg-slate-600"
                onClick={() => setShowPwd(!showPassword)}
                >{showPassword? "Hide" : "Show"} Password</button>

            </div>
            <input
              className="w-11/12 h-12 text-3xl bg-slate-100 text-slate-900 border border-slate-500"
              type={`${showPassword ? "text" : "password"}`}
              required={true}
              onChange={(e: any) => setPassword(e.target.value)}/>
          </div>
          <span className="pl-2 text-xs flex flex-row"><Required/>: This field is required</span>
          <button 
            className="bg-slate-800 mt-6 text-slate-50 p-8 text-2xl w-11/12 m-4 rounded-xl hover:bg-slate-600 hover:z-30 hover:shadow-xl"
            onClick={(e:any) => signInCallback(e)}>Sign Me Up!</button>
        </div>
      </form>
    </div>
  );
}