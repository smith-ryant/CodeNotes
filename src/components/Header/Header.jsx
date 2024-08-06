// src/components/Header/Header.jsx

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import AuthContext from "../store/authContext"; // Ensure correct path
import logo from "../../assets/react.svg"; // Correct path for your logo file
import logo2 from "../../assets/vite.svg";

const Header = () => {
  const { state, dispatch } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Logged out successfully");
      dispatch({ type: "LOGOUT" });
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
