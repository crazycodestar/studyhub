import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const TopNav = () => {
  const user = trpc.auth.getSession.useQuery();
  const router = useRouter();

  const handleAuth = (route: string) => {
    if (user.data?.user) {
      const userRoute = route + user.data.user;
      router.push(userRoute);
    }

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
        <li>
          <Link href="/signIn">sign in</Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNav;
