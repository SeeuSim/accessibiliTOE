import prisma from "server/lib/prisma";
import zod from "zod";

const gameIDSchema = zod.object({
  gameid: zod.number(),
  userid: zod.string()
})

export async function POST(req: Request) {
  
  const data = gameIDSchema.safeParse(JSON.parse(await req.text()));

  if (!data.success) return new Response("Bad Invocation", { status: 400 });

  const game = await prisma.game.findUnique({
    where: {
      id: data.data.gameid
    }, 
    select: {
      in_progress: true,
      players_joined: true
    }
  });

  if (!game) return new Response("Bad Invocation", { status: 400});

  const updatedgame = await prisma.game.update({
    where: {
      id: data.data.gameid
    },
    data: {
      players_joined: game.players_joined + 1
    }
  });

  return new Response("OK", { status: 200, statusText: JSON.stringify({in_progress: updatedgame.in_progress, players_joined: updatedgame.players_joined})});
}