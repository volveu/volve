import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  const { data: session } = useSession();

  return (
    <div className="relative bg-slate-800 py-3">
      <div className="">
        <button
          onClick={toggleDropdown}
          className="px-3 text-white hover:text-gray-300"
        >
          Menu
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-50 flex flex-col space-y-1 bg-slate-800 p-2">
          <Link
            href="/about-us"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
          >
            About us
          </Link>
          <Link
            href="/profile"
            onClick={closeDropdown}
            className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
          >
            Profile
          </Link>
          {!session && (
            <Link
              href="/signup"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
            >
              SignUp
            </Link>
          )}
          {!session && (
            <Link
              href="/signin"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
            >
              SignIn
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin-dashboard"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
            >
              MyProfile
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admins"
              onClick={closeDropdown}
              className="flex flex-[1_0_0%] items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
            >
              Admins
            </Link>
          )}
          {session && (
            <div
              onClick={() => void signOut()}
              className="flex flex-[1_0_0%] cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-white/10 px-4 font-bold text-white no-underline transition hover:bg-white/20"
            >
              Log out
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
