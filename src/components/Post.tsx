import { User } from "@prisma/client";
import { FC, useState } from "react";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import {
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaUpload,
} from "react-icons/fa";
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

  const handleShowDropdown = () => setShowDropdown((init) => !init);
  const DropdownRef = useClickAway<HTMLDivElement>({
    onClickAway: () => setShowDropdown(false),
  });
  // const handleAddToLib = () => {
  //   if (!post.isInLib && onAddToLib) onAddToLib();

  //   if (post.isInLib && removeFromLib) removeFromLib();
  // };
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
        {/* potential links and files over here */}
        {/* options to store in library and share links over here */}
        <div className="mt-2 space-x-2">
          {/* {Boolean(onAddToLib || removeFromLib) ? (
            <IconButton
              onClick={handleAddToLib}
              className="rounded-md bg-pink-700 p-2 text-white"
            >
              {!post.isInLib ? <FaRegBookmark /> : <FaBookmark />}
            </IconButton>
          ) : null} */}
          <div className="relative w-fit" ref={DropdownRef}>
            <IconButton variant="share" onClick={handleShowDropdown}>
              <FaUpload />
            </IconButton>
            {showDropdown ? (
              <ul className="absolute top-10 right-0 z-50 min-w-[125px] space-y-1 whitespace-nowrap rounded-md bg-white p-2 shadow-md shadow-slate-300">
                {onAddToLib || removeFromLib ? (
                  <li>
                    <button className="w-min-{200} w-full rounded-md p-2 text-start hover:bg-slate-300">
                      Add to library
                    </button>
                  </li>
                ) : null}
                <li>
                  <button className="w-full rounded-md p-2 text-start hover:bg-slate-300">
                    Share
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
          {isEditable ? (
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
