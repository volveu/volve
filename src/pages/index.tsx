import { useSession } from "next-auth/react";
import Head from "next/head";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";

import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Volve</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Volve
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
        <h1>{session?.user.name ?? "not logged in"}</h1>
        <div className="py-4"></div>
        <button
          onClick={() => {
            toast.success("clicked");
          }}
        >
          test
        </button>
      </PageLayout>
    </>
  );
}
