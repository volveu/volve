import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const npoCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  logo: z.string().optional(),
  website: z.string().optional(),
});

const npoGetSchema = z.object({
  id: z.string(),
});

const npoUpdateSchema = npoCreateSchema.partial().extend({
  id: z.string(),
});

export const npoRouter = createTRPCRouter({
  create: adminProcedure
    .input(npoCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.npo.create({
        data: input,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.npo.findMany();
  }),

  get: publicProcedure.input(npoGetSchema).query(async ({ ctx, input }) => {
    // Not sure how to handle error when id is not found
    return ctx.db.npo.findFirstOrThrow({
      where: {
        id: {
          equals: input.id,
        },
      },
    });
  }),

  update: adminProcedure
    .input(npoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: npoId, ...npoData } = input;

      return ctx.db.npo.update({
        where: {
          id: npoId,
        },
        data: npoData,
      });
    }),
});
