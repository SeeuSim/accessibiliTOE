'use client'

import { useState } from "react";
import Cell from "./cell"

export function Board() {
  const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [p1turn, setP1Turn] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [p1, setP1] = useState(new Set<number>());
  const [p2, setP2] = useState(new Set<number>());
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
      player.has(3) && player.has(6) && player.has(9)
    ) return true;
    return false;
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
                  if (!interactive) setInteractive(false);
                  //TOAST GAME WON
                  console.log("Game is over");
                  return;
                }

                if (p1turn) {
                  if (p1.has(i)) return;
                  p1.add(i);
                } else if (!p1turn) {
                  if (p2.has(i)) return;
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