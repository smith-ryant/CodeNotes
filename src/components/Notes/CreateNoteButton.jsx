import React from "react";
import ReactDOM from "react-dom";
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

    const onClose = () => {
      noteWindow.close();
    };

    ReactDOM.render(<NoteForm onClose={onClose} />, noteRoot);
  };

  return <button onClick={handleCreateNote}>Create New Note</button>;
};

export default CreateNoteButton;
