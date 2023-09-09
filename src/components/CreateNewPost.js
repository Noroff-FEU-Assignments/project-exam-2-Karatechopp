import axios from "axios";
import { useForm } from "react-hook-form";
import DisplayMessage from "../common/DisplayMessage";
import { BASE_API } from "../constants/api";
import { getToken } from "../common/LocalStorage";
import { useNavigate } from "react-router-dom";

function CreateNewPost() {
  const token = getToken();
  const navigate = useNavigate();

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function createPost(data) {
    const tagsArray = data.tags.split(" ").filter((tag) => tag.trim() !== "");

    const postData = {
      title: data.title,
      body: data.body,
      tags: tagsArray,
      media: data.media,
    };

    try {
      const response = await axios.post(BASE_API + "posts", postData);
      if (response.status === 200) {
        navigate("/ViewPost?id=" + response.data.id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 h-screen p-4">
      <div className="px-6 py-8 mx-auto mt-10 lg:py-0">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create new post</h1>
            <form onSubmit={handleSubmit(createPost)}>
              <div>
                <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Title"
                  type="text"
                  {...register("title", { required: true })}
                />
                {errors.title && <DisplayMessage messageType="error">Cannot be empty</DisplayMessage>}
              </div>

              <div>
                <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Body</label>
                <textarea
                  className="resize-y w-full h-auto row bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Body"
                  type="text"
                  onInput={(event) => {
                    event.target.style.height = "auto";
                    event.target.style.height = event.target.scrollHeight + 10 + "px";
                  }}
                  {...register("body", {})}
                />
                {errors.title && <DisplayMessage messageType="error">Cannot be empty</DisplayMessage>}
              </div>

              <div>
                <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Tags"
                  type="text"
                  {...register("tags", {})}
                />
              </div>

              <div>
                <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Media</label>
                <input
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewPost;
