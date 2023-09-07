import axios from "axios";
import { BASE_API } from "../constants/api";
import { getToken } from "../common/LocalStorage";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profiles() {
  const url = BASE_API + "profiles";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const token = getToken();

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const getProfiles = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setProfiles(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setError(error.toString());
    }
  }, [url]);

  useEffect(
    function () {
      getProfiles();
    },
    [getProfiles]
  );

  if (loading) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">An error occured: {error}</div>;
  }

  return (
    <>
      <div className="max-w-7xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 mx-auto p-4">
        <h1 className="text-4xl font-semibold mb-4 text-center">All Profiles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile, index) => (
            <Link key={index} to={`/Profile?name=${profile.name}`} className="hover:opacity-70">
              <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 rounded shadow border-2 border-gray-200 dark:border-gray-700 p-4">
                {profile.banner ? (
                  <img src={profile.banner} alt={`${profile.name}'s banner`} className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="w-full h-32 text-center">No banner</div>
                )}
                {profile.avatar ? (
                  <img src={profile.avatar} alt={`${profile.name}'s avatar`} className="w-16 h-16 object-cover rounded-full mx-auto mb-2" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">?</span>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-center">{profile.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profiles;
