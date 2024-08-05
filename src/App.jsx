import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Home from "../src/components/HomePage/Home";
import CodeNotes from "./components/CodeNotes";
import Header from "./components/Header/Header"; // Import Header component
import { AuthProvider } from "../src/components/store/authContext"; // Import AuthProvider
import "./App.css"; // Import global styles

function App() {
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        console.log("User Profile:", profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Fetch profile error:", error.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error checking user:", error.message);
        } else if (user) {
          console.log("User logged in:", user);
          await fetchUserProfile(user);
        } else {
          console.log("No user logged in");
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
      }
    };

    checkUser();

    window.addEventListener("beforeunload", handleLogout);

    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully");
      setUserProfile(null);
    }
  };

  return (
    <AuthProvider>
      {/* Wrap with AuthProvider */}
      <Router>
        <div className="App">
          <Header /> {/* Render Header component */}
          <div className="content">
            {/* Add content class to provide padding for the header */}
            <Routes>
              <Route path="/" element={<Home onLogin={fetchUserProfile} />} />
              <Route
                path="/codenotes"
                element={
                  userProfile ? (
                    <CodeNotes
                      userProfile={userProfile}
                      handleLogout={handleLogout}
                    />
                  ) : (
                    <h2>Please log in to access your notes.</h2>
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
