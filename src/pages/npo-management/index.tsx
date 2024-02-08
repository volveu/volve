import { useSession } from "next-auth/react";
import { PageLayout } from "../../components/Layout";
import { LoadingPage } from "../../components/Loading";
import Pagination from "../../components/Pagination";
import NpoModal from "../../components/modals/NpoModal";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import SearchBar from "../../components/SearchBar";
import EditButton from "../../components/EditButton";

const NpoManagement = () => {
  const ENTRIES_PER_PAGE = 10;
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: npoData,
    isLoading,
    refetch: refetchNPOs,
  } = api.npo.getAll.useQuery();

  useEffect(() => {
    if (!npoData) return;
    setTotalPages(Math.ceil(npoData.length / ENTRIES_PER_PAGE));
  }, [npoData]);

  const handleEdit = (currId: string) => {
    setIsEdit(true);
    setShowModal(true);
    setId(currId);
  };

  const handleCreate = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const setModalAndRefetch = async (open: boolean) => {
    setShowModal(open);
    await refetchNPOs();
  };

  return (
    <PageLayout>
      <NpoModal
        showModal={showModal}
        setShowModal={setModalAndRefetch}
        isEdit={isEdit}
        id={id}
      />
      <div className="flex flex-col items-center">
        <div className="mb-[40px] mt-12 flex flex-col items-center justify-around">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="py-1" />
        <div className="flex w-[90vw] flex-row items-baseline justify-between text-[2rem] font-bold md:w-[50vw] md:max-w-xl">
          <h1>NPOs</h1>
          {session?.user?.role === "ADMIN" && (
            <NewNPOButton onClick={handleCreate} />
          )}
        </div>
        <div className="py-2" />
        <div className="mt-[10px] flex min-h-screen flex-col items-center gap-[30px]">
          {isLoading ? (
            <LoadingPage />
          ) : (
            npoData
              ?.filter((npo) =>
                searchTerm
                  ? npo.name.toLowerCase().includes(searchTerm.toLowerCase())
                  : true,
              )
              .slice(
                (currPage - 1) * ENTRIES_PER_PAGE,
                currPage * ENTRIES_PER_PAGE,
              )
              .map((npo) => (
                <NPOCard
                  key={npo.id}
                  id={npo.id}
                  title={npo.name}
                  body={npo.description}
                  logoLink={npo.logo}
                  webLink={npo.website}
                  onEdit={() => handleEdit(npo.id)}
                />
              ))
          )}
          {!isLoading && npoData?.length === 0 && <p>No NPOs found</p>}
        </div>
        <div className="py-6" />
        <Pagination
          currPage={currPage}
          totalPages={totalPages}
          setCurrPage={setCurrPage}
        />
      </div>
    </PageLayout>
  );
};
export default NpoManagement;

const NPOCard = ({
  title,
  id,
  body,
  webLink,
  logoLink,
  onEdit,
}: {
  title: string;
  id: string;
  body: string;
  webLink: string | null;
  logoLink: string | null;
  onEdit: () => void;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleViewNPO = () => router.push(`npo/${id}`);
  const openWebsite = (site: string) => window.open(site, "_blank");
  return (
    <div className="relative flex w-[90vw] flex-row items-center gap-4 rounded-2xl bg-white p-4 sm:p-6 md:w-[50vw] md:max-w-xl md:flex-row dark:bg-neutral-700">
      <div className="hidden h-36 w-36 flex-shrink-0 flex-grow-0 overflow-hidden rounded-2xl bg-slate-100 sm:block">
        {/* using img cos need to configure Next to accept specific domains but not sure which domains these are coming from */}
        {/* eslint-disable-next-line @next/next/no-img-element  */}
        <img
          className="h-full w-full cursor-pointer rounded-t-lg object-contain hover:opacity-90"
          src={
            logoLink ??
            "https://www.gospel360.org/wp-content/uploads/2022/09/placeholder-16.png"
          }
          onClick={handleViewNPO}
          alt="logo-link"
        />
      </div>

      <div className="flex h-36 w-full flex-col justify-start gap-4 px-3">
        <div className="flex flex-row items-baseline justify-start gap-2">
          <h6
            onClick={handleViewNPO}
            className="cursor-pointer text-xl font-medium text-neutral-800 hover:opacity-90 dark:text-neutral-50"
          >
            {title}
          </h6>
          {webLink && (
            <div
              className="cursor-pointer rounded-md text-xs text-neutral-400 underline"
              onClick={() => openWebsite(webLink)}
            >
              website
            </div>
          )}
        </div>
        <p className="h-full overflow-auto text-sm text-neutral-600 md:max-h-[15vw] md:min-h-[5vw] dark:text-neutral-200">
          {body}
        </p>
        {/* {webLink && <VisitNPOButton webLink={webLink} />} */}
        {session && session.user && session.user.role === "ADMIN" && (
          <EditButton onEdit={onEdit} />
        )}
      </div>
    </div>
  );
};

export const NewNPOButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-emerald-600 px-4 py-1 text-sm font-semibold text-white hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus-circle-fill mr-[5px]"
          viewBox="0 0 20 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
        </svg>
        create new
      </button>
    </>
  );
};

export const VisitNPOButton = ({ webLink }: { webLink: string }) => {
  return (
    <button
      type="button"
      onClick={() => window.open(webLink, "_blank")}
      className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      Visit NPO
      <svg
        className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </button>
  );
};
