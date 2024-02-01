import { signIn, getProviders, useSession, signOut } from "next-auth/react";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
// import { PeerPrepRectLogo } from "~/assets/logo";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoginWithCredentials from "~/components/LoginWithCredentials";
import { LoadingPage } from "~/components/Loading";
import { VolveLogo } from "~/assets/volve-logo";

// Signin page with credentials & oauth provider sign in
type SignInProps = InferGetServerSidePropsType<typeof getServerSideProps>;
const SignIn = ({ providers }: SignInProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    toast.error("test");
  }, []);
  const onError = (e: Error) => {
    toast.error(`Failed to sign in: \n${e.message}`);
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>SignIn</title>
        </Head>
        <PageLayout>
          <LoadingPage />
        </PageLayout>
      </>
    );
  }
  if (session && session.user) {
    return (
      <>
        <Head>
          <title>SignIn</title>
        </Head>
        <PageLayout>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div>Logged in as: {session.user.email}</div>
            <div>
              To access the SignIn page,{" "}
              <button
                className="rounded-md px-1 text-neutral-400 underline"
                onClick={() => void signOut({ callbackUrl: "/sign-in" })}
              >
                log out
              </button>
            </div>
          </div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="flex w-full flex-col rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="py-3"></div>
            {/* <PeerPrepRectLogo height={200} /> */}
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <VolveLogo height={50} />
              <div className="rounded-md">
                {providers &&
                  Object.values(providers)
                    .filter((provider) => provider.id != "credentials")
                    .map((provider) => {
                      return (
                        <div key={provider.name} style={{ marginBottom: 0 }}>
                          <button
                            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
                            onClick={() =>
                              void signIn(provider.id, { callbackUrl: "/" })
                            }
                          >
                            Sign in with {provider.name}
                          </button>
                        </div>
                      );
                    })}
              </div>
              <div className="py-4"></div>
              <LoginWithCredentials
                onError={onError}
                setIsLoading={setIsLoading}
              />

              <div className="pt-4" />
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don&quot;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default SignIn;
