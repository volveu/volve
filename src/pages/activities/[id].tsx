import { useState } from "react";
import { PageLayout } from "../../components/Layout";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { LoadingPage } from "../../components/Loading";
import dayjs from "dayjs";
import { type Activity, type User } from "@prisma/client";
import toast from "react-hot-toast";
import { LoadingButton } from "../../components/LoadingButton";

const Activity = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const {
    data: activity,
    isLoading,
    refetch: refetchActivity,
  } = api.activity.get.useQuery({
    id: id ?? "",
  });
  const isUserSignedUp =
    (activity?.volunteers.filter((user) => user.id === session?.user?.id) ?? [])
      .length > 0;

  if (isLoading || !activity) {
    return (
      <PageLayout>
        <LoadingPage />
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="mt-12 flex flex-col items-center gap-[50px] pl-[20px] pr-[20px]">
        <div className="flex max-w-[90vw] max-w-md flex-col justify-center gap-[10px]">
          <p className="text-5xl">{activity.title}</p>
          <div className="flex flex-row items-center gap-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-buildings"
              viewBox="0 0 16 16"
            >
              <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
              <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
            </svg>
            <p className="text-lg font-thin opacity-[75%]">
              {activity.npo.name}
            </p>
          </div>
          <div className="flex flex-row items-center gap-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-geo-alt-fill opacity-[75%]"
              viewBox="0 0 16 16"
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
            </svg>
            <p className="text-lg font-thin opacity-[75%]">
              {activity.location}
            </p>
          </div>
          <div className="flex flex-row items-center gap-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar-event-fill opacity-[75%]"
              viewBox="0 0 16 16"
            >
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
            </svg>
            <p className="text-lg font-thin opacity-[75%]">{`${dayjs(activity.startTimestamp).format("DD-MMM HH:mm")} - ${dayjs(activity.endTimestamp).format("DD-MMM HH:mm")}`}</p>
          </div>
          <p className="text-lg font-thin opacity-[75%]">
            {activity.description}
          </p>
        </div>
        <div className="flex w-full justify-center">
          <Attendees attendees={activity.volunteers} />
        </div>
        <BottomModal
          id={id ?? ""}
          isUserSignedUp={isUserSignedUp}
          title={activity.title}
          datetime={`${dayjs(activity.startTimestamp).format("DD-MMM HH:mm")} - ${dayjs(activity.endTimestamp).format("DD-MMM HH:mm")}`}
          refetchActivity={refetchActivity}
        />
      </div>
    </PageLayout>
  );
};

export default Activity;

const Attendees = ({ attendees }: { attendees: User[] }) => {
  const [isEdit, setIsEdit] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const onEdit = () => {
    setIsEdit(true);
  };
  return (
    <div className="max-h-[60vh] w-full max-w-md overflow-scroll rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-8 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Attendees
        </h5>
        {isAdmin ? (
          !isEdit ? null : (
            <div>
              <ActionButton
                color="red"
                text="Cancel"
                onClick={() => setIsEdit(false)}
              />
              <ActionButton
                color="green"
                text="Save"
                onClick={() => console.log("clicked")}
              />
            </div>
          )
        ) : null}
      </div>
      {attendees.length ? (
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    Name
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                </div>
                {isAdmin && (
                  <div className="inline-flex flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Attendance
                    </p>
                  </div>
                )}
                {isAdmin && (
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Hours
                    </p>
                  </div>
                )}
              </div>
            </li>
            {attendees.map((user, index) => (
              <li className="py-3 sm:py-4" key={index}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.image}
                        alt={`${user.name} profile`}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://picsum.photos/200"
                        alt={`${user.name} profile`}
                      />
                    )}
                  </div>
                  <div className="ms-4 min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="inline-flex flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                      <VolunteerAttendanceToggle
                        checked={false}
                        onCheck={() => console.log("check")}
                      />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <VolunteerHoursInput
                        value={0}
                        onChange={() => console.log("change")}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>There is no one here yet...</p>
      )}
    </div>
  );
};

const BottomModal = ({
  id,
  isUserSignedUp,
  title,
  datetime,
  refetchActivity,
}: {
  id: string;
  isUserSignedUp: boolean;
  title: string;
  datetime: string;
  refetchActivity: () => void;
}) => {
  const { data: session } = useSession();
  const { mutate: attendActivity, isLoading: signUpLoading } =
    api.activity.attend.useMutation();
  const { mutate: unattendActivity, isLoading: leaveLoading } =
    api.activity.unattend.useMutation();

  const handleAttend = () => {
    attendActivity(
      { activity_id: id ?? "" },
      {
        onSuccess: () => {
          toast.success("You have successfully signed up for this activity");
          refetchActivity();
        },
        onError: () => {
          toast.error("Failed to sign up for this activity");
        },
      },
    );
  };

  const handleUnattend = () => {
    unattendActivity(
      { activity_id: id ?? "" },
      {
        onSuccess: () => {
          toast.success("You have successfully left this activity");
          refetchActivity();
        },
        onError: () => {
          toast.error("Failed to leave this activity");
        },
      },
    );
  };

  const isLoggedIn = session?.user;
  return (
    <div className="sticky mt-12 w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 shadow [box-shadow:10px_10px_73px_1px_rgba(0,0,0,0.75)] dark:border-gray-700 dark:bg-gray-700">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h5 className="max-w-[50vw] overflow-hidden truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <div className="flex flex-row items-center gap-[7px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-calendar-event-fill opacity-[75%]"
              viewBox="0 0 16 16"
            >
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
            </svg>
            <p className="text-sm font-thin opacity-[75%]">{datetime}</p>
          </div>
        </div>
        {isLoggedIn ? (
          isUserSignedUp ? (
            leaveLoading ? (
              <LoadingButton />
            ) : (
              <ActionButton color="red" text="Leave" onClick={handleUnattend} />
            )
          ) : signUpLoading ? (
            <LoadingButton />
          ) : (
            <ActionButton color="green" text="Sign Up" onClick={handleAttend} />
          )
        ) : (
          <ActionButton
            color="blue"
            text="Sign In"
            onClick={() => (window.location.href = "/signin")}
          />
        )}
      </div>
    </div>
  );
};

export const ActionButton = ({
  color,
  text,
  onClick,
}: {
  color: string;
  text: string;
  onClick: () => void;
}) => {
  const green =
    "mb-2 me-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
  const yellow =
    "mb-2 me-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900";
  const red =
    "mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
  const blue =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
  const style =
    color === "green"
      ? green
      : color === "yellow"
        ? yellow
        : color === "red"
          ? red
          : blue;
  return (
    <button type="button" className={style} onClick={onClick}>
      {text}
    </button>
  );
};

const VolunteerAttendanceToggle = ({
  checked,
  onCheck,
}: {
  checked: boolean;
  onCheck: () => void;
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <label className="relative me-5 inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800"></div>
    </label>
  );
};

const VolunteerHoursInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: () => void;
}) => {
  const [hours, setHours] = useState(value);
  return (
    <div className="mx-auto max-w-xs">
      <div className="relative flex max-w-[5rem] items-center">
        <input
          type="text"
          data-input-counter
          aria-describedby="helper-text-explanation"
          className="block h-11 w-full rounded-[5px] border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="0"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
