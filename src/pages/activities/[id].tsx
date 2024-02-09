import { useState } from "react";
import { PageLayout } from "../../components/Layout";
import { useSession } from "next-auth/react";

const Activity = () => {
  return (
    <PageLayout>
      <div className="mt-12 flex flex-col items-center gap-[50px]">
        <div className="flex max-w-[90vw] flex-col gap-[10px]">
          <p className="text-5xl">Activity Title</p>
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
              Activity Organiser
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
            <p className="text-lg font-thin opacity-[75%]">Activity Venue</p>
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
            <p className="text-lg font-thin opacity-[75%]">Activity Date</p>
          </div>
          <p className="text-lg font-thin opacity-[75%]">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          </p>
        </div>
        <div className="flex w-full max-w-[90vw] justify-center">
          <Attendees />
        </div>
        <BottomModal />
      </div>
    </PageLayout>
  );
};

export default Activity;

const Attendees = () => {
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
          !isEdit ? (
            <ActionButton color="blue" text="Edit" onClick={onEdit} />
          ) : (
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
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <li className="py-3 sm:py-4" key={index}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://picsum.photos/200"
                    alt="Neil image"
                  />
                </div>
                <div className="ms-4 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    Neil Sims
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    Admin
                  </p>
                </div>
                {isAdmin && (
                  <div className="inline-flex flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                    <VolunteerAttendanceToggle
                      checked={false}
                      disabled={!isEdit}
                    />
                  </div>
                )}
                {isAdmin && (
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <VolunteerHoursInput value={0} disabled={!isEdit} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BottomModal = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = session?.user;
  return (
    <div className="sticky bottom-[70px] mt-12 w-full max-w-sm rounded-lg border border-gray-100 bg-white p-6 shadow [box-shadow:10px_10px_73px_1px_rgba(0,0,0,0.75)] dark:border-gray-700 dark:bg-gray-700">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Title
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
            <p className="text-sm font-thin opacity-[75%]">Activity Date</p>
          </div>
        </div>
        {isAdmin ? (
          <ActionButton
            color="blue"
            text="Edit Details"
            onClick={() => console.log("clicked")}
          />
        ) : isLoggedIn ? (
          <ActionButton
            color="green"
            text="Sign Up"
            onClick={() => console.log("clicked")}
          />
        ) : (
          <ActionButton
            color="blue"
            text="Sign In"
            onClick={() => console.log("clicked")}
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
  disabled,
}: {
  checked: boolean;
  disabled: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <label className="relative me-5 inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        disabled={disabled}
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800"></div>
    </label>
  );
};

const VolunteerHoursInput = ({
  value,
  disabled,
}: {
  value: number;
  disabled: boolean;
}) => {
  const [hours, setHours] = useState(value);
  return (
    <div className="mx-auto max-w-xs">
      <div className="relative flex max-w-[8rem] items-center">
        <button
          type="button"
          onClick={() => setHours(hours - 1)}
          disabled={disabled}
          className="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            className="h-3 w-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="text"
          data-input-counter
          aria-describedby="helper-text-explanation"
          className="block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="0"
          disabled={disabled}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={() => setHours(hours + 1)}
          disabled={disabled}
          className="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            className="h-3 w-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
