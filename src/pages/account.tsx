import Post from "../components/Post";
import TopNav from "../components/TopNav";

const Account = () => {
  return (
    <div>
      <TopNav />
      <div className="mx-auto mt-8 w-1/3">
        {/* posts container */}
        <Post isEditable />
        <Post isEditable />
        <Post isEditable />
        <Post isEditable />
      </div>
    </div>
  );
};

export default Account;
