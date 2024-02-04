import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  AuthOptions,
} from "next-auth";
import bcrypt from "bcrypt";

import { env } from "~/env";
import { db } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@prisma/client";
import type { UserRole } from "types";

export async function hashPassword(password: string) {
  const NUM_OF_SALT_ROUNDS = 10;
  return await bcrypt
    .genSalt(NUM_OF_SALT_ROUNDS)
    .then((salt) => bcrypt.hash(password, salt));
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      phoneNum: string | null;
      aboutMe: string | null;
      // ...other properties
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 }, // 1 day
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      // look up user from the credentials supplied inside authorize
      async authorize(credentials, req) {
        if (!req.body?.email || !req.body.password) return null;

        const { email, password } = req.body as {
          email: string;
          password: string;
        };

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user?.password) return null;
        if (user && bcrypt.compareSync(password, user.password)) {
          // Any object returned will be saved in the database
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userData } = user;
          // return { user: userData};
          return userData;
        }

        return null;
        // If you return null then an error will be displayed advising the user to check their details.
        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    signOut: "/signout",
  },
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      // user is ONLY provided on first time on sign in
      // https://next-auth.js.org/configuration/callbacks#jwt-callback
      //
      // session is data sent from client using useSession().update()
      if (trigger === "update") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const updatedToken = { ...token, ...session };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return updatedToken;
      }

      const newToken = { ...token, ...user };
      return newToken;
    },
    session: ({ session, token }) => {
      if (token !== null && token.id !== null) {
        const newUser = {
          ...session.user,
          ...token,
          id: token.id as string,
        };

        session = { ...session, user: newUser };
      }
      return session;
    },
    // async session({ session, user }) {
    //   session.user = user as User;
    //   return session;
    // },
  },
  events: {
    async signIn({ user }) {
      console.log({ user }, "signed in");
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
