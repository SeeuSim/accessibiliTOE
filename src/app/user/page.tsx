'use client'

import { trpc } from "providers/trpcProvider";
import { useRouter } from "next/navigation";
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { number } from "zod";
import { useState } from "react";
import Link from "next/link";

export default function UserPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [uniqueMatches, setUniqueMatches] = useState<Map<number, boolean>>(new Map<number, boolean>());
  const [games, setGames] = useState<{gameID: number, startingPlayer: boolean}[]>([]);
  if (!session || !session.user || !session.user.email) router.push("/login");
  
  const { data } = trpc.game.getGames.useQuery({
    user_email: session?.user.email??""
  }, {
    onSuccess(data) {
      if (!data) return;
      for (let point of data.data) {
        uniqueMatches.set(point.game_id, point.starting_player);
      }
      uniqueMatches.forEach((v, k) => {
        setGames([...games, {gameID: k, startingPlayer: v}]);
      })
    },
    retry: false
  });

  return (
    <div className="flex flex-col">
      {
        games.map((i, idx) => 
          <Link
            href={`/game/${i.gameID}?player=${i.startingPlayer? 1 : 2}`}
            key={idx}
            className="text-2xl mx-auto my-4 p-4 bg-slate-100 hover:bg-slate-200"
          >
            <div className="mx-auto">
              Game: {i.gameID}
            </div>
          </Link>
        )
      }
    </div>
  );
}