// src/components/UserProfile.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profileData, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
    } else {
      console.log("User Profile:", profileData);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>Welcome, {profile.username}!</h2>
          <p>
            Profile created at:{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
