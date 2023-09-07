import { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearStorageLogout, getProfileName } from "../../common/LocalStorage";

function Nav() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [auth, setAuth] = useContext(AuthContext);
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    if (!auth && location.pathname !== "/Register") {
      navigate("/");
    }
  }, [auth, location.pathname, navigate]);

  function logout() {
    setAuth(null);
    clearStorageLogout();
    navigate("/");
  }

  useEffect(() => {
    setDropdownOpen(false);
  }, [auth, location]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleEmojiDropdown = () => {
    return isDropdownOpen ? "🗙" : "☰";
  };

  return (
    <nav className="bg-gray-700 p-4">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        <Link to={"/Profile?name=" + getProfileName()} className="text-white font-bold text-lg">
          Noroff social
        </Link>
        <div className="block sm:hidden">
          <button className="text-white hover:text-gray-200 focus:outline-none text-3xl" onClick={toggleDropdown}>
            {toggleEmojiDropdown()}
          </button>
        </div>
        <div className="hidden sm:flex space-x-4">
          {auth ? (
            <>
              <NavLink to="/Home" className="text-white">
                Home
              </NavLink>
              <NavLink to="/Profiles" className="text-white">
                All Profiles
              </NavLink>
              <NavLink to={"/Profile?name=" + getProfileName()} className="text-white">
                Your profile
              </NavLink>
              <button className="text-white" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink className="text-white" to="/">
              Login
            </NavLink>
          )}
        </div>
      </div>

      <div className={`${!isDropdownOpen && "hidden"} absolute text-white left-0 bg-gray-700 w-full p-4 sm:hidden text-right`}>
        {auth ? (
          <>
            <NavLink to="/Home" className="block mt-4">
              Home
            </NavLink>
            <NavLink to="/Profiles" className="block mt-4">
              All Profiles
            </NavLink>
            <NavLink to={"/Profile?name=" + getProfileName()} className="block mt-4">
              Your profile
            </NavLink>
            <button className="mt-4" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink className="block mt-4 text-gray-900 dark:text-white" to="/">
              Login
            </NavLink>
            <NavLink className="block mt-4 text-gray-900 dark:text-white" to="/Register">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
