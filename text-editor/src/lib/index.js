import JsBeautifier from "./javascript/Beautifier";

const Beautify = (input, options, language) => {
  if (language === "javascript") return JsBeautifier(input, options);
};

export default Beautify;
