import axios from "axios";
import { BASE_API } from "../constants/api";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PostCard } from "../common/PostCard";
import { getProfileName, getToken } from "../common/LocalStorage";

function Profile() {
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileNameQuery = queryParams.get("name");
  const token = getToken();
  const url = BASE_API + "profiles/" + profileNameQuery + "?_followers=true&_following=true&_posts=true&";

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  async function getProfile() {
    try {
      const response = await axios.get(url);
      response.data.posts.sort((a, b) => new Date(b.created) - new Date(a.created));
      setProfileData(response.data);
      setIsFollowing(checkFollowStatus(response.data.followers));
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setError(error.toString());
    }
  }

  async function UpdateFollowProfile(name, update) {
    const url = BASE_API + "profiles/" + name + update;

    try {
      const response = await axios.put(url);

      if (response.status === 200) {
        getProfile();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function checkFollowStatus(followers) {
    if (followers.some((follower) => follower.name === getProfileName())) {
      return "/unfollow";
    } else {
      return "/follow";
    }
  }

  useEffect(function () {
    getProfile();
  }, []);

  if (loading) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">An error occured: {error}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 max-h-full min-h-screen">
        {profileData.banner !== null && profileData.banner !== "" ? (
          <img src={profileData.banner} alt="Banner" className="w-full max-h-96 object-cover rounded-t mb-2" />
        ) : (
          <div className="text-gray-900 dark:text-white text-center mb-16">No banner</div>
        )}
        <div className="p-4">
          <div className="mb-4">
            <div className="container mx-auto">
              {profileData.avatar !== null && profileData.avatar !== "" ? (
                <img src={profileData.avatar} alt="Avatar" className="w-40 h-40 rounded-full mx-auto -mt-8 object-cover" />
              ) : (
                <div className="w-40 h-40 rounded-full mx-auto bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-7xl font-semibold">?</span>
                </div>
              )}
            </div>
            {profileNameQuery === getProfileName() ? (
              <Link to="/UpdateAvatarBanner">
                <button className="my-5 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center">
                  Update Avatar and banner
                </button>
              </Link>
            ) : (
              <button
                onClick={() => UpdateFollowProfile(profileNameQuery, isFollowing)}
                className="my-5 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center"
              >
                {isFollowing === "/follow" ? "Follow user" : "Unfollow user"}
              </button>
            )}
            <h1 className="text-4xl mb-4">{profileData.name}</h1>
            <div className="flex flex-row justify-evenly max-w-xs mx-auto">
              <div className="flex-col">
                <div>Followers</div>
                <div>{profileData.followers.length}</div>
              </div>
              <div className="flex-col">
                <div>Following</div>
                <div>{profileData.following.length}</div>
              </div>
            </div>
            <div className="mt-5">{profileData.email}</div>
          </div>
          <Link to={"/CreateNewPost"}>
            <button className="my-5 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-4 py-1.5 text-center">
              Create new post
            </button>
          </Link>
          <div>
            <h2 className="text-center mx-auto mb-2 text-2xl font-semibold">Posts</h2>
            {profileData.posts.length === 0 ? (
              <div className="text-center mx-auto">user has no posts</div>
            ) : (
              profileData.posts.map((post) => <PostCard key={post.id} post={post} avatar={profileData.avatar} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
