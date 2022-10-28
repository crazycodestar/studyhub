import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
// import { signIn, signOut, useSession } from "next-auth/react";
import TopNav from "../components/TopNav";
import Post from "../components/Post";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const feed = trpc.post.getPosts.useQuery();
  const mutation = trpc.post.addToLib.useMutation({
    onSuccess: () => {
      utils.post.getLibrary.invalidate();
    },
  });

  const { data: session } = useSession();

  const handleAddtoLib = (id: string) => {
    console.log("handling");
    if (session?.user) {
      mutation.mutate({ postId: id });
    }
  };

  const renderPosts = () => {
    // loading state
    if (!feed.data) return <div>loading...</div>;

    //empty state
    if (feed.data.length === 0) return <div>no posts</div>;

    return (
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {feed.data.map((post) => {
          return (
            <Post
              description={post.description}
              key={post.id}
              onAddToLib={() => handleAddtoLib(post.id)}
              loggedIn={Boolean(session?.user)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>StudyHub</title>
        <meta
          name="description"
          content="A place to find and share resources for studying in covenant university"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <TopNav />
        {renderPosts()}
      </div>
    </>
  );
};

export default Home;
