import { useRouter } from "next/router";
import Post from "../../components/Post";
import TopNav from "../../components/TopNav";
import { trpc } from "../../utils/trpc";

type queryType = {
  id: string;
};

const Account = () => {
  const router = useRouter();
  const { id } = router.query as queryType;
  const posts = trpc.post.getLibrary.useQuery({ id });

  const renderPosts = () => {
    // loading state
    if (!posts.data) return <div>loading...</div>;

    //empty state
    if (posts.data.length === 0) return <div>no posts</div>;

    return (
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {posts.data.map((post) => {
          return <Post />;
        })}
      </div>
    );
  };

  return (
    <div>
      <TopNav />
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {renderPosts()}
      </div>
    </div>
  );
};

export default Account;
