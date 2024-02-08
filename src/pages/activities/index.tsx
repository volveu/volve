import { useState } from "react";
import { PageLayout } from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import NPOCard from "../../components/NPOCard";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { NewNPOButton } from "../npo-management";

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="mt-12 flex flex-col items-center justify-around">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Filters />
        </div>
        <div className="m-auto mb-2 mt-7 flex w-[90vw] flex-row items-center justify-between text-[2rem] font-bold md:w-[50vw] md:max-w-xl">
          <h1>Activities</h1>
          {session?.user?.role === "ADMIN" && (
            <NewNPOButton
              onClick={() => {
                console.log("hh");
              }}
            />
          )}
        </div>
        <div className="mb-12 flex flex-col items-center justify-around gap-[20px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <NPOCard key={index} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Activities;

const Filters = () => {
  const { data: npoData } = api.npo.getAll.useQuery();
  return (
    <div className="mt-[12px] flex w-full flex-row gap-[12px]">
      <select className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <option selected>Any NPOs</option>
        {npoData?.map((npo) => <option key={npo.id}>{npo.name}</option>)}
      </select>
      <select className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <option selected>Open</option>
      </select>
      <select className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
        <option selected>This Month</option>
        <option>This Week</option>
      </select>
    </div>
  );
};
