import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";

const TopNav = () => {
  const user = trpc.auth.getSession.useQuery();
  const router = useRouter();
  const { data: session } = useSession();

  const handleAuth = (route: string) => {
    if (user.data?.user) {
      const userRoute = route + "/" + user.data.user.id;
      return router.push(userRoute);
    }

    return router.push("/signIn");
  };

  const handleSignOut = () => {
    signOut();
    return router.push("/signIn");
  };

  return (
    <div className="container flex h-16 items-center justify-between bg-orange-200 px-8">
      <p className="text-md">studyhub</p>
      <ul className="flex space-x-2">
        <li>
          <Link href="/">feed</Link>
        </li>
        <li onClick={() => handleAuth("/account")}>posts</li>
        <li onClick={() => handleAuth("/library")}>library</li>
        {session ? (
          <li onClick={handleSignOut}> SignOut </li>
        ) : (
          <li>
            <Link href="/signIn">sign in</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TopNav;
