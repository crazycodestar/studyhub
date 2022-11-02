import { User } from "@prisma/client";
import { FC, useMemo, useState } from "react";
import IconButton from "../components/IconButton";
import { MdBookmarkAdd, MdBookmarkRemove } from "react-icons/md";
import { FaShare, FaUpload } from "react-icons/fa";
import { formatDistance } from "date-fns";
import useClickAway from "../hooks/useClickAway";

type PostType = {
  // isInLib: boolean;
  user: User;
  id: string;
  description: string;
  createdAt: Date;
};

interface IPostProps {
  post: PostType;
  isEditable?: boolean;
  onDelete?: () => void;
  onAddToLib?: () => void;
  removeFromLib?: () => void;
}

const Post: FC<IPostProps> = ({
  post,
  isEditable = false,
  onDelete,
  onAddToLib,
  removeFromLib,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const postFunctions = useMemo(() => {
    // const functions = new Map<string, { func: () => void; icon?: any }>([
    //   ["share", { func: () => alert("working on it") }],
    // ]);

    const functions: Array<{
      name: string;
      func: () => void;
      icon?: JSX.Element;
    }> = [
      {
        name: "share",
        func: () => alert("working on it"),
        icon: <FaShare fontSize={18} />,
      },
    ];

    if (onAddToLib)
      functions.push({
        name: "add to library",
        func: () => onAddToLib(),
        icon: <MdBookmarkAdd fontSize={22} />,
      });
    if (removeFromLib)
      functions.push({
        name: "remove from library",
        icon: <MdBookmarkRemove fontSize={22} />,
        func: () => removeFromLib(),
      });
    // if (onDelete) functions.set("delete", { func: () => onDelete() });

    return functions;
  }, []);

  const handleShowDropdown = () => setShowDropdown((init) => !init);
  const DropdownRef = useClickAway<HTMLDivElement>({
    onClickAway: () => setShowDropdown(false),
  });
  // const handleAddToLib = () => {
  //   if (!post.isInLib && onAddToLib) onAddToLib();

  //   if (post.isInLib && removeFromLib) removeFromLib();
  // };
  const handleFunc = (func: () => void) => {
    func();
    return setShowDropdown(false);
  };

  const getRelativeTime = (uploadAt: Date) => {
    return formatDistance(uploadAt, new Date(), { addSuffix: true });
  };
  return (
    <div className="w-full rounded-sm p-4 shadow-md">
      {/* account and time container */}
      <div className="flex justify-between">
        <div className="flex">
          <div className="mr-2 h-6 w-6 rounded-full bg-slate-600" />
          <p>{post.user.name}</p>
        </div>
        <div>{getRelativeTime(post.createdAt)}</div>
      </div>
      <div className="ml-8">
        <div>{post.description}</div>
        <div className="mt-2 space-x-2">
          <div className="relative w-fit" ref={DropdownRef}>
            <IconButton variant="share" onClick={handleShowDropdown}>
              <FaUpload />
            </IconButton>
            {showDropdown ? (
              <ul className="absolute top-10 right-0 z-50 min-w-[125px] space-y-1 whitespace-nowrap rounded-md bg-white p-2 shadow-md shadow-slate-300">
                {postFunctions.map(({ func, name, icon }) => {
                  return (
                    <li>
                      <button
                        onClick={() => handleFunc(func)}
                        className="w-min-{200} flex w-full items-center space-x-2 rounded-md p-2 text-start hover:bg-slate-300"
                      >
                        <span>{icon}</span>
                        <p className="font-Raleway capitalize">{name}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          {Boolean(onDelete) ? (
            <button
              onClick={onDelete}
              className="rounded-md bg-pink-700 p-2 text-white"
            >
              delete
            </button>
          ) : null}
          {/* {removeFromLib ? (
            <Button onClick={removeFromLib}>Remove</Button>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default Post;
