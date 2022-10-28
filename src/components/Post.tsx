import { FC } from "react";

interface IPostProps {
  isEditable?: boolean;
  description: string;
  loggedIn?: boolean;
  onDelete?: () => void;
  onAddToLib?: () => void;
}

const Post: FC<IPostProps> = ({
  isEditable = false,
  description,
  loggedIn = false,
  onDelete,
  onAddToLib,
}) => {
  return (
    <div className="w-full rounded-sm p-4 shadow-md">
      {/* account and time container */}
      <div className="flex justify-between">
        <div className="flex">
          <div className="mr-2 h-6 w-6 rounded-full bg-slate-600" />
          <p>Olalekan Adekanmbi</p>
        </div>
        <div>20 minutes ago</div>
      </div>
      <div className="ml-8">
        <div>{description}</div>
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
        </div>
      </div>
    </div>
  );
};

export default Post;
