import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../store/authContext";

const NoteForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const {
    state: { token },
    userProfile,
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userProfile || !token) {
      console.error("User not logged in");
      alert("Please log in to save notes.");
      return;
    }

    const { error } = await supabase
      .from("notes")
      .insert([
        { title, content, is_private: isPrivate, user_id: userProfile.user_id },
      ]);

    if (error) {
      console.error("Error saving note:", error.message);
    } else {
      console.log("Note saved successfully");
      setTitle("");
      setContent("");
      setIsPrivate(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private
        </label>
        <button type="submit">Save Note</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default NoteForm;
