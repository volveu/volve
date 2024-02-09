import { useSession } from "next-auth/react";
import EditButton from "./EditButton";
import { type Activity } from "@prisma/client";
import dayjs from "dayjs";
import { api } from "../utils/api";

const ActivityCard = ({
  activity,
  onEdit,
}: {
  activity: Activity;
  onEdit: () => void;
}) => {
  const { data: session } = useSession();
  const { data: npo } = api.npo.get.useQuery({ id: activity.npoId });
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <div className="relative w-[90vw] rounded-lg border border-gray-200 bg-white p-6 shadow md:w-[50vw] md:max-w-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-[5px] flex flex-row items-center gap-[7px]">
        <p className="text-md font-thin opacity-[75%]">{`${dayjs(activity.startTimestamp).format("DD-MMM HH:mm")} - ${dayjs(activity.endTimestamp).format("DD-MMM HH:mm")}`}</p>
      </div>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {activity.title}
      </h5>
      <div className="flex flex-row items-center gap-[7px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-buildings"
          viewBox="0 0 16 16"
        >
          <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
          <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
        </svg>
        <p className="text-sm font-thin opacity-[75%]">{npo?.name}</p>
      </div>
      <div className="mb-[10px] flex flex-row items-center gap-[7px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-geo-alt-fill opacity-[75%]"
          viewBox="0 0 16 16"
        >
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
        </svg>
        <p className="text-sm font-thin opacity-[75%]">{activity.location}</p>
      </div>
      <div className="mb-3 max-h-[10vh] overflow-scroll font-normal text-gray-700 dark:text-gray-400">
        {activity.description}
      </div>
      <a
        href={`/activities/${activity.id}`}
        className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Read more
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
      </a>
      {isAdmin && <EditButton onEdit={onEdit} />}
    </div>
  );
};

export default ActivityCard;
