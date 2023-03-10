import prisma from "server/lib/prisma";
import zod from "zod";

const userRequestSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
});

export async function POST(req: Request) {
  const data = userRequestSchema.safeParse(JSON.parse(await req.text()));

  if (!data.success) return new Response("Unauthorised", {status: 400});
  
  const user = await prisma.user.findUnique({
    where: {
      email: data.data.email
    }
  });

  if (!user) return new Response("Unauthorised", {status: 400});

  const game = await prisma.game.create({
    data: {}
  });

  if (!game) return new Response("Error", {status: 500});

  return new Response(game.id.toString(), {status: 200, statusText: "OK"});
  
}