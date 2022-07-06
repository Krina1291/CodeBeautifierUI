import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { List } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Editor } from "./components/Editor";
import { Highlighter } from "./components/Highlighter";

import "./App.css";

import GlobalOptions from "./lib/GlobalOptions";
import Beautifier from "./lib";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState({});

  useEffect(() => {
    resetOptions();
  }, []);

  const resetOptions = () => {
    let defaultOptions = {};
    GlobalOptions("javascript").forEach((option) => {
      defaultOptions[option.name] = false;
    });
    setOptions(defaultOptions);
  };

  const handleCheckbox = (event) => {
    setOptions((s) => ({
      ...s,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSubmit = async () => {
    let result = await Beautifier(input, options, "javascript");
    setOutput(result);
  };

  return (
    <>
      <div className="Head">
        <h3>Beautify Your Code</h3>
        <p>Team THAKUR</p>
      </div>
      <div className="App">
        <div className="container">
          <div className="ControlsBox">
            <div className="control">
              <h4>Javascript Code</h4>
            </div>
            <div className="control">
              <h4>Beautified Code</h4>
            </div>
          </div>

          <div className="PanelsBox">
            <div className="text-area">
              <Editor
                placeHolder="Type or Paste your code here..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="text-area">
              <Highlighter>{output}</Highlighter>
            </div>
          </div>

          <div>
            <Grid container spacing={2}>
              <Grid item xs={7} marginTop="20px" marginLeft={5}>
                <h2> Javascript Code Formatter</h2>

                <List align="justify">
                  Format your javascript code and make it readable.
                  Well-formatted javascript code reduces development time. It
                  also helps you spot bugs faster.
                  <br></br>
                  <br></br>
                  The javascript beautifier will indent your code, will remove
                  empty spaces, will move each statement on a new line.
                </List>
              </Grid>

              <Grid item xs={8} marginTop="20px" marginLeft={5}>
                <h2> Conventions Used:</h2>
                <div className="Conventions">
                  <br></br>
                  <p>
                                      <strong>Label 1: </strong>Always use single quotes for
                  </p>
                  <p>
                                      <strong>Label 2: </strong>Add a space after keywords 
                    strings
                  </p>
                  <p>
                                      <strong>Label 3: </strong>Always use === instead of == 
                  </p>
                  <p>
                                      <strong>Label 4: </strong>Remove multiple blank lines 
                  </p>
                  <p>
                                      <strong>Label 5: </strong>Remove unnecessary spaces
                  </p>
                  <p>
                                      <strong>Label 6: </strong>Shifts dot operator from last
                    token of previous line to first token of next line
                  </p>
                  <p>
                                      <strong>Label 7: </strong>Remove parentheses and make single
                    line If statement in one line
                  </p>
                  <p>
                                      <strong>Label 8: </strong>Add Padding around operators
                  </p>
                  <p>
                                      <strong>Label 9: </strong>Add Space inside single line
                    braces
                  </p>
                  <p>
                                      <strong>Label 10: </strong>Indentation using 2 spaces
                  </p>
                  <br></br>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-options">
            <h3>Options</h3>
            {GlobalOptions("javascript").map((option) => (
              <div className="option">
                <FormControlLabel
                  control={
                    <Switch
                      checked={options[option.name]}
                      name={option.name}
                      color="secondary"
                      onChange={handleCheckbox}
                    />
                  }
                  label={option.desc}
                />
              </div>
            ))}
          </div>

          <div className="sidebar-buttons">
            <button type="button" class="Beautify" onClick={handleSubmit}>
              Beautify Code
            </button>
            {/* <button type="button" class="Reset" onClick={resetOptions}>
              Reset Options
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
