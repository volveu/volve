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

const MyEvents: NextPage = () => {
  // session is `null` until nextauth fetches user's session data
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn();
    },
  });

  if (!session) {
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

  const userData = session.user as {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    aboutMe: string | null;
    phoneNum: string | null;
    image: string | null;
  };

  const { name, email, role, aboutMe, phoneNum, image: imageURL } = userData;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div>my events</div>;
      </PageLayout>
    </>
  );
};

export default MyEvents;
