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
            {isFetching? "Loading" : "Create Session"}
          </button>
        </div>
        <div className="w-full h-[35vh] p-4 m-2 rounded-lg bg-slate-300 hover:bg-slate-400">
          <div className="flex justify-center items-center">
            <span className="text-4xl font-bold">
              Join a session
            </span>
            <div>
              <span>Enter Session Number:{JSON.stringify(isFetching)}</span>
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