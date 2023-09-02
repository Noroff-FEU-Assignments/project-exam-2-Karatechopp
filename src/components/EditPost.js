import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { getToken } from "../common/LocalStorage";
import { useEffect, useState } from "react";
import { BASE_API } from "../constants/api";
import { useForm } from "react-hook-form";
import DisplayMessage from "../common/DisplayMessage";
import DeletePostButton from "../common/DeletePostButton";

function EditPost() {
  const [editPostData, setEditPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIdQuery = queryParams.get("id");
  const token = getToken();
  const url = BASE_API + "posts/" + postIdQuery;

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  async function fillEditInputs() {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setEditPostData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setError(error.toString());
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function updatePost(data) {
    const tagsArray = data.tags.split(" ").filter((tag) => tag.trim() !== "");

    const postData = {
      title: data.title,
      body: data.body,
      tags: tagsArray,
      media: data.media,
    };
    try {
      const response = await axios.put(BASE_API + "posts/" + postIdQuery, postData);
      if (response.status === 200) {
        fillEditInputs();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fillEditInputs();
  }, [url]);

  if (loading) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 h-screen">An error occured: {error}</div>;
  }
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 h-screen p-4">
        <div className="px-6 py-8 mx-auto mt-10 lg:py-0">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Update post</h1>
              <form onSubmit={handleSubmit(updatePost)}>
                <div>
                  <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Update title</label>
                  <input
                    defaultValue={editPostData.title}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Title"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  {errors.title && <DisplayMessage messageType="error">Cannot be empty</DisplayMessage>}
                </div>

                <div>
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Update body</label>
                  <textarea
                    defaultValue={editPostData.body}
                    className="resize-y w-full h-auto row bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Body"
                    type="text"
                    onInput={(event) => {
                      event.target.style.height = "auto";
                      event.target.style.height = event.target.scrollHeight + 10 + "px";
                    }}
                    {...register("body", { required: true })}
                  />
                  {errors.title && <DisplayMessage messageType="error">Cannot be empty</DisplayMessage>}
                </div>

                <div>
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Update tags</label>
                  <textarea
                    defaultValue={editPostData.tags.join(" ")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tags"
                    type="text"
                    {...register("tags", {})}
                  />
                </div>

                <div>
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Update media</label>
                  <input
                    defaultValue={editPostData.media}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Media url"
                    type="text"
                    {...register("media", {})}
                  />
                </div>

                <div className="flex flex-row justify-around">
                  <button
                    className="my-5 block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center"
                    type="submit"
                  >
                    Update
                  </button>
                  <Link to={"/ViewPost" + "?id=" + editPostData.id} className="mx-2">
                    <button className="my-5 block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center">
                      Return
                    </button>
                  </Link>
                </div>
              </form>
            </div>
            <DeletePostButton postId={editPostData.id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPost;
