import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import prisma from "server/lib/prisma";



/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async () => {
  return {
    prisma: prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  return await createContextInner();
};

type Context = inferAsyncReturnType<typeof createContext>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: SuperJSON,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zod:
          error.cause instanceof ZodError
            ? error.cause.flatten().fieldErrors
            : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;