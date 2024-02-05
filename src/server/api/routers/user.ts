import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { hashPassword } from "~/server/auth";
import { db } from "~/server/db";
import { email_z, id_z, image_z, name_z, password_z, user_z } from "types";
import { contextProps } from "@trpc/react-query/shared";

const userCreateInput_z = user_z.pick({
  name: true,
  aboutMe: true,
  image: true,
  email: true,
  phoneNum: true,
  password: true,
  role: true,
});
const userUpdateInfoInput_z = user_z
  .omit({
    password: true,
    role: true,
  })
  .extend({ id: id_z });

const userUpdatePasswordInput_z = user_z.pick({ id: true, password: true });

export const userRouter = createTRPCRouter({
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
});
