// code-notes-app/src/components/Notes/CreateNoteButton.jsx

import React from "react";
// Import NoteForm from the correct relative path
import NoteForm from "../Notes/NoteForm";

const CreateNoteButton = () => {
  const handleCreateNote = () => {
    const noteWindow = window.open(
      "",
      "_blank",
      "width=400,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    );

    noteWindow.document.title = "Create New Note";

    const noteRoot = noteWindow.document.createElement("div");
    noteWindow.document.body.appendChild(noteRoot);

    // Pass the onClose function to close the window
    const onClose = () => {
      noteWindow.close();
    };

    // Render the NoteForm in the new window
    noteWindow.React = React;
    noteWindow.ReactDOM = require("react-dom");
    noteWindow.ReactDOM.render(<NoteForm onClose={onClose} />, noteRoot);
  };

  return <button onClick={handleCreateNote}>Create New Note</button>;
};

export default CreateNoteButton;
