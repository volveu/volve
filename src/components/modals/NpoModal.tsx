import { useEffect, useState, type FC } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

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
                    <button
                      disabled
                      type="button"
                      className="me-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Loading...
                    </button>
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
