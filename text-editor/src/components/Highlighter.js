import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./Highlighter.css";
import React from "react";

export const Highlighter = ({ children }) => {
  return (
    <SyntaxHighlighter
      language="javascrpit"
      style={atomOneLight}
      className="highlighter"
    >
      {children}
    </SyntaxHighlighter>
  );
};
