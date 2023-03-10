'use client'

import QRCode from "react-qr-code";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { trpc } from "providers/trpcProvider";

export default function WaitingRoom({ 
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [players, setPlayers] = useState(0);
  const [tries, setTries] = useState(0);
  const [fetch, setFetch] = useState(true);
  const { supabase, session } = useSupabase();
  const { data, isFetching } = trpc.game.proceedGame.useQuery({
    game_id: Number.parseInt(params.id)
  }, {
    onSuccess(data) {
      if (data) {
        setFetch(false);
        router.push(`/game/${params.id}?player=1`);
      }
    },
    enabled: fetch,
    retry: 60,
    retryDelay: 500
  });

  const hyperlink = <Link href={`joinSession/${params.id}`}/>
  
  if (!session) return router.push("/login");

  return (
    <main className="w-full flex justify-center">
      <div className="p-10 m-4 rounded-xl text-3xl border-[1px] border-slate-900 text-slate-900">
        Waiting for your partner...<br/><br/>

        <br/>
        Your session ID is <strong>{params.id}</strong>
        <br/>

        To join, scan this QR:<br/>
        <QRCode className="h-40 w-40 mt-4 mx-auto" value={hyperlink.props.href}/><br/>
        Click <strong>anywhere</strong> to refresh.
      </div>
    </main>
  );
}