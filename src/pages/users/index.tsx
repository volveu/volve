import { useSession } from "next-auth/react";
import { PageLayout } from "../../components/Layout";
import { LoadingPage } from "../../components/Loading";
import Pagination from "../../components/Pagination";
// import NpoModal from "./npo-modal";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const Users = () => {
  const { data: session } = useSession();
  const { mutate: promoteToAdmin, variables: x } =
    api.user.promoteToAdmin.useMutation({
      onSuccess: () => {
        toast.success(`User promoted to admin, refresh page to view changes`);
      },
      onError: (e) => {
        toast.error(`Failed to promote user to admin`);
        console.error(e);
      },
    });
  const { mutate: demoteAdmin } = api.user.demoteAdmin.useMutation({
    onSuccess: () => {
      toast.success(`Admin demoted to user, refresh page to view changes`);
    },
    onError: (e) => {
      toast.error(`Failed to demote admin`);
      console.error(e);
    },
  });
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersData, isLoading } = api.user.getAll.useQuery();
  const filteredUsers = usersData?.filter(
    (u) =>
      !searchTerm ||
      u.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      u.phoneNum
        ?.replaceAll(" ", "")
        .toLowerCase()
        .startsWith(searchTerm.replaceAll(" ", "").toLowerCase()),
  );
  // .filter((u) => !roleFilter || u.role == roleFilter);
  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="mt-12 flex grow flex-col items-start justify-around">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="w-[90vw] text-[2rem] font-bold md:w-[50vw]">
            <h1>Users</h1>
          </div>
          <div className="py-1" />
          {isLoading ? (
            <LoadingPage />
          ) : (
            <>
              <table className="w-full text-left text-sm text-gray-500 dark:text-slate-300">
                <thead className="dark:text-slate-200">
                  <tr>
                    <th scope="col" className="w-auto pr-3">
                      Name
                    </th>
                    <th scope="col" className="w-auto pr-3">
                      Role
                    </th>
                    <th scope="col" className="w-auto pr-3">
                      Email
                    </th>
                    <th scope="col" className="w-auto pr-3">
                      Phone
                    </th>
                    <th scope="col" className="w-auto"></th>
                  </tr>
                </thead>
                <tbody className="space-y-6 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  {filteredUsers?.map((u) => (
                    <tr key={u.id}>
                      <td className="w-auto max-w-[5rem] overflow-hidden overflow-ellipsis whitespace-nowrap pr-3">
                        {u.name}
                      </td>
                      <td className="w-auto pr-3">
                        {u.role === "ADMIN" ? (
                          <div className="inline-block w-[3rem] rounded bg-gray-200 px-2 text-center text-xs text-blue-600">
                            admin
                          </div>
                        ) : (
                          <div className="inline-block w-[3rem] rounded bg-gray-700 px-2 text-center text-xs text-slate-300">
                            user
                          </div>
                        )}
                      </td>
                      <td className="w-auto max-w-[7rem] overflow-hidden overflow-ellipsis whitespace-nowrap pr-3">
                        {u.email}
                      </td>
                      <td className="w-auto max-w-[3rem] overflow-hidden overflow-ellipsis whitespace-nowrap pr-3">
                        {u.phoneNum}
                      </td>
                      <td className="w-auto text-right">
                        {u.role === "USER" ? (
                          <button
                            onClick={() => void promoteToAdmin({ id: u.id })}
                          >
                            <svg
                              width="800px"
                              height="800px"
                              viewBox="-51.2 -51.2 614.40 614.40"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#237500"
                              stroke="#237500"
                              className="h-3 w-3"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0">
                                <rect
                                  x="-51.2"
                                  y="-51.2"
                                  width="614.40"
                                  height="614.40"
                                  rx="307.2"
                                  fill="#00ad0c"
                                />
                              </g>

                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />

                              <g id="SVGRepo_iconCarrier">
                                <path
                                  fill="#000000"
                                  d="M256 29.816l-231 154v106.368l231-154 231 154V183.816zm0 128.043L105 259.783v90.283l151-101.925 151 101.925v-90.283zm0 112l-87 58.725v67.6l87-58 87 58v-67.6zm0 89.957l-87 58v64.368l87-58 87 58v-64.368z"
                                />
                              </g>
                            </svg>
                          </button>
                        ) : (
                          <button>
                            <svg
                              width="800px"
                              height="800px"
                              viewBox="-51.2 -51.2 614.40 614.40"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#bd0d00"
                              stroke="#bd0d00"
                              transform="rotate(180)"
                              className="h-3 w-3"
                              onClick={() => void demoteAdmin({ id: u.id })}
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0">
                                <rect
                                  x="-51.2"
                                  y="-51.2"
                                  width="614.40"
                                  height="614.40"
                                  rx="307.2"
                                  fill="#ad1100"
                                />
                              </g>

                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />

                              <g id="SVGRepo_iconCarrier">
                                <path
                                  fill="#000000"
                                  d="M256 29.816l-231 154v106.368l231-154 231 154V183.816zm0 128.043L105 259.783v90.283l151-101.925 151 101.925v-90.283zm0 112l-87 58.725v67.6l87-58 87 58v-67.6zm0 89.957l-87 58v64.368l87-58 87 58v-64.368z"
                                />
                              </g>
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers?.length === 0 && (
                <div className="mt-2 block w-full rounded-lg bg-slate-700 py-2 text-center text-sm opacity-50 shadow-inner">
                  no users found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Users;

const UsersTable = () => {
  return <></>;
};

const ViewOppButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-search"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
      View Events
    </button>
  );
};

const SearchBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  return (
    <div className="mb-[40px] w-[90vw] md:w-[50vw]">
      <label className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Search..."
          required
        />
      </div>
    </div>
  );
};
