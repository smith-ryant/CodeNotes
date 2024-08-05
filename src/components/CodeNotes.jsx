import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import CreateNoteButton from "./Notes/CreateNoteButton";
import NoteForm from "./Notes/NoteForm";

const CodeNotes = ({ userProfile, handleLogout }) => {
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleCreateNote = () => {
    setShowNoteForm(true);
  };

  return (
    <div>
      {userProfile ? (
        <div>
          <h2>Welcome, {userProfile.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <CreateNoteButton onCreate={handleCreateNote} />
          {showNoteForm && <NoteForm />}
        </div>
      ) : (
        <h2>Please log in to access your notes.</h2>
      )}
    </div>
  );
};

export default CodeNotes;
