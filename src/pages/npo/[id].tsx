import { useRouter } from "next/router";
import { PageLayout } from "../../components/Layout";
import { api } from "../../utils/api";
import { LoadingPage } from "../../components/Loading";
import { useEffect } from "react";
import { VisitNPOButton } from "../npo-management";

const Npo = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const { data, isLoading, isError } = api.npo.get.useQuery({
    id: id ?? "",
  });

  return (
    <PageLayout>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="mt-[50px] flex flex-wrap items-center justify-around gap-4">
          <img
            className="shadow-blue-gray-900/50 h-full w-auto max-w-[19rem] rounded-lg object-cover object-center shadow-xl"
            src={
              data?.logo && data?.logo?.length > 0
                ? data?.logo
                : "https://www.gospel360.org/wp-content/uploads/2022/09/placeholder-16.png"
            }
            alt={data?.name}
          />
          <div className="flex min-w-[300px] max-w-[50%] flex-col gap-5">
            <h1 className="text-5xl font-medium leading-tight">{data?.name}</h1>
            <p>{data?.description}</p>
            {data?.website && (
              <div className="w-30">
                <VisitNPOButton webLink={data?.website} />
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Npo;
