import { PageLayout } from "~/components/Layout";
import Head from "next/head";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { LoadingPage } from "~/components/Loading";
import { type User, user_z } from "types";

const updateInfoSchema_z = user_z.pick({
  name: true,
  email: true,
  phoneNum: true,
  image: true,
  aboutMe: true,
});
type UpdateUserSchemeData = z.infer<typeof updateInfoSchema_z>;

const EditProfile = () => {
  // session is `null` until nextauth fetches user's session data
  const { data: session, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn("/sign-in");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserSchemeData>({
    resolver: zodResolver(updateInfoSchema_z),
  });

  const {
    mutate: updateUser,
    isLoading: isSavingUserData,
    variables: newUserData,
  } = api.user.update.useMutation({
    onSuccess: () => {
      toast.success(`User updated`);

      if (!newUserData) throw new Error("newUserData is undefined");
      //   const { name, email, image } = newUserData;
      //   const newUserDataForSession = { name, email, image };
      void updateSession(newUserData);
    },
    onError: () => {
      toast.error(`Failed to update user`);
    },
  });

  if (!session) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <PageLayout>
          <LoadingPage />
        </PageLayout>
      </>
    );
  }
  const userData = session.user as User;
  const { name, email, phoneNum, image, aboutMe } = userData;
  if (name == null || email == null) {
    throw new Error("Name and email should not be null");
  }

  const handleUpdate = handleSubmit((formData) => {
    const { name, email, phoneNum = "", image = "", aboutMe = "" } = userData;
    const curData = { name, email, phoneNum, image, aboutMe };

    if (
      curData.name === formData.name &&
      curData.email === formData.email &&
      curData.phoneNum === formData.phoneNum &&
      curData.image === formData.image &&
      curData.aboutMe === formData.aboutMe
    ) {
      toast("No changes made", { id: "no-changes-made" });
      return;
    }

    updateUser({ id: userData.id, ...formData });
  });

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="m-4 w-[90vw] min-w-fit md:w-[50vw] md:max-w-lg">
          <div className="py-2" />
          <div className="m-auto flex  flex-row items-center justify-between  ">
            <h1 className="text-[2rem] font-bold">Edit Profile</h1>
          </div>
          <div className="py-2" />

          <form
            className="flex flex-col items-stretch space-y-4 md:space-y-6"
            onSubmit={(formData) => void handleUpdate(formData)}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
                Name
              </label>
              <input
                className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                placeholder="John Doe"
                defaultValue={name}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-sm lowercase text-red-300">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
                Email
              </label>
              <input
                className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                placeholder="richardDrykes@gmail.com"
                defaultValue={email}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm lowercase text-red-300">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
                Phone Number
              </label>
              <input
                className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                placeholder="8222 5222"
                defaultValue={phoneNum ?? ""}
                {...register("phoneNum")}
              />
              {errors.phoneNum && (
                <span className="text-sm lowercase text-red-300">
                  {errors.phoneNum.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
                ImageURL
              </label>
              <input
                className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                defaultValue={image ?? ""}
                {...register("image")}
              />
              {errors.image && (
                <span className="text-sm lowercase text-red-300">
                  {errors.image.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-slate-200">
                About Me
              </label>
              <input
                className=" focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                placeholder="Tell your story! Briefly share your interests, passions, preferred contact methods, and what brings you to this platform."
                defaultValue={aboutMe ?? ""}
                {...register("aboutMe")}
              />
              {errors.aboutMe && (
                <span className="text-sm lowercase text-red-300">
                  {errors.aboutMe.message}
                </span>
              )}
            </div>
            <div className="py-4" />
            <input
              className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full rounded-lg bg-slate-700 px-5 py-2.5 text-center text-sm font-medium uppercase text-slate-200 hover:bg-slate-900 focus:outline-none focus:ring-4 dark:bg-slate-500 dark:hover:bg-slate-600"
              type="submit"
              value="Save Changes"
              disabled={isSavingUserData}
            />
            <div className="p-4" />
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditProfile;
