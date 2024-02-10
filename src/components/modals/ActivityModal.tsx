import { type FC, useState, useEffect } from "react";
import { api } from "../../utils/api";
import DateAndTimePicker from "../DateAndTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import TagSelectField from "../TagSelectField";
import { type Tag } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ActionButton } from "../../pages/activities/[id]";
import { LoadingButton } from "../LoadingButton";
import { LoadingSpinner } from "../Loading";

interface ActivityModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isEdit: boolean;
  id: string | null;
}

const ActivityModal: FC<ActivityModalProps> = ({
  showModal,
  setShowModal,
  isEdit,
  id,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [tagsSelected, setTagsSelected] = useState<Tag[]>([]);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [npoId, setNpoId] = useState<string>("");
  const [npoName, setNpoName] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState<Dayjs>(
    dayjs().add(1, "hour"),
  );
  const [endDateTime, setEndDateTime] = useState<Dayjs>(dayjs().add(2, "hour"));
  const { mutate: createActivity, isLoading: isCreating } =
    api.activity.create.useMutation();
  const { mutate: updateActivity, isLoading: isUpdating } =
    api.activity.update.useMutation();
  const { mutate: deleteActivity, isLoading: isDeleting } =
    api.activity.delete.useMutation();
  const { data: npoData } = api.npo.getAll.useQuery();
  const { data: tags } = api.activity.tags.useQuery();
  const { data: session } = useSession();
  const { data: activityData, isLoading: isFetchingActivityData } =
    api.activity.get.useQuery({ id: id ?? "" }, { enabled: isEdit });

  useEffect(() => {
    if (isEdit && activityData) {
      setTitle(activityData.title);
      setDescription(activityData.description);
      setPrimaryContact(activityData.primaryContactInfo);
      setTagsSelected(activityData.tags);
      setCapacity(activityData.capacity ?? undefined);
      setNpoId(activityData.npoId);
      setNpoName(activityData.npo.name);
      setLocation(activityData.location);
      setStartDateTime(dayjs(activityData.startTimestamp));
      setEndDateTime(dayjs(activityData.endTimestamp));
    } else {
      setTitle("");
      setDescription("");
      setPrimaryContact("");
      setTagsSelected([]);
      setCapacity(undefined);
      setNpoId("");
      setNpoName("");
      setLocation("");
      setStartDateTime(dayjs().add(1, "hour"));
      setEndDateTime(dayjs().add(2, "hour"));
    }
  }, [npoData, activityData, isEdit]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    const payload = {
      title,
      description,
      startTimestamp: startDateTime?.toDate(),
      endTimestamp: endDateTime?.toDate(),
      npoId,
      primaryContactInfo: primaryContact,
      tags: tagsSelected,
      capacity,
      location,
      createdByAdminId: session?.user?.id,
    };

    // check validity
    if (
      !payload.title ||
      !payload.description ||
      !payload.startTimestamp ||
      !payload.endTimestamp ||
      !payload.npoId ||
      !payload.primaryContactInfo ||
      !payload.location
    ) {
      alert("Please fill in all required fields");
      return;
    } else if (payload.startTimestamp > payload.endTimestamp) {
      alert("Start date should be before end date");
      return;
    } else if (payload.capacity && payload.capacity < 0) {
      alert("Capacity should be non-negative");
      return;
    } else if (!isEdit && dayjs().isAfter(payload.startTimestamp)) {
      alert("Start date should be in the future");
      return;
    }

    if (isEdit) {
      updateActivity(
        { id: id ?? "", ...payload },
        {
          onSuccess: () => {
            toast.success("Activity updated successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to update activity");
          },
        },
      );
      return;
    } else {
      createActivity(payload, {
        onSuccess: () => {
          toast.success("Activity created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create activity");
        },
      });
    }
  };
  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm backdrop-filter focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl [box-shadow:10px_10px_62px_-5px_rgba(0,0,0,0.75)]">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none md:w-[50vw] md:max-w-xl dark:bg-gray-700 [@media(max-width:768px)]:w-[90vw]">
                {/*header*/}
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-3xl font-semibold">
                    {isEdit ? "Edit Activity" : "Create Activity"}
                  </h3>
                </div>
                {/*body*/}
                {isEdit && isFetchingActivityData ? (
                  <div className="flex h-[60vh] items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-scroll p-4 md:p-5">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                          placeholder="Title"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Description
                        </label>
                        <textarea
                          id="description"
                          maxLength={500}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Write activity description here"
                        ></textarea>
                      </div>
                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          NPO
                        </label>
                        <input
                          list="npos"
                          value={
                            npoData?.find((npo) => npo.id === npoId)?.name ??
                            npoName
                          }
                          onChange={(e) => {
                            const npo = npoData?.find(
                              (npo) => npo.name === e.target.value,
                            );
                            if (npo) setNpoId(npo.id);
                            else setNpoId("");
                            setNpoName(e.target.value);
                          }}
                          className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        ></input>
                        <datalist id="npos">
                          {npoData?.map((npo) => (
                            <option key={npo.id} value={npo.name} />
                          ))}
                        </datalist>
                      </div>
                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Primary Contact
                        </label>
                        <textarea
                          id="primary-contact"
                          maxLength={255}
                          value={primaryContact}
                          onChange={(e) => setPrimaryContact(e.target.value)}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Write your contact instructions here"
                        ></textarea>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Capacity
                        </label>
                        <input
                          type="number"
                          className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                          value={capacity ?? ""}
                          onChange={(e) =>
                            setCapacity(
                              Number.isNaN(parseInt(e.target.value))
                                ? undefined
                                : parseInt(e.target.value),
                            )
                          }
                          placeholder="20"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Location
                        </label>
                        <input
                          type="text"
                          className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="NUS, UTown"
                        />
                      </div>
                      <div className="col-span-2 pt-5 sm:col-span-1">
                        <DateAndTimePicker
                          value={startDateTime}
                          setValue={setStartDateTime}
                          label="Start Date"
                        />
                      </div>
                      <div className="col-span-2 pt-5 sm:col-span-1">
                        <DateAndTimePicker
                          value={endDateTime}
                          setValue={setEndDateTime}
                          label="End Date"
                        />
                      </div>
                      <div className="col-span-2 pt-5">
                        <TagSelectField
                          tags={tags ?? []}
                          values={tagsSelected}
                          setValues={setTagsSelected}
                        />
                      </div>
                      {isEdit && (
                        <div className="col-span-2 pt-5 sm:col-span-1">
                          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Danger Zone
                          </label>
                          {isDeleting ? (
                            <LoadingButton />
                          ) : (
                            <ActionButton
                              onClick={() => {
                                confirm(
                                  "Are you sure you want to delete this activity?",
                                );
                                deleteActivity(
                                  { id: id ?? "" },
                                  {
                                    onSuccess: () => {
                                      toast.success(
                                        "Activity deleted successfully",
                                      );
                                      handleClose();
                                    },
                                    onError: () => {
                                      toast.error("Failed to delete activity");
                                    },
                                  },
                                );
                              }}
                              text="Delete Activity"
                              color="red"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/*footer*/}
                <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  {!isCreating && !isUpdating ? (
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </button>
                  ) : (
                    <LoadingButton />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
};

export default ActivityModal;
