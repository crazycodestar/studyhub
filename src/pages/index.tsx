import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
// import { signIn, signOut, useSession } from "next-auth/react";
import TopNav from "../components/TopNav";
import Post from "../components/Post";

const Home: NextPage = () => {
  const feed = trpc.post.getPosts.useQuery();

  const renderPosts = () => {
    // loading state
    if (!feed.data) return <div>loading...</div>;

    //empty state
    if (feed.data.length === 0) return <div>no posts</div>;

    return (
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        {feed.data.map((post) => {
          return <Post description={post.description} key={post.id} />;
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
