import axios from "axios";
import { BASE_API } from "../constants/api";
import { getToken } from "../common/LocalStorage";
import { useEffect, useState } from "react";
import { PostCard } from "../common/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();
  const urlFollowing = BASE_API + "posts/following?_author=true&sortOrder=desc";
  const urlAll = BASE_API + "posts?_author=true&sortOrder=desc";

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  async function getPostsFollowing() {
    setLoading(true);
    try {
      const response = await axios.get(urlFollowing);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  async function getPostsAll() {
    setLoading(true);
    try {
      const response = await axios.get(urlAll);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  useEffect(() => {
    getPostsFollowing();
  }, []);

  if (loading) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">An error occured: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 max-h-full min-h-screen p-4">
      <div>
        <button
          onClick={getPostsFollowing}
          className="my-2 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center"
        >
          Following posts
        </button>
        <button
          onClick={getPostsAll}
          className="my-2 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center"
        >
          All posts
        </button>
      </div>
      <h1 className="text-3xl text-center font-semibold p-5">Followed users posts</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} avatar={post.author.avatar} />
      ))}
    </div>
  );
}

export default Home;
