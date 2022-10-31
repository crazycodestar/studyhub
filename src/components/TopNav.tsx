import { useSession } from "next-auth/react";
import { FC, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Button from "./Button";
import type { Session } from "next-auth";
import useClickAway from "../hooks/useClickAway";

const TopNav = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleAuth = (route: string) => {
    if (session?.user) {
      const userRoute = route + "/" + session.user.id;
      return router.push(userRoute);
    }

    return router.push("/signIn");
  };

  const handleSignOut = () => {
    signOut();
    return router.push("/signIn");
  };

  return (
    <div className="w-m-screen flex h-20 items-center justify-center bg-slate-700">
      <div className="flex w-1/2 items-center justify-between font-Raleway text-slate-50">
        <p className="text-md font-Montserrat text-lg font-bold capitalize">
          studyhub
        </p>
        <ul className="flex space-x-2 capitalize">
          <li>
            <Button variant="secondary" onClick={() => router.push("/")}>
              feed
            </Button>
          </li>
          <li>
            <Button variant="secondary" onClick={() => handleAuth("/account")}>
              posts
            </Button>
          </li>
          <li>
            <Button variant="secondary" onClick={() => handleAuth("/library")}>
              library
            </Button>
          </li>
          {session ? (
            <AccountDropdown onSignOut={handleSignOut} account={session.user} />
          ) : (
            // <Button onClick={handleSignOut}>sign out</Button>
            <Button onClick={() => router.push("/signIn")}>sign in</Button>
          )}
        </ul>
      </div>
    </div>
  );
};

type ExtractUserType<T, K extends keyof T> = T[K];
type UserType = ExtractUserType<Session, "user">;

interface IAccountDropdownProps {
  onSignOut: () => void;
  account: UserType;
}

const AccountDropdown: FC<IAccountDropdownProps> = ({ account, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickAway<HTMLDivElement>({
    onClickAway: () => setShowDropdown(false),
  });
  const handleDropdown = () => {
    setShowDropdown((init) => !init);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleDropdown}
        className="h-8 w-8 rounded-full bg-pink-500"
      />
      {showDropdown ? (
        <div className="absolute top-10 right-0 rounded-md bg-white p-4 text-black shadow-md shadow-slate-300">
          <div className="flex border-b-2 pb-2">
            <div className="mr-2 h-8 w-8 rounded-full bg-pink-500" />
            <div>
              <p className="text-Montserrat font-bold">{account?.name}</p>
              <p className="normal-case">{account?.email}</p>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={onSignOut}
              className="hover: w-full cursor-pointer rounded-md bg-pink-600 p-2 text-start capitalize text-white hover:bg-pink-500"
            >
              sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TopNav;
