import React from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

interface NpoModalPropsBase {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

interface NpoModalPropsEdit extends NpoModalPropsBase {
  isEdit: boolean;
  id: string;
}

interface NpoModalPropsCreate extends NpoModalPropsBase {
  isEdit: boolean;
  id: null;
}

type NpoModalProps = NpoModalPropsEdit | NpoModalPropsCreate;

const NpoModal: React.FC<NpoModalProps> = ({showModal, setShowModal, isEdit, id}) => {
    const useGetNPO = api.npo.get.useQuery({ id: id ?? '' }, {enabled: showModal && isEdit});
    const [isLoading, setIsLoading] = React.useState(false);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [webLink, setWebLink] = React.useState("");
    const [logoLink, setLogoLink] = React.useState("");
    React.useEffect(() => {
      if(isEdit && useGetNPO.data) {
        setName(useGetNPO.data.name);
        setDescription(useGetNPO.data.description);
        setWebLink(useGetNPO.data.website ?? "");
        setLogoLink(useGetNPO.data.logo ?? "");
      } else {
        setName("");
        setDescription("");
        setWebLink("");
        setLogoLink("");
      }
    }, [isEdit, useGetNPO.data]);

    const createNPO = api.npo.create.useMutation({ 
      onError: () => {
        toast.error("Failed to create NPO");
        setIsLoading(false);
      }, 
      onSuccess: async () => {
        toast.success("NPO created successfully");
        handleClose();
        setIsLoading(false);
      } 
    });
    const editNPO = api.npo.update.useMutation({ 
      onError: () => {
        toast.error("Failed to update NPO");
        setIsLoading(false);
      }, 
      onSuccess: async () => {
        toast.success("NPO updated successfully");
        handleClose();
        setIsLoading(false);
      } 
    });
    const handleClose = () => {
      setShowModal(false);
    }

    const handleSubmit = () => {
      setIsLoading(true);
      // check if required fields are filled
      if(!name || !description) {
        toast.error("Name and Description are required fields!");
        setIsLoading(false);
        return;
      }
      if(isEdit && id) {
        editNPO.mutate({ id: id, name, description, website: webLink, logo: logoLink });
      } else {
        createNPO.mutate({ name, description, website: webLink, logo: logoLink });
      }
    }

  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-sm"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl [box-shadow:10px_10px_62px_-5px_rgba(0,0,0,0.75)]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-gray-700 [@media(max-width:768px)]:w-[90vw] md:w-[50vw] md:max-w-xl">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {isEdit ? "Edit NPO" : "Create NPO"}
                  </h3>
                </div>
                {/*body*/}
                <div className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Name" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea id="description" maxLength={191} value={description} onChange={(e) => setDescription(e.target.value)}  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write NPO description here"></textarea>                    
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website Link</label>
                            <input name="website-link" value={webLink} onChange={(e) => setWebLink(e.target.value)}  id="website-link" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="https://example.com" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo Link</label>
                            <input name="logo-link" value={logoLink} onChange={(e) => setLogoLink(e.target.value)}  id="logo-link" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="https://example.com" required />
                        </div>
                    </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  {!isLoading? 
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSubmit}
                    >
                    Save Changes
                </button> 
                : 
                  <button disabled type="button" className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    Loading...
                </button>
                }
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default NpoModal;