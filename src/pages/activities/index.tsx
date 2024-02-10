import { useEffect, useState } from "react";
import { PageLayout } from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { NewNPOButton } from "../npo-management";
import { LoadingPage } from "../../components/Loading";
import ActivityModal from "../../components/modals/ActivityModal";
import ActivityCard from "../../components/ActivityCard";
import Pagination from "../../components/Pagination";
import dayjs from "dayjs";
import { type Activity } from "@prisma/client";

interface Filter {
  tag: string;
  npo: string;
  status: string;
}

const Activities = () => {
  const ENTRIES_PER_PAGE = 10;
  const {
    data: activities,
    isLoading,
    refetch: refetchActivities,
  } = api.activity.list.useQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filter>({
    tag: "",
    npo: "",
    status: "Open",
  });
  const [activitiesFiltered, setActivitiesFiltered] = useState<Activity[]>([]);

  useEffect(() => {
    if (!activities) return;
    setActivitiesFiltered(
      activities.filter((activity) => {
        const isAfterCurrentTime = dayjs(activity.startTimestamp).isAfter(
          dayjs(),
        );
        const isBeforeCurrentTime = dayjs(activity.startTimestamp).isBefore(
          dayjs(),
        );

        return (
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filters.tag === "" ||
            filters.tag === "All tags" ||
            activity.tags.reduce(
              (acc, tag) => acc || tag.title === filters.tag,
              false,
            )) &&
          (filters.npo === "" ||
            filters.npo === "Any NPOs" ||
            activity.npo.name === filters.npo) &&
          (filters.status === "" ||
            (filters.status === "Open" && isAfterCurrentTime) ||
            (filters.status === "Closed" && isBeforeCurrentTime))
        );
      }),
    );
    setTotalPages(Math.ceil(activitiesFiltered.length / ENTRIES_PER_PAGE));
  }, [activities, activitiesFiltered.length, filters, searchTerm]);

  const onEdit = (id: string) => {
    setIsEdit(true);
    setModalOpen(true);
    setId(id);
  };

  const handleCreate = () => {
    setIsEdit(false);
    setModalOpen(true);
  };

  const setModalAndRefetch = async (open: boolean) => {
    setModalOpen(open);
    await refetchActivities();
  };
  return (
    <PageLayout>
      <ActivityModal
        showModal={modalOpen}
        setShowModal={setModalAndRefetch}
        isEdit={isEdit}
        id={id}
      />
      <div className="flex flex-col items-center">
        <div className="mt-12 flex flex-col items-center justify-around">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        <div className="m-auto mb-2 mt-7 flex w-[90vw] flex-row items-center justify-between text-[2rem] font-bold md:w-[50vw] md:max-w-xl">
          <h1>Activities</h1>
          {session?.user?.role === "ADMIN" && (
            <NewNPOButton onClick={handleCreate} />
          )}
        </div>
        <div className="mb-12 flex flex-col items-center justify-around gap-[20px]">
          {activities
            ? activitiesFiltered.map((activity, index) => (
                <ActivityCard
                  key={index}
                  activity={activity}
                  onEdit={() => onEdit(activity.id)}
                />
              ))
            : null}
          {isLoading && <LoadingPage />}
          {activitiesFiltered.length === 0 && !isLoading && (
            <p className="pt-20">No activities found</p>
          )}
        </div>
        <div className="py-6" />
        {!isLoading && activitiesFiltered.length > 0 && (
          <Pagination
            currPage={currPage}
            totalPages={totalPages}
            setCurrPage={setCurrPage}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Activities;

const Filters = ({
  filters,
  setFilters,
}: {
  filters: Filter;
  setFilters: (filter: Filter) => void;
}) => {
  const { data: npoData } = api.npo.getAll.useQuery();
  const { data: tags } = api.activity.tags.useQuery();
  return (
    <div className="mt-[12px] flex w-full flex-row gap-[12px]">
      <select
        onChange={(e) => setFilters({ ...filters, npo: e.target.value })}
        className="block max-w-[125px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option selected={filters.npo === "" || filters.npo === "Any NPOs"}>
          Any NPOs
        </option>
        {npoData?.map((npo) => (
          <option key={npo.id} selected={npo.id === filters.npo}>
            {npo.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option selected={filters.status === "Open"}>Open</option>
        <option selected={filters.status === "Closed"}>Closed</option>
      </select>
      <select
        onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        className="block max-w-[125px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option selected={filters.tag === "" || filters.tag === "All tags"}>
          All tags
        </option>
        {tags?.map((tag) => (
          <option key={tag.title} selected={filters.tag === tag.title}>
            {tag.title}
          </option>
        ))}
      </select>
    </div>
  );
};
