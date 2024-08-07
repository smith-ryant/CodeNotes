// code-notes-app/src/components/Header/Header.jsx
// Date & Time: 2024-08-06 @ 21:00

import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation hook
import "./Header.css";
import AuthContext from "../store/authContext"; // Importing authentication context
import logo from "../../assets/react.svg"; // Path for the logo image
import logo2 from "../../assets/vite.svg";
import { supabase } from "../../supabaseClient"; // Importing the supabase client

const Header = () => {
  const { state, dispatch } = useContext(AuthContext);
  const location = useLocation(); // Get the current path

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
        <ul className="main-nav">
          <li>
            <NavLink style={styleActiveLink} to="/">
              Home
            </NavLink>
          </li>
          {state.isAuthenticated &&
            location.pathname !== "/codenotes" && ( // Check for authenticated state and path
              <>
                <li>
                  <NavLink style={styleActiveLink} to="/codenotes">
                    CodeNotes
                  </NavLink>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
