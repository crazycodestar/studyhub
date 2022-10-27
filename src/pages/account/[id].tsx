import { useRouter } from "next/router";
import Post from "../../components/Post";
import TopNav from "../../components/TopNav";
import { trpc } from "../../utils/trpc";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";

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

  const mutation = trpc.post.createPost.useMutation();

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({ description: data.description });
    router.push("/");
  };

  const renderPosts = () => {
    // loading state
    if (!posts.data) return <div>loading...</div>;

    //empty state
    if (posts.data.length === 0) return <div>no posts</div>;

    return (
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {posts.data.map((post) => {
          return (
            <Post description={post.description} isEditable key={post.id} />
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <TopNav />
      <div className="rounded-md p-2">
        <p>Write new post here</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("description")} />
          <button type="submit" className="rounded-md bg-pink-700 p-2">
            Submit
          </button>
        </form>
      </div>
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {renderPosts()}
      </div>
    </div>
  );
};

export default Account;
