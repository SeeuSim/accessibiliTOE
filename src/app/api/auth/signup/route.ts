import prisma from "server/lib/prisma";
import zod from "zod";

const signupSchema = zod.object({
  email: zod.string(),
  name: zod.string()
});

export async function POST(req: Request) {

  const data = signupSchema.safeParse(JSON.parse(await req.text()));
  if (!data.success) return new Response("INVALID FORM", {
    status: 400
  });
  const user = await prisma.user.create({
    data: {
      name: data.data.name,
      email: data.data.email
    }
  });

  ///
  if (!user) return new Response("Internal Server Error - Could not create USER", {
    status: 500
  });

  return new Response("", {
    status: 200
  });
}