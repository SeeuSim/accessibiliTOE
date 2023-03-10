'use client'

import { Move } from "@prisma/client";
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { trpc } from "providers/trpcProvider";
import { useEffect, useState } from "react";
import Cell from "./cell"

export function Board({
  player,
  game
}: {
  player: number,
  game: string
}) {
  const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [p1turn, setP1Turn] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [p1, setP1] = useState(new Set<number>());
  const [p2, setP2] = useState(new Set<number>());
  const [moves, setMoves] = useState<Move[]>();
  const [fetch, setFetch] = useState(true);
  const { supabase, session } = useSupabase();

  
  /*
  | 1 | 2 | 3 |
  -------------
  | 4 | 5 | 6 |
  -------------
  | 7 | 8 | 9 |
  
  */
 const winCondition = (player: Set<number>) => {
   if (
     //Diagonals
     player.has(1) && player.has(5) && player.has(9) ||
     player.has(3) && player.has(5) && player.has(7) ||
     
     //Rows
     player.has(1) && player.has(2) && player.has(3) ||
     player.has(4) && player.has(5) && player.has(6) ||
     player.has(7) && player.has(8) && player.has(9) ||
     
     //Cols
     player.has(1) && player.has(4) && player.has(7) ||
     player.has(2) && player.has(5) && player.has(8) ||
     player.has(3) && player.has(6) && player.has(9) ||
     
     //All Filled
     p1.size + p2.size >= 9
     ) return true;
     return false;
    }
    const evalWin = () => {
      return winCondition(p1) ||
      winCondition(p2);
    };
    
    useEffect(() => {
      evalWin();
    }, []);
    
    const fetchMoves = trpc.game.getMoves.useQuery({
      game_id: Number.parseInt(game)
    }, {
      onSuccess(data) {
        if (data) {
          setMoves(data.data);
          onMoveCapture();
          setP1Turn(!p1turn)
          setFetch(false);
          setTimeout(() => onMoveCapture(), 2000);
        }
      },
      enabled: fetch && interactive && !evalWin(),
      refetchInterval: 2000
  });

  const sendMoves = trpc.game.sendMove.useMutation();
  const handleSubmit = (e: number) => {
    console.log(session?.user.email)
    if (!session) return;
    sendMoves.mutate({
      cell: e,
      player_email: session.user.email as string,
      game_id: Number.parseInt(game),
      starting: player < 2
    });
  }

  const onMoveCapture = () => {
    if (!interactive) return;
    setFetch(true);
    if (!moves) return;
    for (let i = 0; i < moves.length; i++) {
     if (moves[i].starting_player) {
      p1.add(moves[i].square);
     } else {
      p2.add(moves[i].square);
     }
    }
    evalWin();
    
  }


  
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 grid-rows-3 gap-y-1 gap-x-1 w-[82vw] md:w-[58vw] lg:w-[43vw]">
        {
          cells.map((i, idx) => 
            <Cell
              key={idx} 
              value={i}
              disabled={!interactive || p1.has(i) || p2.has(i)}
              onClick={()=> {
                if (winCondition(p1) || winCondition(p2)) {
                  if (interactive) setInteractive(false);
                  //TOAST GAME WON
                  console.log("Game is over");
                  return;
                }

                if (p1turn && player == 1) {
                  if (p1.has(i)) return;
                  handleSubmit(i);
                  p1.add(i);
                } else if (!p1turn && player == 2) {
                  if (p2.has(i)) return;
                  handleSubmit(i)
                  p2.add(i);
                }
                setP1Turn(!p1turn);
              }}
              >
                
                <p className="text-8xl font-bold m-auto translate-y-1/4">
                  {p1.has(i)
                    ? "X"
                    : p2.has(i)
                    ? "O"
                    : ""
                  }
                </p>
                
              </Cell>
            )
        }
      </div>
    </div>
  )
}