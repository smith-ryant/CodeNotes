// code-notes-app/src/App.jsx
// Date and Time: 2024-08-06 16:00:00

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/store/authContext";
import Home from "./components/HomePage/Home";
import CodeNotes from "./components/CodeNotes/CodeNotes"; // Import the CodeNotes component
import Header from "./components/Header/Header";

function App() {
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
