import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "./routers/user";
import { npoRouter } from "./routers/npo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  npo: npoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
