import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rootProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { hashPassword } from "~/server/auth";
import { db } from "~/server/db";
import { email_z, id_z, image_z, name_z, password_z, user_z } from "types";
import { contextProps } from "@trpc/react-query/shared";

import { generateReport } from "~/server/util/report";

const userCreateInput_z = user_z
  .pick({
    name: true,
    aboutMe: true,
    image: true,
    email: true,
    phoneNum: true,
    password: true,
    role: true,
  })
  .extend({ password: z.string() });

const userUpdateInfoInput_z = user_z
  .omit({
    password: true,
    role: true,
  })
  .extend({ id: id_z });

const userUpdatePasswordInput_z = z.object({
  id: z.string().min(1),
  password: z.string().min(1),
});

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      select: { id: true, name: true, email: true, role: true, phoneNum: true },
    });
    return users;
  }),
  getHoursVolunteered: protectedProcedure
    .input(z.object({ id: id_z }))
    .query(async ({ ctx, input }) => {
      // TODO: @dasco add logic to get hours volunteered
      return 10;
    }),
  getUserNPOParticipationCount: protectedProcedure
    .input(z.object({ id: id_z }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          enrolledActivities: {
            select: { npoId: true },
          },
        },
      });
      if (data === null) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }

      const npoIds = data.enrolledActivities;
      const uniqueNpoCount = new Set(npoIds).size;
      return uniqueNpoCount;
    }),
  create: publicProcedure
    .input(userCreateInput_z)
    .mutation(async ({ ctx, input }) => {
      const { password, role, ...values } = input;
      const passwordHash = await hashPassword(password);
      try {
        await ctx.db.user.create({
          data: {
            role: role ?? undefined,
            ...values,
            password: passwordHash,
          },
        });
      } catch (e) {
        // throws generic error to prevent malicious actors from
        // determining which emails are in the databse
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred. Please try again later.",
        });
      }
    }),

  deleteUserByID: protectedProcedure
    .input(z.object({ id: id_z }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(userUpdateInfoInput_z)
    .mutation(async ({ ctx, input }) => {
      const { id, ...otherDetails } = input;
      await ctx.db.user.update({
        where: { id: id },
        data: otherDetails,
      });
    }),

  updatePassword: protectedProcedure
    .input(userUpdatePasswordInput_z)
    .mutation(async ({ ctx, input }) => {
      const { id, password } = input;
      const passwordHash = await hashPassword(password);
      await ctx.db.user.update({
        where: { id: id },
        data: { password: passwordHash },
      });
    }),

  promoteToAdmin: rootProcedure
    .input(z.object({ id: id_z }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.db.user.findFirst({
        where: { id: id },
        select: { role: true },
      });
      if (user?.role === "ADMIN") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already an admin",
        });
      }

      await ctx.db.user.update({
        where: { id: id },
        data: { role: "ADMIN" },
      });
    }),

  demoteAdmin: rootProcedure
    .input(z.object({ id: id_z }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.db.user.findFirst({
        where: { id: id },
        select: { role: true },
      });
      if (user?.role === "USER") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not an admin",
        });
      }

      await ctx.db.user.update({
        where: { id: id },
        data: { role: "USER" },
      });
    }),

  getPersonalReport: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    return generateReport(user.name!, 10, []);
  }),
});
