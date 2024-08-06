// code-notes-app/src/components/Header/Header.jsx
// Date/Time: 2024-08-06

import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import "./Header.css";
import AuthContext from "../store/authContext"; // Importing authentication context
import logo from "../../assets/react.svg"; // Path for the logo image
import logo2 from "../../assets/vite.svg";
import { supabase } from "../../supabaseClient"; // Importing the supabase client

const Header = () => {
  const { state, dispatch } = useContext(AuthContext);
  const location = useLocation(); // Get the current location

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Logged out successfully");
      dispatch({ type: "LOGOUT" }); // Dispatch logout action
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const styleActiveLink = ({ isActive }) => ({
    color: isActive ? "#f57145" : "#f0f0f0",
  });

  return (
    <header className="header">
      <div className="logo-title-container">
        <img src={logo} alt="react-logo" className="logo" />
        <img src={logo2} alt="vite-logo" className="logo" />
        <h2>CodeNotes</h2>
      </div>
      <nav>
        {state.token ? (
          <ul className="main-nav">
            {location.pathname !== "/codenotes" ? ( // Conditional rendering based on location
              <>
                <li>
                  <NavLink style={styleActiveLink} to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink style={styleActiveLink} to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink style={styleActiveLink} to="/form">
                    Add Post
                  </NavLink>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink style={styleActiveLink} to="/">
                  Home
                </NavLink>
              </li>
            )}
          </ul>
        ) : (
          <ul className="main-nav">
            <li>
              <NavLink style={styleActiveLink} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink style={styleActiveLink} to="/auth">
                Login or Sign Up
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
