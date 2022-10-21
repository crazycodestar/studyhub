const TopNav = () => {
  return (
    <div className="container flex h-16 items-center justify-between bg-orange-200 px-8">
      <p className="text-md">studyhub</p>
      <ul className="flex space-x-2">
        <li>feed</li>
        <li>posts</li>
        <li>my library</li>
        <li>sign in</li>
      </ul>
    </div>
  );
};

export default TopNav;
