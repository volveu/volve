import { useEffect, useState, type FC } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { LoadingButton } from "../LoadingButton";

interface NpoModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isEdit: boolean;
  id: string | null;
}

// to create and update NPO
const NpoModal: FC<NpoModalProps> = ({
  showModal,
  setShowModal,
  isEdit,
  id,
}) => {
  const { data: npoData } = api.npo.get.useQuery(
    { id: id ?? "" },
    { enabled: showModal && isEdit },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [webLink, setWebLink] = useState("");
  const [logoLink, setLogoLink] = useState("");
  useEffect(() => {
    if (isEdit && npoData) {
      setName(npoData.name);
      setDescription(npoData.description);
      setWebLink(npoData.website ?? "");
      setLogoLink(npoData.logo ?? "");
    } else {
      setName("");
      setDescription("");
      setWebLink("");
      setLogoLink("");
    }
  }, [isEdit, npoData]);

  const { mutate: createNPO } = api.npo.create.useMutation({
    onError: () => {
      toast.error("Failed to create NPO");
      setIsLoading(false);
    },
    onSuccess: async () => {
      toast.success("NPO created successfully");
      handleClose();
      setIsLoading(false);
    },
  });
  const { mutate: editNPO } = api.npo.update.useMutation({
    onError: () => {
      toast.error("Failed to update NPO");
      setIsLoading(false);
    },
    onSuccess: async () => {
      toast.success("NPO updated successfully");
      handleClose();
      setIsLoading(false);
    },
  });
  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // check if required fields are filled
    if (!name || !description) {
      toast.error("Name and Description are required fields!");
      setIsLoading(false);
      return;
    }
    if (isEdit && id) {
      editNPO({
        id: id,
        name,
        description,
        website: webLink,
        logo: logoLink,
      });
    } else {
      createNPO({ name, description, website: webLink, logo: logoLink });
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
                    {isEdit ? "Edit NPO" : "Create NPO"}
                  </h3>
                </div>
                {/*body*/}
                <div className="p-4 md:p-5">
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="Name"
                        required
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
                        placeholder="Write NPO description here"
                      ></textarea>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Website Link
                      </label>
                      <input
                        name="website-link"
                        value={webLink}
                        onChange={(e) => setWebLink(e.target.value)}
                        id="website-link"
                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Logo Link
                      </label>
                      <input
                        name="logo-link"
                        value={logoLink}
                        onChange={(e) => setLogoLink(e.target.value)}
                        id="logo-link"
                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  {!isLoading ? (
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

export default NpoModal;
