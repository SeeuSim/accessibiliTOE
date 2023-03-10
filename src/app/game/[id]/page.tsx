'use client'

import { Board } from "app/(components)/ui/game/board";
import { useRouter, useSearchParams } from "next/navigation";

export default function GamePage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const player = searchParams?.get("player");
  if (!player || Number.parseInt(player) < 0 || Number.parseInt(player) > 2) return router.push("/joinSession");
  return ( 
    <div className="pt-2">
      <Board player={Number.parseInt(player)} game={params.id}/>
    </div>
  );
}