import { Link } from "react-router-dom";
import DisplayMessage from "../common/DisplayMessage";
import { useForm } from "react-hook-form";
import { getProfileName, getToken } from "../common/LocalStorage";
import axios from "axios";
import { BASE_API } from "../constants/api";
import { useEffect, useState } from "react";

export function UpdateAvatarBanner() {
  const token = getToken();
  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("");

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  async function fillInputs() {
    try {
      const response = await axios.get(BASE_API + "profiles/" + getProfileName());
      setBanner(response.data.banner || "");
      setAvatar(response.data.avatar || "");
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(function () {
    fillInputs();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function updateMedia(data) {
    try {
      const response = await axios.put(BASE_API + "profiles/" + getProfileName() + "/media", data);
      if (response.status === 200) {
        fillInputs();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 h-screen">
      {banner !== null && banner !== "" ? (
        <img src={banner} alt="Banner" className="w-full max-h-96 object-cover mb-2" />
      ) : (
        <div className="text-gray-900 dark:text-white text-center mb-16">No banner</div>
      )}

      {avatar !== null && avatar !== "" ? (
        <img src={avatar} alt="Avatar" className="w-40 h-40 rounded-full mx-auto -mt-8 object-cover" />
      ) : (
        <div className="mx-auto mt-5 text-gray-900 dark:text-white text-center">No avatar</div>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-10 lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Update avatar and banner</h1>
            <p className="leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">Leave fields empty to have no avatar or banner</p>
            <form onSubmit={handleSubmit(updateMedia)}>
              <div>
                <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Update Banner</label>
                <input
                  defaultValue={banner}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Banner url"
                  type="text"
                  {...register("banner", {})}
                />
                {errors.banner && <DisplayMessage messageType="error">Must be a valid url</DisplayMessage>}
              </div>

              <div>
                <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Update Avatar</label>
                <input
                  defaultValue={avatar}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Avatar url"
                  type="text"
                  {...register("avatar", {})}
                />
                {errors.avatar && <DisplayMessage messageType="error">Must be a valid url</DisplayMessage>}
              </div>
              <div className="flex flex-row justify-around">
                <button
                  className="my-5 block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center"
                  type="submit"
                >
                  Update
                </button>
                <Link to={"/Profile?name=" + getProfileName()} className="mx-2">
                  <button className="my-5 block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center">
                    Return
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAvatarBanner;
