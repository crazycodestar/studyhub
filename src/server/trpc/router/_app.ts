// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
