import React, { useState } from "react";
import { useAuth } from "../store/authContext";
import "./Home.css";

const Home = () => {
  const { login, register, fetchUserProfile } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await login(email, password);
        setMessage("Login successful!");
        fetchUserProfile();
      } catch (error) {
        setMessage(`Error logging in: ${error.message}`);
      }
    } else {
      try {
        await register(email, password, username);
        setMessage("Sign up successful! Please log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        setIsLogin(true);
      } catch (error) {
        setMessage(`Error signing up: ${error.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {isLogin ? "Welcome Back!" : "Create An Account"}
      </h1>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="auth-button">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <button onClick={toggleAuthMode} className="switch-button">
        {isLogin ? "Need to Register?" : "Switch to Login"}
      </button>
    </div>
  );
};

export default Home;
