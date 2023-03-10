'use client'
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "providers/trpcProvider";
import zod from "zod";

export default function JoinSession() {
  const router = useRouter();
  const [refetch, setFetch] = useState(false);
  const [refetchSession, setFetchSession] = useState(false);
  const [num, setNum] = useState<string>();
  const { supabase, session, channel, setChannel } = useSupabase();
  const { data, isFetching } = trpc.game.createGame.useQuery({
    email: session?.user.email??""
  }, {
    onSuccess(data) {
      setFetch(false);
      if (data?.game_id) {
        router.push(`/joinSession/${data.game_id}`);
      }
    },
    onError(err) {
      console.log(err);
    },
    enabled: refetch,
    retry: false
  });
  
  const joinSession = trpc.game.joinGame.useQuery({
    game_id: Number.parseInt(num as string)
  }, {
    onSuccess(data) {
      setFetchSession(false);
      if (data?.game_id && Number.parseInt(data.players) == 2) {
        router.push(`/game/${data.game_id}/?player=2`);
      }
    },
    retry: false,
    enabled: refetchSession
  });

  if (!session) return router.push("/login");

  const onSessionNumEnter = (e: any) => {
    e.preventDefault();

    setFetchSession(true);

    // console.log("Session already in play");
  }

  async function onCreateSession() {
    setFetch(true);
    if (!data?.game_id) {
      console.log("no data")
      return;
    }

    const channel = supabase.channel((data.game_id).toString())
    setChannel(channel);
  }

  return (
    <main className="h-[100vh] w-screen">
      <div className="w-full grid grid-cols-1 grid-rows-2 p-2 pr-4">
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-200 hover:bg-slate-400">
          <button disabled={isFetching} onClick={onCreateSession} className="flex justify-center items-center mx-auto h-full my-auto font-bold text-5xl">
            {isFetching? "Loading" : "Create Game"}
          </button>
        </div>
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-300">
          <div className="flex flex-col justify-center items-center">
            <span className="text-4xl font-bold">
              Join a game
            </span>
            <div className="px-2 mt-8">
              <span className="text-2xl font-bold m-4">Enter Session Number:</span>
              <div className="mt-4 flex flex-row">
                <input 
                  className="m-4 h-20 text-center text-2xl"
                  type="text" 
                  onChange={(e) => setNum(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" ? onSessionNumEnter(e) : null}/>
                <button 
                  className="p-2 m-4 h-16  self-center rounded-md bg-slate-100 hover:bg-slate-300 hover:text-slate-800 hover:border hover:border-black text-xl font-black"
                  onClick={(e) => onSessionNumEnter(e)}>Join Session</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}