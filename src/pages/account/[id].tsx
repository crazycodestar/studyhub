import { useRouter } from "next/router";
import Post from "../../components/Post";
import TopNav from "../../components/TopNav";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useSession } from "next-auth/react";
import Button from "../../components/Button";
import { usePopUp } from "../../layouts/Popup";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import shallow from "zustand/shallow";

type queryType = {
  id: string;
};

const postValidation = z.object({
  description: z.string().min(3),
});

type postValidationType = z.infer<typeof postValidation>;

type Inputs = {
  description: string;
  files: { filename: string; storageLink: string }[];
};

const Account = () => {
  const router = useRouter();
  const { id } = router.query as queryType;
  const posts = trpc.post.getAccountPosts.useQuery({ id });
  const { setValue } = usePopUp(
    (state) => ({
      open: state.open,
      setValue: state.setValue,
    }),
    shallow
  );

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({ description: data.description });
  };
  const { register, handleSubmit } = useForm<Inputs>();

  const { data: session } = useSession();

  const utils = trpc.useContext();
  const mutation = trpc.post.createPost.useMutation({
    onSuccess: () => {
      utils.post.getAccountPosts.invalidate();
      router.push("/");
      setValue("Posted");
    },
    onError: (error) => {
      setValue(error.message, "error");
    },
  });
  const libMutation = trpc.post.addToLib.useMutation({
    onSuccess: () => {
      utils.post.getLibrary.invalidate();
      setValue("added to library");
    },
    onError: (error) => {
      setValue(error.message, "error");
    },
  });
  const deleteMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.getAccountPosts.invalidate();
      setValue("deleted");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ postId: id });
  };

  const handleAddtoLib = (id: string) => {
    if (session?.user) {
      libMutation.mutate({ postId: id });
    }
  };

  const renderPosts = () => {
    // loading state
    if (!posts.data) return <div>loading...</div>;

    //empty state
    if (posts.data.length === 0) return <div>no posts</div>;

    return (
      <>
        {posts.data.map((post) => {
          return (
            <Post
              post={post}
              key={post.id}
              onDelete={() => handleDelete(post.id)}
              onAddToLib={() => handleAddtoLib(post.id)}
            />
          );
        })}
      </>
    );
  };

  return (
    <div>
      <TopNav />
      <div className="mx-auto mt-8">
        <div className="mx-auto mt-8 w-1/3 rounded-md ">
          <div className="mb-2 flex space-x-2">
            <div className="h-6 w-6 rounded-full bg-slate-700" />
            <p className="font-Montserrat text-lg font-semibold capitalize text-slate-500">
              {session?.user?.name}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              rows={5}
              placeholder="write new post here"
              className="mb-2 w-full resize-none rounded-md bg-slate-300 px-4 py-2 "
              {...register("description")}
            />
            <FileUploadArray />
            <Button type="submit">Submit</Button>
          </form>
        </div>
        <div className="mx-auto mt-8 w-1/3">
          {/* posts container */}
          {renderPosts()}
        </div>
      </div>
    </div>
  );
};

const FileUploadArray = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<{ file: File }[]>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("rerunning onchange function");
    if (!e.target.files?.length) return;
    // continue here
    const file = e.target.files[0] as File;
    setValue((init) => [
      { file, state: "loading", name: Math.random().toString() },
      ...init,
    ]);
  };

  return (
    <div className="mb-2 w-full rounded-md bg-slate-300 px-4 py-2 ">
      <Button
        type="button"
        onClick={() =>
          fileInputRef.current ? fileInputRef.current.click() : null
        }
      >
        Upload File
      </Button>
      <input
        className="hidden"
        ref={fileInputRef}
        type={"file"}
        onChange={(e) => handleFileUpload(e)}
      />
      {value.map((file) => {
        return <FileUpload file={file.file} />;
      })}
    </div>
  );
};

const FileUpload = ({ file }: { file: File }) => {
  const [fileData, setFileData] = useState<{
    filename: string;
    storageLink: string;
  } | null>(null);

  useEffect(() => {
    if (!fileData) {
      console.log("re_running");
      return generatePresignPostMutation.mutate({ filename: file.name });
    }
  }, [fileData]);

  const fileUploadMutation = useMutation({
    mutationFn: ({ file, url }: { file: File; url: string }) => {
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form=data",
        },
        body: file,
      });
    },
    onSuccess: (data) => console.log(data),
    onError: (error) => console.error("error_here", error),
  });

  const generatePresignPostMutation =
    trpc.post.createPresignedPost.useMutation();

  if (fileUploadMutation.isLoading) return <p>loading here...</p>;

  if (fileUploadMutation.data) {
    return (
      <div>
        {file.name}
        {JSON.stringify(fileUploadMutation.data, null, 2)}
      </div>
    );
  }

  return <p>loading-final_return...</p>;
};

export default Account;
