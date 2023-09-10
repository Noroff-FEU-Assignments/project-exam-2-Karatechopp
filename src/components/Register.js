import DisplayMessage from "../common/DisplayMessage";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API } from "../constants/api";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      const response = await axios.post(BASE_API + "auth/register/", data);
      if (response.status === 200) {
        navigate("/Profile?name=" + response.data.name);
      }
    } catch (error) {
      console.log("error:", error.response.data.errors[0]);
    }
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Register account</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Enter desired name
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name"
                    {...register("name", { minLength: 3, required: true, pattern: /^[a-zA-Z0-9_-]*$/ })}
                  />
                  {errors.name && (
                    <DisplayMessage messageType="error text-gray-900 dark:text-white">Minimum lenght 3 with no special characters</DisplayMessage>
                  )}
                </div>

                <div>
                  <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter email</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                    type="email"
                    {...register("email", { pattern: /[A-Za-z]+@stud\.noroff\.no/, required: true })}
                  />
                  {errors.email && <DisplayMessage messageType="error text-gray-900 dark:text-white">Must be valid stud.noroff.no email</DisplayMessage>}
                </div>

                <div>
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Enter password</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    type="password"
                    {...register("password", { minLength: 8, required: true })}
                  />
                  {errors.password && <DisplayMessage messageType="error text-gray-900 dark:text-white">Minimum lenght 8</DisplayMessage>}
                </div>

                <button
                  className="w-3/6 my-5 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center"
                  type="submit"
                >
                  Register
                </button>
              </form>
              <Link to="/">
                <div className="text-lg leading-tight tracking-tight text-gray-900 md:text-md dark:text-white hover:underline">
                  Already have an account? Login here.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
