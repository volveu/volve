import { useSession } from "next-auth/react";
import Head from "next/head";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";

import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Volve</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <h1 className="py-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Volve
        </h1>
        <p className="w-4/5">
          Volve is a volunteer management platform. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
        <h1>{session?.user.name ?? "not logged in"}</h1>
        <div className="py-4"></div>
        <button onClick={() => toast.error("rawr!")}>Boo!</button>
      </PageLayout>
    </>
  );
}
