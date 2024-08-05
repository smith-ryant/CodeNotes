import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const NoteForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [userId, setUserId] = useState(null); // Store user ID

  // Fetch user ID when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else if (user) {
        setUserId(user.id); // Set user ID if available
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User not logged in");
      alert("Please log in to save notes.");
      return; // Exit if user is not logged in
    }

    const { error } = await supabase
      .from("notes")
      .insert([{ title, content, is_private: isPrivate, user_id: userId }]);

    if (error) {
      console.error("Error saving note:", error.message);
    } else {
      console.log("Note saved successfully");
      // Reset form
      setTitle("");
      setContent("");
      setIsPrivate(false);
    }
  };

  return (
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
  );
};

export default NoteForm;
