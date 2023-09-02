import DisplayMessage from "../common/DisplayMessage";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_API } from "../constants/api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [, setAuth] = useContext(AuthContext);

  async function onSubmit(data) {
    try {
      const response = await axios.post(BASE_API + "auth/login", data);
      console.log(response);

      if (response.data.accessToken) {
        localStorage.setItem("ns_name", response.data.name);
        localStorage.setItem("ns_email", response.data.email);
        localStorage.setItem("ns_token", response.data.accessToken);
        setAuth(response.data.accessToken);
        navigate("/Profile?name=" + response.data.name);
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Login</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter email</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                    type="email"
                    {...register("email", { pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, required: true })}
                  />
                  {errors.email && <DisplayMessage messageType="error">Must be valid noroff.no email</DisplayMessage>}
                </div>

                <div>
                  <label className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Enter password</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    type="password"
                    {...register("password", { minLength: 8, required: true, pattern: /^[a-zA-Z0-9_-]*$/ })}
                  />
                  {errors.password && <DisplayMessage messageType="error">Minimum lenght 8</DisplayMessage>}
                </div>

                <button
                  className="w-3/6 my-5 mx-auto block text-white bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center"
                  type="submit"
                >
                  Login
                </button>
              </form>
              <Link to="/Register">
                <div className="text-lg leading-tight tracking-tight text-gray-900 md:text-md dark:text-white hover:underline">
                  Dont have an account? Register here.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
