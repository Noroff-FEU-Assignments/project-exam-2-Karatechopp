import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Nav from "./components/layout/Nav";
import { AuthProvider } from "./context/AuthProvider";
import Profiles from "./components/Profiles";
import UpdateAvatarBanner from "./components/UpdateAvatarBanner";
import ViewPost from "./components/ViewPost";
import Home from "./components/Home";
import EditPost from "./components/EditPost";
import CreateNewPost from "./components/CreateNewPost";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/Register" element={<Register />} />
            <Route exact path="/Profile" element={<Profile />} />
            <Route exact path="/Profiles" element={<Profiles />} />
            <Route exact path="/UpdateAvatarBanner" element={<UpdateAvatarBanner />} />
            <Route exact path="/ViewPost" element={<ViewPost />} />
            <Route exact path="/Home" element={<Home />} />
            <Route exact path="/EditPost" element={<EditPost />} />
            <Route exact path="/CreateNewPost" element={<CreateNewPost />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
