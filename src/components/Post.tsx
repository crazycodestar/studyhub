import { User } from "@prisma/client";
import { FC, useState } from "react";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import { FaBookmark, FaRegBookmark, FaShareAlt } from "react-icons/fa";
import { formatDistance } from "date-fns";

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
          <IconButton
            variant="share"
            className="rounded-md bg-pink-700 p-2 text-white"
          >
            <FaShareAlt />
          </IconButton>
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
