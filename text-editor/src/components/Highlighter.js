import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./Highlighter.css";
import React from "react";

export const Highlighter = ({ children }) => {
  return (
    <SyntaxHighlighter
      language="javascrpit"
      style={docco}
      className="highlighter"
    >
      {children}
    </SyntaxHighlighter>
  );
};
