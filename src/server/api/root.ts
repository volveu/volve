import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { npoRouter } from "./routers/npo";
import { activityRouter } from "./routers/activity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  npo: npoRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
