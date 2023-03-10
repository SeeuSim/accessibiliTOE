import { TRPCError } from "@trpc/server";
import prisma from "server/lib/prisma";
import { router, procedure } from "server/trpc";
import zod from "zod";

export const gameRouter = router({
  createGame: procedure
    .input(zod.object({
      email: zod.string(),
    }))
    .query( async ({ ctx, input: userObject }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: userObject.email
        }
      });

      if (!user) {
        console.log("No User")
        return null;
      }

      const game = await prisma.game.create({
        data: {
          players_joined: 1
        }
      });

      if (!game) {
        console.log("No Game")
        return null;
      }
      return {game_id: (game.id).toString(), players: game.players_joined.toString()};
    }),
  joinGame: procedure
    .input(zod.object({
      game_id: zod.number()
    }))
    .query( async ({ ctx, input: userObject }) => {
      const games = await prisma.game.findUnique({
        where: {
          id: userObject.game_id
        }
      });

      if (!games || games.players_joined == 2) return null;

      const updatedGame = await prisma.game.update({
        where: {
          id: games.id
        },
        data: {
          players_joined: 2
        }
      });

      return {game_id: (updatedGame.id).toString(), players: updatedGame.players_joined.toString()};
    }),
  proceedGame: procedure
    .input(zod.object({
      game_id: zod.number()
    }))
    .query(async({ctx, input: userObject}) => {
      const game = await prisma.game.findUnique({
        where: {
          id: userObject.game_id
        }
      });

      if (!game || game.players_joined < 2) return false;
      const updated = prisma.game.update({
        where: {
          id: game.id
        },
        data: {
          in_progress: true
        }
      });
      if (!updated) return false;
      return true;
    }),
    sendMove: procedure
      .input(zod.object({
        cell: zod.number(),
        player_email: zod.string(),
        game_id: zod.number(),
        starting: zod.boolean()
      }))
      .mutation(async({ctx, input: userObject}) => {
        const user = await prisma.user.findUnique({
          where: {
            email: userObject.player_email
          }
        })
        if (!user) return false;
        const moveIllegal = await prisma.move.count({
          where: {
            game_id: userObject.game_id
          }
        });
        if (moveIllegal >= 9) return false;
        const move = await prisma.move.create({
          data: {
            player_id: user.id,
            game_id: userObject.game_id,
            square: userObject.cell,
            starting_player: userObject.starting
          }
        });

        if (!move) return false;
        return true;
      }),
    getMoves: procedure
      .input(zod.object({
        game_id: zod.number()
      }))
      .query(async({ctx, input: userObject}) => {
        const moves = await prisma.move.findMany({
          where: {
            game_id: userObject.game_id
          }
        });

        if (!moves || !moves.length) return null;
        return {
          data: moves
        };
      }),
    getGames: procedure
      .input(zod.object({
        user_email: zod.string()
      }))
      .query(async({ctx, input: userObject}) => {
        const user = await prisma.user.findUnique({
          where: {
            email: userObject.user_email
          },
          include: {
            moves: true
          }
        });
        if (!user || !user.moves) return null;

        return { data: user.moves };
      }),
})