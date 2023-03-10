import { router, procedure } from "server/trpc";
import zod from "zod";
import { gameRouter } from "./game";

export const appRouter = router({
  hello: procedure
          .input(zod.string().optional())
          .query(async ({ ctx, input: id }) => {
            return null;
          }),
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;