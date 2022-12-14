import { router, publicProcedure, protectedProcedure } from "../trpc";
import { string, z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";
import crypto from "crypto";

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
    .input(z.object({ description: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      console.log("these are the inputs", input);
      try {
        const result = ctx.prisma.post.create({
          data: {
            userId: ctx.session.user.id,
            description: input.description,
            // attachment: input.attachment,
          },
        });
        return result;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "post not created",
          cause: err,
        });
      }
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
        const result = await ctx.prisma.user.update({
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
        return result;
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
  createPresignedPost: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        // filetype: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createS3PresignPostRequest = async (
        filename: string
        // filetype: string
      ): Promise<string> => {
        const s3StorageLocation = "studyhub/";

        const generateParsableRandomName = (name: string) => {
          const randomString = crypto.randomBytes(6).toString("hex");
          return randomString.concat("|", name);
        };
        try {
          const result = await ctx.s3.getSignedUrlPromise("putObject", {
            Bucket: env.BUCKET_NAME,
            Key: s3StorageLocation.concat(generateParsableRandomName(filename)),
            Expires: 300, // 5 minutes
          });
          return result;
        } catch (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate upload url",
            cause: err,
          });
        }
      };
      return createS3PresignPostRequest(input.filename);
      // input.filetype;
    }),
});
