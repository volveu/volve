import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { VolveBrandNameLogo } from "~/assets/volve-brand-name-logo";

const NavBar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  const { data: session } = useSession();
  const handleViewProfile = () => {
    closeDropdown();
    void router.push("/profile");
  };

  const node = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    if (node.current?.contains(e.target as Node)) {
      return;
    }
    // if outside this element close dropdown
    setIsDropdownOpen(false);
  };

  return (
    <div ref={node}>
      <div className="relative flex flex-row items-center justify-between bg-slate-800 py-3">
        <button
          onClick={toggleDropdown}
          className="w-12 flex-grow-0 px-3 text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex flex-grow flex-row justify-center">
          <VolveBrandNameLogo className="h-6 fill-slate-100" />
        </div>
        {/* placeholder for rightside so that logo is aligned in the middle */}
        <div className="w-12" />
      </div>
      {/*  */}
      <div
        className={`h-m-[90vw] absolute z-50 flex w-[300px] transform flex-col space-y-1 rounded-md bg-slate-700 p-5 shadow-xl shadow-black transition-transform duration-150 ease-in-out ${isDropdownOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {session && (
          <>
            <div className="flex flex-row items-start py-5">
              <img
                onClick={handleViewProfile}
                className="h-16 w-16 cursor-pointer rounded-full border-2 object-contain hover:border-blue-200"
                src={session.user.image ?? "https://picsum.photos/300/300"}
                alt={`profile pic`}
              />
              {/* <Image
                onClick={handleViewProfile}
                className="h-16 w-16 cursor-pointer rounded-full border-2 hover:border-blue-200"
                src={"https://picsum.photos/300/300"}
                alt={`profile pic`}
                height={30}
                width={30}
              /> */}
              <div className="ml-2 flex flex-col items-start">
                <div
                  onClick={handleViewProfile}
                  className="mt-1  cursor-pointer font-bold text-slate-100 hover:text-slate-200"
                >
                  {session.user.name}
                </div>
                <div
                  onClick={handleViewProfile}
                  className="cursor-pointer  text-sm text-slate-500 underline hover:text-slate-400"
                >
                  view profie
                </div>
              </div>
            </div>
            <div className="mx-3 border-b-2 border-slate-600" />
            <div className="py-1" />
          </>
        )}
        <Link
          href="/"
          onClick={closeDropdown}
          className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-2 text-white no-underline transition hover:bg-white/20"
        >
          Home
        </Link>

        {session && (
          <Link
            href="/activities"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-2 text-white no-underline transition hover:bg-white/20"
          >
            Find Opportunities
          </Link>
        )}
        {session && (
          <Link
            href="/my-events"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-2 text-white no-underline transition hover:bg-white/20"
          >
            My Events
          </Link>
        )}

        {session?.user.role === "ADMIN" && (
          <>
            <Link
              href="/users"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-slate-600 px-4 py-2 text-white no-underline transition hover:bg-white/20"
            >
              Users
            </Link>

            <Link
              href="/npo-management"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-2 text-white no-underline transition hover:bg-white/20"
            >
              NPOs
            </Link>
          </>
        )}

        <div className="py-1" />
        <div className="mx-3 border-b-2 border-slate-600" />
        <div className="py-1" />
        {!session && (
          <Link
            href="/signup"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-1 text-white no-underline transition hover:bg-white/20"
          >
            SignUp
          </Link>
        )}

        {!session && (
          <Link
            href="/signin"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-1 text-white no-underline transition hover:bg-white/20"
          >
            SignIn
          </Link>
        )}

        {session && (
          <div
            onClick={() => void signOut()}
            className="flex flex-[1_0_0%] items-center justify-start whitespace-nowrap rounded-md bg-white/10 px-4 py-1 text-white no-underline transition hover:bg-white/20"
          >
            Log out
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
