// code-notes-app/src/components/CodeNotes/CodeNotes.jsx
// Date & Time: 2024-08-06 @ 23:30

import React, { useState, useEffect } from "react";
import NotesList from "./NoteList";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"; // Import Markdown Editor
import { supabase } from "../../supabaseClient"; // Import Supabase client
import "./CodeNotes.css";

const CodeNotes = () => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState(""); // State for note content
  const [newNoteTitle, setNewNoteTitle] = useState(""); // State for note title

  // Fetch the current session and user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(); // Correct method to get user
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(user);
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
            setNotes(data);
          }
        } catch (error) {
          console.error("Unexpected error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [user]); // Depend on user

  const handleAddNote = async () => {
    if (!newNoteTitle) {
      console.log("Note title is required.");
      return;
    }

    try {
      // Ensure user is authenticated
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Add new note to Supabase
      const { data, error } = await supabase.from("notes").insert([
        {
          title: newNoteTitle, // Use extracted title from first line
          content: newNoteContent, // Use content from markdown editor
          user_id: user.id, // Use the authenticated user's ID
        },
      ]);

      if (error) {
        console.error("Error adding note:", error.message);
      } else {
        console.log("Note added successfully:", data);

        // Update local state with the new note
        setNotes((prevNotes) => [...prevNotes, data[0]]);
      }
    } catch (error) {
      console.error("Unexpected error adding note:", error);
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
        <p>This is where you can start developing the CodeNotes page.</p>
      </div>
    </div>
  );
};

export default CodeNotes;
