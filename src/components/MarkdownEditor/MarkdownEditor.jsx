// code-notes-app/src/components/MarkdownEditor/MarkdownEditor.jsx
// Date & Time: 2024-08-06 @ 23:30

import React, { useEffect } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./MarkdownEditor.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const MarkdownEditor = ({ content, setContent, setTitle }) => {
  const handleEditorChange = ({ text }) => {
    setContent(text);

    // Set the title based on the first line of the content
    const firstLine = text.split("\n")[0];
    setTitle(firstLine || ""); // Set title to the first line or empty if not available
  };

  useEffect(() => {
    if (!content) {
      // Add placeholder text if content is empty
      setContent("# Enter your note title here\n\nYour note content...");
    }
  }, [content, setContent]);

  return (
    <div className="markdown-editor">
      <MdEditor
        value={content}
        style={{ height: "500px", marginBottom: "20px" }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        placeholder="Enter your Markdown note here..."
      />
    </div>
  );
};

export default MarkdownEditor;
