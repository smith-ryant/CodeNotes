// code-notes-app/src/components/CodeNotes/NotesList.jsx
// Date & Time: 2024-08-06 @ 22:45

import React from "react";
import "./NoteList.css";

const NotesList = ({ notes, onAddNote }) => {
  return (
    <div className="notes-list">
      <button className="add-note-button" onClick={onAddNote}>
        Add Note
      </button>
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <strong>{note.title}</strong>
            {note.content && <p>{note.content}</p>}{" "}
            {/* Display note content if present */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
