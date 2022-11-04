import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
// import { signIn, signOut, useSession } from "next-auth/react";
import TopNav from "../components/TopNav";
import Post from "../components/Post";
import { useSession } from "next-auth/react";
import { usePopUp } from "../layouts/Popup";

const Home: NextPage = () => {
  const { open, setValue } = usePopUp((state) => ({
    open: state.open,
    setValue: state.setValue,
  }));
  const utils = trpc.useContext();
  const feed = trpc.post.getPosts.useQuery();
  const mutation = trpc.post.addToLib.useMutation({
    onSuccess: () => {
      utils.post.getLibrary.invalidate();
      // add to library popup
      setValue("added to library");
      return open();
    },
    onError: (error) => {
      setValue(error.message, "error");
      return open();
    },
  });

  const { data: session } = useSession();

  const handleAddtoLib = (id: string) => {
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
              post={post}
              key={post.id}
              onAddToLib={() => handleAddtoLib(post.id)}
              // loggedIn={Boolean(session?.user)}
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
