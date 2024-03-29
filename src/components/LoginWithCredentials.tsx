import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const email_z = z.string().email().min(1);
const password_z = z.string().min(6);
const createUserSchema_z = z.object({
  email: email_z,
  password: password_z,
});
type CreateUserSchemaData = z.infer<typeof createUserSchema_z>;

type LoginWithCredentialsProps = {
  className?: string;
  onError: (e: Error) => void;
  setIsLoading: (isLoading: boolean) => void;
};
const LoginWithCredentials = (props: LoginWithCredentialsProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchemaData>({
    resolver: zodResolver(createUserSchema_z),
  });

  const handleSignIn = handleSubmit(async (formData) => {
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    if (res?.ok) {
      props.setIsLoading(true);
      const DURATION_TO_LOAD = 1200;
      toast.success("Successfully logged in, redirecting...", {
        duration: DURATION_TO_LOAD,
      });
      return setTimeout(() => {
        // Don't reload the page straightaway so that the toast can be seen.
        // Reload is necessary to have ctx.session be updated
        void router.push("/").then(() => window.location.reload());
      }, DURATION_TO_LOAD);
    } else {
      console.log("Login with Credentials error", res?.error);
      const error = new Error("Unable to login with credentials");
      props.onError(error);
    }
  });

  return (
    <div className={props.className}>
      <form
        className="flex flex-col items-stretch space-y-4 md:space-y-6"
        onSubmit={(formData) => void handleSignIn(formData)}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm lowercase text-red-300">
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm lowercase text-red-300">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="py-1">
          <input
            className="focus:ring-primary-300 dark:focus:ring-primary-800 w-full rounded-lg bg-slate-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-4 dark:bg-slate-400 dark:hover:bg-slate-500"
            type="submit"
            value="Sign In"
          />
        </div>
        <div />
      </form>
    </div>
  );
};

export default LoginWithCredentials;
