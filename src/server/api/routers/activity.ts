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

const updateActivitySchema = createActivitySchema
  .extend(updateTagsSchema)
  .extend({ isVisible: z.boolean() })
  .partial()
  .extend({
    id: nonEmptyString,
  });

const user_volunteerActivitySchema = z.object({
  activity_id: nonEmptyString,
});

const admin_updateVolunteerActivitySchema = user_volunteerActivitySchema.extend(
  {
    hoursPut: z.number().nonnegative().optional(),
    user_id: nonEmptyString,
  },
);

const admin_createVolunteerActivitySchema = user_volunteerActivitySchema.extend(
  {
    user_id: nonEmptyString,
  },
);

const admin_deleteVolunteerActivitySchema = user_volunteerActivitySchema.extend(
  {
    user_id: nonEmptyString,
  },
);

const admin_listVolunteerActivitySchema = user_volunteerActivitySchema.extend({
  user_id: nonEmptyString
}).partial();

// NOTE: might want to add pagination using take & skip
const getActivities = publicProcedure
  .input(getActivitiesSchema)
  .query(async ({ ctx, input }) => {
    const filter = {
      where: {},
      include: {
        tags: true,
        npo: true,
        volunteers: true,
        createdByAdmin: true,
      },
    };

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
        },
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
      include: {
        tags: true,
        npo: true,
        volunteers: true,
        createdByAdmin: true,
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
      }),
      ctx.db.activity.update({
        where: {
          id: id,
        },
        data: {
          ...(removed_tags && {
            tags: {
              disconnect: removed_tags,
            },
          }),
        },
      }),
    ]);

    return;
  });

const createActivity = adminProcedure
  .input(createActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { tags, ...data } = input;
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
          })),
        },
      },
      include: {
        tags: true,
        createdByAdmin: true,
        npo: true,
      },
    });
  });

const attendActivity = protectedProcedure
  .input(user_volunteerActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const user_id = ctx.session.user.id;
    const { activity_id } = input;

    if (!user_id) {
      // Invalid RPC access
      return;
    }

    return ctx.db.volunteerActivity.create({
      data: {
        volunteerId: user_id,
        activityId: activity_id,
      },
    });
  });

const unattendActivity = protectedProcedure
  .input(user_volunteerActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const user_id = ctx.session.user.id;
    const { activity_id } = input;

    if (!user_id) {
      // Invalid RPC access
      return;
    }

    return ctx.db.volunteerActivity.delete({
      where: {
        volunteerId_activityId: {
          volunteerId: user_id,
          activityId: activity_id,
        },
      },
    });
  });

const getOwnVolunteerActivity = protectedProcedure.input(user_volunteerActivitySchema).query(async ({ ctx, input }) => {
  const user_id = ctx.session.user.id;
  const { activity_id } = input;

  if (!user_id) {
    // Invalid RPC access
    return;
  }

  return ctx.db.volunteerActivity.findUniqueOrThrow({
    where: {
      volunteerId_activityId: {
        volunteerId: user_id,
        activityId: activity_id,
      },
    },
    include: {
      activity: true,
    },
  });
});

const getOwnVolunteerActivities = protectedProcedure.query(async ({ ctx }) => {
  const user_id = ctx.session.user.id;

  if (!user_id) {
    // Invalid RPC access
    return;
  }

  return ctx.db.volunteerActivity.findMany({
    where: {
      volunteerId: user_id,
    },
    include: {
      activity: true,
    },
  });
});

const updateVolunteerActivity = adminProcedure
  .input(admin_updateVolunteerActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { activity_id, user_id, hoursPut } = input;

    return ctx.db.volunteerActivity.update({
      where: {
        volunteerId_activityId: {
          volunteerId: user_id,
          activityId: activity_id,
        },
      },
      data: {
        hoursPut,
      },
    });
  });

const createVolunteerActivity = adminProcedure
  .input(admin_createVolunteerActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { activity_id, user_id } = input;

    return ctx.db.volunteerActivity.create({
      data: {
        volunteerId: user_id,
        activityId: activity_id,
      },
    });
  });

const deleteVolunteerActivity = adminProcedure
  .input(admin_deleteVolunteerActivitySchema)
  .mutation(async ({ ctx, input }) => {
    const { activity_id, user_id } = input;

    return ctx.db.volunteerActivity.delete({
      where: {
        volunteerId_activityId: {
          volunteerId: user_id,
          activityId: activity_id,
        },
      },
    });
  });

const listVolunteerActivity = adminProcedure.input(
  admin_listVolunteerActivitySchema
).query(async ({ ctx, input }) => {
  const { activity_id, user_id } = input;

  return ctx.db.volunteerActivity.findMany({
    where: {
      ...(activity_id && {
        activityId: activity_id,
      }),
      ...(user_id && {
        userId: user_id,
      }),
    },
  });
});

export const activityRouter = createTRPCRouter({
  create: createActivity,
  get: getActivity,
  list: getActivities,
  update: updateActivity,
  delete: deleteActivity,
  attend: attendActivity,
  unattend: unattendActivity,
});

export const volunteerActivityRouter = createTRPCRouter({
  getOwnActivity: getOwnVolunteerActivity,
  getOwnActivities: getOwnVolunteerActivities,
  create: createVolunteerActivity,
  list: listVolunteerActivity,
  update: updateVolunteerActivity,
  delete: deleteVolunteerActivity
});
