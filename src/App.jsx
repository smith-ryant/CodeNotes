import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Home from "./components/Home";
import CodeNotes from "./components/CodeNotes";

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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error checking user:", error.message);
        // Optionally redirect to login if the session is expired
        // You can use a navigate function or set a state to show login
      } else if (user) {
        console.log("User logged in:", user);
        fetchUserProfile(user); // Pass the user object to fetchUserProfile
      } else {
        console.log("No user logged in");
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
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {userProfile && (
              <li>
                <Link to="/codenotes">CodeNotes</Link>
              </li>
            )}
          </ul>
        </nav>
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
    </Router>
  );
}

export default App;
