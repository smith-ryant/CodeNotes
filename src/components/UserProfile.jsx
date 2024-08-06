// code-notes-app/src/components/UserProfile.jsx

import React, { useEffect } from "react";
import { useAuth } from "../components/store/authContext";

const UserProfile = () => {
  const { userProfile, fetchUserProfile } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <div>
      {userProfile ? (
        <div>
          <h2>Welcome, {userProfile.username}!</h2>
          <p>
            Profile created at:{" "}
            {new Date(userProfile.created_at).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
