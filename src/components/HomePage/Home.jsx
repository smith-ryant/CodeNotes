// code-notes-app/src/components/HomePage/Home.jsx
// Date and Time: 2024-08-06 17:30:00

import React, { useState, useEffect } from "react";
import { useAuth } from "../store/authContext";
import "./Home.css";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
  const { state, login, register, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Ensure minimum length
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage("Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true); // Start loading
    setMessage(""); // Clear message on submit
    console.log("Form submitted:", { email, isLogin });

    try {
      if (isLogin) {
        const result = await login(email, password); // Call the login function
        if (result.success) {
          console.log("Login successful:", email);
          setMessage("Login successful!");
          setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
          navigate("/codenotes"); // Redirect to CodeNotes page
        }
      } else {
        const result = await register(email, password, username);
        if (result.success) {
          console.log("Registration successful:", email);
          setMessage("Sign up successful! Please log in.");
          setUsername("");
          setEmail("");
          setPassword("");
          setIsLogin(true);
        }
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Submission error:", error.message);
    } finally {
      setLoading(false); // Stop loading
      console.log("Finished login/register process");
    }
  };

  const handleLogout = async () => {
    await logout(); // Use the logout function from context
    setMessage("You have been logged out.");
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      console.log(
        "User is authenticated, stopping spinner and showing logout."
      );
      setLoading(false);
      setMessage(
        "Welcome back, " + (state.userProfile?.username || email) + "!"
      );
    } else {
      console.log("User is not authenticated, showing login/signup form.");
    }
  }, [state.isAuthenticated, state.userProfile, email]);

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {state.isAuthenticated
          ? `Welcome ${state.userProfile?.username || "Back!"}`
          : isLogin
          ? "Welcome Back!"
          : "Create An Account"}
      </h1>
      {!state.isAuthenticated ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Spinner /> : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={handleLogout} className="auth-button">
            Logout
          </button>
        </div>
      )}

      {/* Conditionally render message only if it's not empty */}
      {message && !state.isAuthenticated && (
        <p className="auth-message">{message}</p>
      )}

      {!state.isAuthenticated && (
        <button onClick={toggleAuthMode} className="switch-button">
          {isLogin ? "Need to Register?" : "Switch to Login"}
        </button>
      )}
    </div>
  );
};

export default Home;
