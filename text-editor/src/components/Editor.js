import "./Editor.css";
import React  from 'react';

export const Editor = ({ placeHolder, onChange, onKeyDown }) => {
  return (
    <textarea
      className="editor"
      placeholder={placeHolder}
      onChange={onChange}
    ></textarea>
  );
};