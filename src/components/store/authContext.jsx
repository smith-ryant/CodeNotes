// src/components/store/authContext.jsx

import React, { createContext, useReducer, useContext, useEffect } from "react";
import { supabase } from "../../supabaseClient";

// Create context for auth
const AuthContext = createContext();

const initialState = {
  userProfile: null,
  token: null,
};

// Reducer for handling auth actions
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        userProfile: action.payload.userProfile,
      };
    case "LOGOUT":
      return { ...state, token: null, userProfile: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to fetch user profile
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

  // Effect to check user on mount and listen for auth changes
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

        if (user) {
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

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const profile = await fetchUserProfile(session.user);
          dispatch({
            type: "LOGIN",
            payload: { token: session.access_token, userProfile: profile },
          });
        } else if (event === "SIGNED_OUT") {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe();
      } else {
        console.warn("authListener is not defined correctly");
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
