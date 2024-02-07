import { id_z } from "types";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const nonEmptyString = z.string().refine((value) => value.trim() !== "", {
  message: "Value must be a non-empty string",
});

const nonEmptyDate = z
  .date()
  .refine((value) => value !== null && value !== undefined, {
    message: "Value must be a non-empty datetime",
  });

// TODO: will add extra schema for users and tags
const createActivitySchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  startTimestamp: nonEmptyDate,
  endTimestamp: nonEmptyDate,
  npoId: nonEmptyString,
  primaryContactInfo: nonEmptyString,
  createdByAdminId: nonEmptyString,
  // optional, capacity should be non-nengative
  capacity: z.number().nonnegative().optional(),
});

const deleteActivitySchema = z.object({
  id: nonEmptyString,
});

const getActivitiesSchema = createActivitySchema.partial().extend({
  search_term: z.string().optional(),
});

const getActivitySchema = z.object({
  id: nonEmptyString,
});

const updateActivitySchema = createActivitySchema.partial().extend({
  id: nonEmptyString,
});

// NOTE: might want to add pagination using take & skip
const getActivities = publicProcedure
  .input(getActivitiesSchema)
  .query(async ({ ctx, input }) => {
    const filter = { where: {} };

    // title & description filter
    const { search_term: terms } = input;
    filter.where = {
      ...filter.where,
      ...(terms && {
        OR: [
          {
            title: {
              contains: terms,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: terms,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    // NPO filter
    const { npoId: id } = input;
    filter.where = {
      ...filter.where,
      ...(id && {
        npoId: id,
      }),
    };

    // timestamp filter
    const { startTimestamp: start, endTimestamp: end } = input;
    filter.where = {
      ...filter.where,
      ...(start &&
        end && {
          OR: [
            {
              startTimestamp: {
                gte: start,
                lte: end,
              },
            },
            {
              endTimestamp: {
                gte: start,
                lte: end,
              },
            },
          ],
        }),
    };

    return ctx.db.activity.findMany(filter);
  });

const getActivity = publicProcedure
  .input(getActivitySchema)
  .query(async ({ ctx, input }) => {
    return ctx.db.activity.findFirstOrThrow({
      where: {
        id: input.id,
      },
    });
  });

const deleteActivity = adminProcedure
  .input(deleteActivitySchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.activity.delete({
      where: {
        id: input.id,
      },
    });
  });

// TODO: combine with tags & users
const updateActivity = adminProcedure
  .input(updateActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { id: id, ...data } = input;

    return ctx.db.activity.update({
      where: {
        id: id,
      },
      data: data,
    });
  });

// TODO: combine with tags & users
const createActivity = adminProcedure
  .input(createActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const data = input;

    return ctx.db.activity.create({
      data: data
    });
  });


