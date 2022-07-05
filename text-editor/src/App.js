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
              <h4>Javascipt Code</h4>
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
                <h2> Javascipt Code Formatter</h2>

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

              <Grid item xs={5} marginTop="20px" marginLeft={5}>
                <h2> Conventions Used:</h2>
                <List align="justify">
                  <br></br>
                  <ul>Label 1:</ul>
                  <ul>Label 2:</ul>
                  <ul>Label 3:</ul>
                  <ul>Label 4:</ul>
                  <ul>Label 5:</ul>
                  <ul>Label 6:</ul>
                  <ul>Label 7:</ul>
                  <ul>Label 8:</ul>
                  <ul>Label 9:</ul>
                  <ul>Label 0:</ul>
                  <br></br>
                </List>
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
            <button type="button" class="Reset" onClick={resetOptions}>
              Reset Options
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
