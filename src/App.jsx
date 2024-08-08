// code-notes-app/src/App.jsx
// Date and Time: 2024-08-07 19:55:00

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/store/authContext";
import Home from "./components/HomePage/Home";
import CodeNotes from "./components/CodeNotes/CodeNotes"; // Import the CodeNotes component
import Header from "./components/Header/Header";

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/codenotes"
              element={
                <ProtectedRoute>
                  <CodeNotes />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* Catch-all route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
