// code-notes-app/src/components/CodeNotes/CodeNotes.jsx
// Date & Time: 2024-08-07 @ 21:40

import React, { useState, useEffect } from "react";
import NotesList from "./NoteList";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"; // Import Markdown Editor
import { supabase } from "../../supabaseClient"; // Import Supabase client
import Spinner from "../Spinner/Spinner"; // Import Spinner component
import "./CodeNotes.css";

const CodeNotes = () => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState(""); // State for note content
  const [newNoteTitle, setNewNoteTitle] = useState(""); // State for note title
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch the current session and user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(); // Correct method to get user
        if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          console.log("Fetched user:", user);
          setUser(user);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch notes from Supabase for the logged-in user
  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        try {
          const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id) // Fetch only notes for the logged-in user
            .order("id", { ascending: true });

          if (error) {
            console.error("Error fetching notes:", error.message);
          } else {
            console.log("Fetched notes:", data);
            setNotes(data);
          }
        } catch (error) {
          console.error("Unexpected error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [user]); // Depend on user

  const handleAddNote = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!newNoteTitle || !newNoteContent) {
      setError("Both title and content are required.");
      return;
    }

    setLoading(true); // Set loading to true
    setError(""); // Clear previous errors

    try {
      // Ensure user is authenticated
      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      console.log("Adding note:", {
        title: newNoteTitle,
        content: newNoteContent,
      });

      // Add new note to Supabase
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: newNoteTitle, // Use extracted title from first line
            content: newNoteContent, // Use content from markdown editor
            user_id: user.id, // Use the authenticated user's ID
          },
        ])
        .select("*");

      if (error) {
        console.error("Error adding note:", error.message);
        setError("Error adding note. Please try again.");
      } else {
        console.log("Note added successfully:", data);

        // Update local state with the new note
        if (data && data.length > 0) {
          console.log("New note data:", data[0]);
          setNotes((prevNotes) => [...prevNotes, data[0]]);
        } else {
          console.error("Unexpected response format:", data);
          setError("Unexpected response format. Please try again.");
        }
        // Clear the editor content
        setNewNoteContent("");
        setNewNoteTitle("");
      }
    } catch (error) {
      console.error("Unexpected error adding note:", error);
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="code-notes-container">
      <NotesList notes={notes} onAddNote={handleAddNote} />
      <div className="code-notes-content">
        <h1>CodeNotes</h1>
        <MarkdownEditor
          content={newNoteContent}
          setContent={setNewNoteContent}
          setTitle={setNewNoteTitle} // Pass setTitle to MarkdownEditor
        />
        <button
          className="save-note-button"
          onClick={handleAddNote}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Save Note"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CodeNotes;
