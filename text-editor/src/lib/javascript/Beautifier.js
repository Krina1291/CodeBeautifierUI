import Tokenizer from "./Tokenizer";
import Indentation from "./rules/Indentation";

const Beautifier = (input, options) => {
  //call Tokenizer
  let res = Tokenizer(input);

  if (options.indentation) {
    //Apply Rule
    res = Indentation(res);
  }

  //construct the string from tokens

  return res;
};

export default Beautifier;
