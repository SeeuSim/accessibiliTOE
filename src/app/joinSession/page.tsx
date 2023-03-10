'use client'
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import zod from "zod";

export default function JoinSession() {
  const { supabase, session, channel, setChannel } = useSupabase();
  const router = useRouter();

  if (!session) return router.push("/login");

  const [num, setNum] = useState<string>();
  const onSessionNumEnter = (e: any) => {
    e.preventDefault();
    const out = zod.number().safeParse(num);
    if (out.success) {
      return router.push(`game/${out}`);
    }
    console.log("Session already in play");
  }

  async function onCreateSession() {
    console.log("clicked");
    const game = await fetch("api/game/create", {
      method: "POST",
      body: JSON.stringify({
        name: session?.user.id,
        email: session?.user.email
      })
    });

    if (!game.ok) {
      console.log(game.statusText);
    }

    const messageChannelID = await game.text()
    const channel = supabase.channel(messageChannelID)
    setChannel(channel);
    router.push(`joinSession/${messageChannelID}`);
  }

  return (
    <main className="h-[100vh] w-screen">
      <div className="w-full grid grid-cols-1 grid-rows-2 p-2 pr-4">
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-200 hover:bg-slate-400">
          <div className="flex justify-center items-center">
            <button onClick={onCreateSession}>
              <span className="text-4xl font-bold">
                Create a session
              </span>
            </button>
          </div>
        </div>
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-300 hover:bg-slate-400">
          <div className="flex justify-center items-center">
            <span className="text-4xl font-bold">
              Join a session
            </span>
            <div>
              <span>Enter Session Number:</span>
              <div>
                <input 
                  type="text" 
                  onChange={(e) => setNum(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" ? onSessionNumEnter(e) : null}/>
                <button onClick={(e) => onSessionNumEnter(e)}>Enter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}