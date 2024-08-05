// code-notes-app/src/components/Home.jsx

import React, { useState } from "react";
import "./Home.css";

const Home = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Implement login logic
      console.log("Logging in:", username, password);
    } else {
      // Implement registration logic
      console.log("Registering:", username, email, password);
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
        {!isLogin && (
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
        )}
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
      <button onClick={toggleAuthMode} className="switch-button">
        {isLogin ? "Need to Register?" : "Switch to Login"}
      </button>
    </div>
  );
};

export default Home;
