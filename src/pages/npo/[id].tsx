import { useRouter } from "next/router";
import { PageLayout } from "../../components/Layout";
import { api } from "../../utils/api";
import { LoadingPage } from "../../components/Loading";
import { VisitNPOButton } from "../npo-management";

const Npo = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const { data, isLoading, isError } = api.npo.get.useQuery({
    id: id ?? "",
  });

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingPage />
      </PageLayout>
    );
  }
  if (!data) {
    return (
      <PageLayout>
        <div>No data</div>
      </PageLayout>
    );
  }
  const { name: title, description, logo, website } = data;
  const openWebsite = (site: string) => window.open(site, "_blank");

  return (
    <PageLayout>
      <div className="py-4" />
      <div className="px-2">
        <div className="flex flex-row items-start justify-start gap-4">
          <div className="h-24 w-24 flex-shrink-0 flex-grow-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-48 sm:w-48">
            {/* using img cos need to configure Next to accept specific domains but not sure which domains these are coming from */}
            {/* eslint-disable-next-line @next/next/no-img-element  */}
            <img
              className="h-full w-full rounded-t-lg object-contain hover:opacity-90"
              src={
                logo ??
                "https://www.gospel360.org/wp-content/uploads/2022/09/placeholder-16.png"
              }
              alt={title}
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-3xl font-medium text-neutral-800 hover:opacity-90 dark:text-neutral-50">
              {title}
            </h1>
            {website && (
              <div
                className="text-md cursor-pointer rounded-md text-neutral-400 underline"
                onClick={() => openWebsite(website)}
              >
                website link
              </div>
            )}
          </div>
        </div>
        <div className="py-4" />

        <div className="">
          <div className="text-slate-200">Description</div>
          <p className="text-md overflow-auto rounded-xl border border-slate-500 p-4 text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        </div>
        <div className="py-4" />

        <div className="text-slate-200">Opportunities</div>
        {/* TODO: List activities linked to the NPO in cards for public to view the page and see */}
        {/* or if simple and no time redirect to search activities page */}
      </div>
    </PageLayout>
  );
};

export default Npo;
