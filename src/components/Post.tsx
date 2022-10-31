import { User } from "@prisma/client";
import { FC } from "react";
import Button from "../components/Button";

type PostType = {
  user: User;
  id: string;
  description: string;
  createdAt: Date;
};

interface IPostProps {
  post: PostType;
  isEditable?: boolean;
  loggedIn?: boolean;
  onDelete?: () => void;
  onAddToLib?: () => void;
  removeFromLib?: () => void;
}

const Post: FC<IPostProps> = ({
  post,
  isEditable = false,
  loggedIn = false,
  onDelete,
  onAddToLib,
  removeFromLib,
}) => {
  return (
    <div className="w-full rounded-sm p-4 shadow-md">
      {/* account and time container */}
      <div className="flex justify-between">
        <div className="flex">
          <div className="mr-2 h-6 w-6 rounded-full bg-slate-600" />
          <p>{post.user.name}</p>
        </div>
        <div>20 minutes ago</div>
      </div>
      <div className="ml-8">
        <div>{post.description}</div>
        {/* potential links and files over here */}
        {/* options to store in library and share links over here */}
        <div className="mt-2 space-x-2">
          {loggedIn ? (
            <button
              onClick={onAddToLib}
              className="rounded-md bg-pink-700 p-2 text-white"
            >
              add to library
            </button>
          ) : null}
          <button className="rounded-md bg-pink-700 p-2 text-white">
            share
          </button>
          {isEditable ? (
            <button
              onClick={onDelete}
              className="rounded-md bg-pink-700 p-2 text-white"
            >
              delete
            </button>
          ) : null}
          {removeFromLib ? (
            <Button onClick={removeFromLib}>Remove</Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Post;
