import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New input for username
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("Successfully logged in");
    }
  };

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error registering:", error.message);
    } else {
      console.log("Successfully registered");

      // Create a user profile after successful registration
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([{ user_id: data.user.id, username }]);

      if (profileError) {
        console.error("Error creating profile:", profileError.message);
      } else {
        console.log("Profile created successfully");
      }
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      {isRegistering && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? "Register" : "Login"}
      </button>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
};

export default LoginForm;
