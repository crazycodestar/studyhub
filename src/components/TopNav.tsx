import Link from "next/link";

const TopNav = () => {
  return (
    <div className="container flex h-16 items-center justify-between bg-orange-200 px-8">
      <p className="text-md">studyhub</p>
      <ul className="flex space-x-2">
        <li>
          <Link href="/">feed</Link>
        </li>
        <li>
          <Link href="/account">posts</Link>
        </li>
        <li>
          <Link href="/library">library</Link>
        </li>
        <li>
          <Link href="/signIn">sign in</Link>
        </li>
      </ul>
    </div>
  );
};

export default TopNav;
