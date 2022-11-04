import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      select: {
        createdAt: true,
        description: true,
        user: true,
        id: true,
      },
    });
  }),

  getAccountPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      const getPosts = (id: string) =>
        ctx.prisma.post.findMany({
          where: {
            userId: id,
          },
          select: {
            createdAt: true,
            description: true,
            user: true,
            id: true,
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
        select: {
          createdAt: true,
          description: true,
          user: true,
          id: true,
        },
      });
    }),

  createPost: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          userId: ctx.session.user.id,
          description: input.description,
          // attachment: input.attachment,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),

  addToLib: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.user.update({
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
        return data;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Post alread in Library",
              cause: err,
            });
          }
        }
      }
    }),

  removeFromLib: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
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
