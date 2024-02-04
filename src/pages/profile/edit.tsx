// import { PageLayout } from "~/components/Layout";
// import { type NextPage } from "next";
// import Head from "next/head";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { api } from "~/utils/api";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signOut, useSession } from "next-auth/react";
// import { LoadingPage } from "~/components/Loading";
// import ConfirmModal from "~/components/modals/ConfirmModal";
// import Link from "next/link";
// import { Prettify, User, user_z } from "types";

// // const name_z = z.string().min(1);
// // const phoneNum_z = z.string();
// // const aboutMe_z = z.string();
// // const updateInfoSchema_z = z.object({
// //   name: name_z,
// //   phone: phoneNum_z,
// //   aboutMe: aboutMe_z,
// // });
// const updateInfoSchema_z = user_z.pick({ name: true, phoneNum: true, aboutMe: true });
// type UpdateUserSchemeData = z.infer<typeof updateInfoSchema_z>;

// const EditProfile = () => {
//   const router = useRouter();

//   // session is `null` until nextauth fetches user's session data
//   const { data: session, update: updateSession } = useSession({
//     required: true,
//     onUnauthenticated() {
//       void router.push("/sign-in");
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<UpdateUserSchemeData>({
//     resolver: zodResolver(updateInfoSchema_z),
//   });

//   const {
//     mutate: updateUser,
//     isLoading: isSavingUserData,
//     variables: newUserData,
//   } = api.user.update.useMutation({
//     onSuccess: () => {
//       toast.success(`User updated`);

//       if (!newUserData) throw new Error("newUserData is undefined");
//       const { name, email, image } = newUserData;
//       const newUserDataForSession = { name, email, image };
//       void updateSession(newUserDataForSession);
//     },
//     onError: (e) => {
//       toast.error(`Failed to update user`);
//       // const zodErrMsg = e.data?.zodError?.fieldErrors.content;
//       // reference zodErrMsg?.[0] for zod errors and e.message for generic errors
//     },
//   });

//   if (!session) {
//     return (
//       <>
//         <Head>
//           <title>Profile</title>
//         </Head>
//         <PageLayout>
//           <LoadingPage />
//         </PageLayout>
//       </>
//     );
//   }

//   const userData = session.user as {
//     name: string;
//     phoneNum: string | null;
//   };
//   const { name, phoneNum } = userData;

//   const handleUpdate = handleSubmit((formData) => {
//     const newData = { formData, ...userData };
//     if (newData == userData) {
//       toast("No changes made");
//       return;
//     }
//     updateUser({ ...userData, ...formData });
//   });

//   return (
//     <PageLayout>
//       <div className="py-4">
//         <h1>Edit Profile</h1>
//         <form
//           className="flex flex-col items-stretch space-y-4 md:space-y-6"
//           onSubmit={(formData) => void handleUpdate(formData)}
//         >
//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
//               Name
//             </label>
//             <input
//               className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//               type="text"
//               placeholder="John Doe"
//               defaultValue={name}
//               {...register("name")}
//             />
//             {errors.name && (
//               <span className="text-sm lowercase text-red-300">
//                 {errors.name.message}
//               </span>
//             )}
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
//               Phone Number
//             </label>
//             <input
//               className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//               type="text"
//               placeholder="8231 4259"
//               defaultValue={phoneNum}
//               {...register("phone")}
//             />
//             {errors.phone && (
//               <span className="text-sm lowercase text-red-300">
//                 {errors.phone.message}
//               </span>
//             )}
//           </div>
//           <input
//             className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full rounded-lg bg-slate-700 px-5 py-2.5 text-center text-sm font-medium uppercase text-slate-200 hover:bg-slate-900 focus:outline-none focus:ring-4 dark:bg-slate-500 dark:hover:bg-slate-600"
//             type="submit"
//             value="Save Changes"
//             disabled={isSavingUserData}
//           />
//           <div className="p-4" />
//         </form>
//       </div>
//     </PageLayout>
//   );
// };

// export default EditProfile;
