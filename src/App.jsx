// src/App.jsx

import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Home from "./components/HomePage/Home";
import CodeNotes from "./components/CodeNotes";
import Header from "./components/Header/Header";
import { AuthProvider, useAuth } from "./components/store/authContext";

function App() {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error checking user:", error.message);
          return;
        }

        console.log("User data fetched: ", user); // Log user data

        if (user) {
          console.log("User logged in:", user);
          const profile = await fetchUserProfile(user);
          dispatch({
            type: "LOGIN",
            payload: { token: user.access_token, userProfile: profile },
          });
        }
      } catch (err) {
        console.error("Unexpected error checking user:", err.message);
      }
    };

    checkUser();
  }, [dispatch]);

  const fetchUserProfile = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
      }
      return profile;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err.message);
      return null;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/codenotes" element={<CodeNotes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
