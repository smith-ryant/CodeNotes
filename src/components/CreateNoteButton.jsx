import React from "react";

const CreateNoteButton = ({ onCreate }) => {
  return <button onClick={onCreate}>Create New Note</button>;
};

export default CreateNoteButton;
