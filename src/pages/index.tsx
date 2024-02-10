import { useSession } from "next-auth/react";
import Head from "next/head";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";

import { api } from "~/utils/api";
import { ActionButton } from "./activities/[id]";
import { LoadingSpinner } from "../components/Loading";
import ActivityCard from "../components/ActivityCard";

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = session?.user ? true : false;
  const { data: upcomingActivities, isLoading: isFetchingUpcomingActivities } =
    api.volunteerActivity.getOwnActivities.useQuery();
  const { data: allActivities, isLoading: isFetchingAllActivities } =
    api.activity.list.useQuery({});

  return (
    <>
      <Head>
        <title>Volve</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoggedIn ? (
        <PageLayout>
          <div className="m-auto max-w-[90vw]">
            <p className="pb-2 pt-10 text-xl font-bold tracking-tight text-white">
              Welcome {session?.user.name},
            </p>

            <figure className="mx-auto max-w-screen-md rounded-lg bg-slate-600 p-4 pt-5 text-center">
              <svg
                className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 14"
              >
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
              </svg>
              <blockquote>
                <p className="text-xl font-medium italic text-gray-900 dark:text-slate-100">
                  “The best way to find yourself is to lose yourself in the
                  service of others.”
                </p>
              </blockquote>
              <div className="py-2" />
              <figcaption className="mt-6 flex items-center justify-center space-x-3 rtl:space-x-reverse">
                <img
                  className="h-6 w-6 rounded-full"
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Mahatma_Gandhi_photo.jpg"
                  alt="profile picture"
                />
                <div className="flex items-center divide-x-2 divide-gray-500 rtl:divide-x-reverse dark:divide-gray-700">
                  <cite className="pe-3 font-medium text-gray-900 dark:text-slate-200">
                    Mahatma Gandhi
                  </cite>
                  <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                    Inspirational Figure
                  </cite>
                </div>
              </figcaption>
            </figure>

            <div className="mt-10">
              <p className="py-2 pt-10 text-2xl font-bold tracking-tight text-white">
                Your Upcoming Events
              </p>
              <div className="flex max-h-[50vh] flex-col gap-3 overflow-scroll">
                {isFetchingUpcomingActivities ? (
                  <LoadingSpinner />
                ) : upcomingActivities?.length ? (
                  upcomingActivities.map((activity) => (
                    <ActivityCard
                      key={activity.activity.id}
                      activity={activity.activity}
                    />
                  ))
                ) : (
                  <div className="my-2 rounded-md bg-slate-600 p-2 text-center text-sm lowercase text-slate-200 opacity-80">
                    seems like you have no upcoming activities
                  </div>
                )}
              </div>
            </div>

            <div className="py-2" />
            <div>
              <p className="py-2 pt-10 text-2xl font-bold tracking-tight text-white">
                Featured Opportunities
              </p>
              <div className="flex max-h-[500vh] flex-col gap-3 overflow-scroll">
                {isFetchingAllActivities ? (
                  <LoadingSpinner />
                ) : allActivities?.length ? (
                  allActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="my-2 rounded-md bg-slate-600 p-2 text-center text-sm lowercase text-slate-200 opacity-80">
                    seems like there is no upcoming activities
                  </div>
                )}
              </div>
            </div>
            <div className="py-10"></div>
          </div>
        </PageLayout>
      ) : (
        <PageLayout>
          <div className="flex min-h-[100vh] flex-col items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome to Volve
            </h1>
            <p className="py-4 text-center text-xl font-semibold text-white">
              Your superapp for all things volunteering!
            </p>
            <div className="flex gap-[50px] pt-5">
              <ActionButton
                text="Sign In"
                color="green"
                onClick={() => (window.location.href = "/signin")}
              />
              <ActionButton
                text="Sign Up"
                color="blue"
                onClick={() => (window.location.href = "/signup")}
              />
            </div>
          </div>
        </PageLayout>
      )}
    </>
  );
}
