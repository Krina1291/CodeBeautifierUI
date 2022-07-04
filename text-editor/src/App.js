import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./App.css";
import { green } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import GlobalOptions from "./lib/GlobalOptions";
import Beautifier from "./lib";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { View, Text } from "react-native";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Dropdown } from "./components/Dropdown";
import { Editor } from "./components/Editor";
import { Highlighter } from "./components/Highlighter";

import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as languages from "react-syntax-highlighter/dist/esm/languages/hljs";

import "./App.css";
import { List } from "@mui/material";

const exampleInput =
  'using System;namespace HelloWorld{class Program{static void Main(string[] args){Console.WriteLine("Hello World!");}}}';
const exampleOutput =
  "var start = DateTime.Now; \n var end = start.AddYears(30); \n cronDescriptorDto = new() \n { \n     Occurrences = crontabSchedule.GetNextOccurrences(start, end).Take(100), \n     Description = CronExpressionDescriptor.ExpressionDescriptor.GetDescription(cronExpression) \n }; \n return cronDescriptorDto;";

const defaultLanguage = (
  <code>${"javascript" || Object.keys(languages).sort()[0]}</code>
);
const defaultTheme = (
  <code>${"atomOneDark" || Object.keys(themes).sort()[0]}</code>
);

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(defaultLanguage);
  const [theme, setTheme] = useState(defaultTheme);
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
    <div className="App">
      <nav class="navbar navbar-expand-lg bg-dark">
        <div class="container">
          <a class="navbar-brand" href="#">
            <h3> Code Beautifier</h3>
          </a>
          <a class="navbar-brand" href="#">
            <h3>THAKUR</h3>
          </a>
        </div>
      </nav>

      <Stack spacing={2} direction="row">
        <Button color="success" class="Box1">
          {" "}
          C# code{" "}
        </Button>
        <Button variant="contained" class="Box2">
          Beautified C#
        </Button>
      </Stack>

      <div className="ControlsBox">
        <Dropdown
          defaultTheme={defaultLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          data={languages}
        />
        <Dropdown
          defaultTheme={defaultTheme}
          onChange={(e) => setTheme(e.target.value)}
          data={themes}
        />
      </div>

      <div className="PanelsBox">
        <Grid container>
          <Grid item xs={5}>
            <Editor
              placeHolder="Type or Paste your code here..."
              onChange={(e) => setInput(e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <FormGroup>
              {GlobalOptions("javascript").map((option, index) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={options[option.name]}
                      name={option.name}
                      onChange={handleCheckbox}
                    />
                  }
                  label={option.desc}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={5}>
            <Highlighter>{output}</Highlighter>
          </Grid>
        </Grid>
      </div>

      <nav class="navbar navbar-expand-lg bg-dark"></nav>

      <Stack direction="row">
        <button type="button" class="Paste" marginTop="10px">
          Paste
        </button>
        <button
          type="button"
          class="Beautify"
          marginTop="10px"
          onClick={handleSubmit}
        >
          Beautify
        </button>
        <button type="button" class="CopyToClipboard">
          Copy to Clipboard
        </button>
      </Stack>

      <nav class="navbar navbar-expand-lg bg-dark"></nav>

      <div>
        <Grid container spacing={2}>
          <Grid item xs={7.25} marginTop="20px" marginLeft={5}>
            <h2> C# Code Formatter</h2>

            <List align="justify">
              Format your C# code and make it readable. Well-formatted C# code
              reduces development time. It also helps you spot bugs faster.
              <br></br>
              <br></br>
              The C# beautifier will ident your code, will remove empty spaces,
              will move each statement on a new line.
            </List>

            <br></br>
            <h3>Example of how a poor writte code it's is formatted</h3>
            <br></br>

            <List align="justify" color="pink">
              <a class="exampleInput">{exampleInput}</a>

              <h5>
                {" "}
                <br></br> Look at the above code. You can barely understand what
                he's writing.{" "}
              </h5>

              <textarea class="exampleOutput">
                {/* var start = DateTime.Now;
                    var end = start.AddYears(30);
                    cronDescriptorDto = new()
                    {
                        Occurrences = crontabSchedule.GetNextOccurrences(start, end).Take(100),
                        Description = CronExpressionDescriptor.ExpressionDescriptor.GetDescription(cronExpression)
                    };
                    return cronDescriptorDto; */}
              </textarea>
            </List>
          </Grid>

          <Grid item xs={3} marginTop="20px" marginLeft={5}>
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
  );
}
