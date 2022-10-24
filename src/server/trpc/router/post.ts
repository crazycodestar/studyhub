import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getAccountPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      const getPosts = (id: string) =>
        ctx.prisma.post.findMany({
          where: {
            userId: id,
          },
        });

      return getPosts(input.id);
    }),

  getLibrary: publicProcedure
    .input(z.object({ id: z.string() }))
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

  createPost: protectedProcedure
    .input(
      z.object({ description: z.string().nullish(), attachment: z.string() })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          userId: ctx.session.user.id,
          description: input.description,
          attachment: input.attachment,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),

  addToLib: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          library: {
            create: {
              postId: input.postId,
            },
          },
        },
      });
    }),

  removeFromLib: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          library: {
            delete: {
              postId_userId: {
                postId: input.postId,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),
});
