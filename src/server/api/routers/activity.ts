import { revalidateTag } from "next/cache";
import { id_z } from "types";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
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

const tagSchema = z.object({
  title: nonEmptyString,
});

// TODO: will add extra schema for users and tags
const createActivitySchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  startTimestamp: nonEmptyDate,
  endTimestamp: nonEmptyDate,
  npoId: nonEmptyString,
  primaryContactInfo: nonEmptyString,
  tags: z.array(tagSchema).optional(),
  // optional, capacity should be non-negative
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

const updateTagsSchema = {
  added_tags: z.array(tagSchema).optional(),
  removed_tags: z.array(tagSchema).optional(),
};

const updateActivitySchema = createActivitySchema.extend(updateTagsSchema).partial().extend({
  id: nonEmptyString,
});

const userActivitySchema = z.object({
  activity_id: nonEmptyString,
});

// NOTE: might want to add pagination using take & skip
const getActivities = publicProcedure
  .input(getActivitiesSchema)
  .query(async ({ ctx, input }) => {
    const filter = { where: {}, include: {} };

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

    // tags filter
    const { tags } = input;
    filter.where = {
      ...filter.where,
      ...(tags && {
        tags: {
          hasEvery: tags, // need to test if it works
        }
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
    const { id, tags: _, added_tags, removed_tags, ...data } = input;

    await ctx.db.$transaction([
      ctx.db.activity.update({
        where: {
          id: id,
        },
        data: data,
        ...(data.npoId && {
          include: {
            npo: true
          }
        })
      }),
      ctx.db.activity.update({
        where: {
          id: id,
        },
        data: {
          ...(added_tags && {
            tags: {
              connectOrCreate: added_tags.map((tag) => ({
                where: tag,
                create: tag,
              })),
            },
          }),
        },
        include: {
          tags: true,
        }
      }),
      ctx.db.activity.update({
        where: {
          id: id,
        },
        data: {
          ...(removed_tags && {
            tags: {
              disconnect: removed_tags
            },
          }),
        },
        include: {
          tags: true,
        }
      }),
    ]);

    return ;
  });

// TODO: combine with tags
const createActivity = adminProcedure
  .input(createActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { tags, ...data} = input;
    const adminId = ctx.session.user.id;
    
    if (!adminId) {
      // Invalid RPC access
      return;
    }

    return ctx.db.activity.create({
      data: {
        ...data,
        createdByAdminId: adminId,
        // attach a tag to the activity, create if tag does not exist yet
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: tag,
            create: tag,
          }))
        }
      },
      include: {
        tags: true,
        createdByAdmin: true,
        npo: true,
      }
    });
  });

const attendActivity = protectedProcedure
  .input(userActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const user_id = ctx.session.user.id;
    const { activity_id } = input;
    return ctx.db.activity.update({
      where: { id: activity_id },
      data: {
        volunteers: {
          connect: { id: user_id },
        },
      },
      include: {
        volunteers: true,
      }
    });
  });

const unattendActivity = protectedProcedure
  .input(userActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const user_id = ctx.session.user.id;
    const { activity_id } = input;
    return ctx.db.activity.update({
      where: { id: activity_id },
      data: {
        volunteers: {
          disconnect: { id: user_id },
        },
      },
      include: {
        volunteers: true,
      }
    });
  });
