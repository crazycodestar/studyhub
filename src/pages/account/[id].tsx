import { useRouter } from "next/router";
import Post from "../../components/Post";
import TopNav from "../../components/TopNav";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import Button from "../../components/Button";
import { usePopUp } from "../../layouts/Popup";

type queryType = {
  id: string;
};

const postValidation = z.object({
  description: z.string().min(3),
});

type postValidationType = z.infer<typeof postValidation>;

type Inputs = {
  description: string;
};

const Account = () => {
  const router = useRouter();
  const { id } = router.query as queryType;
  const posts = trpc.post.getAccountPosts.useQuery({ id });
  const { open, setValue } = usePopUp((state) => ({
    open: state.open,
    setValue: state.setValue,
  }));

  const { data: session } = useSession();

  const utils = trpc.useContext();
  const mutation = trpc.post.createPost.useMutation({
    onSuccess: () => {
      utils.post.getAccountPosts.invalidate();
      router.push("/");
      setValue("Posted");
      return open();
    },
  });
  const libMutation = trpc.post.addToLib.useMutation({
    onSuccess: () => {
      utils.post.getLibrary.invalidate();
      setValue("added to library");
      return open();
    },
    onError: (error) => {
      setValue(error.message, "error");
      return open();
    },
  });
  const deleteMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.getAccountPosts.invalidate();
      setValue("deleted");
      return open();
    },
  });

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({ description: data.description });
  };

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

export default Account;
