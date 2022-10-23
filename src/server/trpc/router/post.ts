import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getAccountPosts: publicProcedure
    .input(z.object({ id: z.string().min(3) }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findMany({
        where: {
          userId: input.id,
        },
      });
    }),

  getLibrary: publicProcedure
    .input(z.object({ id: z.string().min(3) }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findMany({
        where: {
          libUser: {
            some: {
              userId: input.id,
            },
          },
        },
      });
    }),
});
