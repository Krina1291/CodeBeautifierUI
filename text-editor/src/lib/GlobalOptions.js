import JavaScriptOptions from "./javascript/Options";

const GlobalOptions = (lang) => {
  if (lang === "javascript") {
    return JavaScriptOptions;
  }

  return [{}];
};

export default GlobalOptions;
