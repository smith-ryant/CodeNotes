// code-notes-app/src/components/store/authContext.jsx
// Date and Time: 2024-08-06 17:30:00

import React, { createContext, useReducer, useContext, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

const initialState = {
  userProfile: null,
  token: null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        userProfile: action.payload.userProfile,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        userProfile: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchUserProfile = async (user) => {
    try {
      console.log("Fetching user profile for user ID:", user.id);
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
      }
      console.log("Profile fetched:", profile);
      return profile;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err.message);
      return null;
    }
  };

  const register = async (email, password, username) => {
    try {
      console.log("Attempting to register user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(`Sign-up error: ${error.message}`);

      const userId = data.user?.id;
      if (!userId) throw new Error("User ID not returned after sign-up.");

      console.log("User registered with ID:", userId);

      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([{ user_id: userId, email, username }]);

      if (profileError)
        throw new Error(`Profile creation error: ${profileError.message}`);

      console.log("Profile created for user ID:", userId);

      return { success: true };
    } catch (err) {
      console.error(`Registration failed: ${err.message}`);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting to login user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw new Error(`Login error: ${error.message}`);
      }

      const user = data.user;
      if (!user) {
        console.error("Login failed, no user returned.");
        throw new Error("Login failed, no user returned.");
      }

      console.log("User logged in successfully:", user);

      const profile = await fetchUserProfile(user);
      dispatch({
        type: "LOGIN",
        payload: { token: user.access_token, userProfile: profile },
      });

      return { success: true };
    } catch (err) {
      console.error(`Login failed: ${err.message}`);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: "LOGOUT" });
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error.message);
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
          return;
        }

        if (user) {
          console.log("User detected on initial load:", user);
          const profile = await fetchUserProfile(user);
          dispatch({
            type: "LOGIN",
            payload: { token: user.access_token, userProfile: profile },
          });
        } else {
          console.log("No user session found on initial load.");
        }
      } catch (err) {
        console.error("Unexpected error checking user:", err.message);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`);
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

    // Listen for page unload or close to clear auth state
    const handleBeforeUnload = () => {
      logout(); // Automatically log out
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ state, dispatch, fetchUserProfile, register, login, logout }}
    >
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
