// code-notes-app/src/components/Notes/NoteForm.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust the path as needed

const NoteForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User not logged in");
      alert("Please log in to save notes.");
      return;
    }

    const { error } = await supabase
      .from("notes")
      .insert([{ title, content, is_private: isPrivate, user_id: userId }]);

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
