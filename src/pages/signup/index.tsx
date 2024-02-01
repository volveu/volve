// dummy signup page -- ripped straight from https://flowbite.com/blocks/marketing/register/

import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { VolveLogo } from "~/assets/volve-logo";

const SignUp = () => {
  const { data: session } = useSession();

  const createMutation = api.user.create.useMutation({
    onError: (e) => {
      // follow convention to provide generic error message
      // to prevent malicious actors to derive db data (eg. email exists)
      toast.error("Failed to create account\n Please try again later");
    },
    onSuccess: () => {
      const DURATION_TO_LOAD = 1200;
      toast.success("Sign up successful, redirecting...", {
        duration: DURATION_TO_LOAD,
      });
      setTimeout(
        () => void signIn(undefined, { callbackUrl: "/" }),
        DURATION_TO_LOAD,
      );
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirm-password") as string;
    const role = data.get("role") as "USER" | "ADMIN";
    if (confirmPassword != password) {
      toast.error("Passwords do not match");
      return null;
    }
    const name = data.get("name") as string;
    createMutation.mutate({
      name,
      email,
      password,
      image: null,
      role,
    });
  }

  if (session && session.user)
    return (
      <>
        <Head>
          <title>SignUp</title>
        </Head>
        <PageLayout>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div>Logged in as: {session.user.email}</div>
            <div>
              To access the SignUp page,{" "}
              <button
                className="rounded-md px-1 text-neutral-400 underline"
                onClick={() => void signOut({ callbackUrl: "/sign-up" })}
              >
                log out
              </button>
            </div>
          </div>
        </PageLayout>
      </>
    );

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="mx-auto my-8 flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="flex w-full flex-col rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="py-3"></div>
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <VolveLogo height={50} />
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <span className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Select your role from the options below.
                  </span>
                  <select
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    name="role"
                  >
                    <option value="USER">Volunteer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <div className="py-3"></div>

                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    onClick={() => void signIn(undefined, { callbackUrl: "/" })}
                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default SignUp;
