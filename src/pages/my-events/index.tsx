import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PageLayout } from "~/components/Layout";
import { signIn, useSession } from "next-auth/react";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import Link from "next/link";
import type { UserRole } from "types";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import ActivityCard from "~/components/ActivityCard";

const MyEvents: NextPage = () => {
  // session is `null` until nextauth fetches user's session data
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn();
    },
  });

  const { data: upcomingActivities, isLoading: isLoadingUpcomingActivities } =
    api.volunteerActivity.getOwnActivities.useQuery();
  const { data: usrData, isLoading: isLoadingUserData } =
    api.user.getUserByID.useQuery(
      { id: session?.user?.id ?? "" },
      { enabled: session?.user?.id != undefined && session?.user?.id != "" },
    );

  if (isLoadingUserData || isLoadingUpcomingActivities) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <PageLayout>
          <LoadingPage />
        </PageLayout>
      </>
    );
  }

  if (!session?.user?.id || !usrData) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <PageLayout>
          <div className="p-4">
            Sorry we are experiencing some issues loading the user, please try
            again later
          </div>
        </PageLayout>
      </>
    );
  }

  const {
    name,
    email,
    role,
    aboutMe,
    phoneNum,
    image: imageURL,
    id: userId,
  } = usrData;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="py-6" />
        <div className="p-3">
          <p className="py-2 text-2xl font-bold tracking-tight text-white">
            Your Upcoming Events
          </p>
          <div className="flex max-h-[50vh] flex-col gap-3 overflow-scroll">
            {isLoadingUpcomingActivities ? (
              <LoadingSpinner />
            ) : upcomingActivities?.length ? (
              upcomingActivities.map((a) => (
                <ActivityCard key={a.activity.id} activity={a.activity} />
              ))
            ) : (
              <div className="my-2 rounded-md bg-slate-600 p-2 text-center text-sm lowercase text-slate-200 opacity-80">
                seems like you have no upcoming activities
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default MyEvents;
