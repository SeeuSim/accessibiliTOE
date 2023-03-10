'use client'

import QRCode from "react-qr-code";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


export default function WaitingRoom({ 
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [players, setPlayers] = useState(0);
  const [tries, setTries] = useState(0);

  const hyperlink = <Link href={`joinSession/${params.id}`}/>
  
  // if (!session) return router.push("/login");



  return (
    <main className="w-full flex justify-center">
      <div className="p-10 m-4 rounded-xl text-3xl border-[1px] border-slate-900 text-slate-900">
        Waiting for your partner...<br/><br/>

        To join, scan this QR:<br/>
        <QRCode className="h-40 w-40 mt-4 mx-auto" value={hyperlink.props.href}/>
      </div>
    </main>
  );
}