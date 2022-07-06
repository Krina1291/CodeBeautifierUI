import Tokenizr from "tokenizr";

//Class for implementation of stack
class Stack {
  constructor() {
    this.item = [];
  }

  push = (element) => {
    this.item.push(element);
  };

  pop = () => {
    if (this.item.length === 0) return -1;
    return this.item.pop();
  };

  isEmpty = () => {
    if (this.item.length === 0) return true;
    else return false;
  };
  peek = () => {
    if (!this.isEmpty()) {
      let n = this.item.length;
      return this.item[n - 1];
    }
  };
}

const Tokenize = (InputString) => {
  let lexer = new Tokenizr();

  lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
    ctx.accept("id");
  });
  lexer.rule(/[-]?[0-9]+/, (ctx, match) => {
    ctx.accept("number", parseInt(match[0]));
  });
  lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
    ctx.accept("string", match[1].replace(/\\"/g, '"'));
  });
  lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
    ctx.ignore();
  });
  lexer.rule(/./, (ctx, match) => {
    ctx.accept("char");
  });

  lexer.rule(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/, (ctx, match) => {
    ctx.accept("comments", match[1].replace(/\\"/g, '"'));
  });

  lexer.rule(/(\/\/.*)/, (ctx, match) => {
    ctx.accept("comment");
  });

  lexer.input(InputString);
  lexer.debug(true);
  let TokensArray = lexer.tokens();
  console.log(TokensArray);
  return TokensArray;
};

//this function will be used at the very end after all conventions have been applied to our tokens list
let stringBulider = (TokensArray) => {
  var result = TokensArray[0].text;
  for (var i = 1; i < TokensArray.length; i++) {
    if (TokensArray[i].line === TokensArray[i - 1].line) {
      let space =
        TokensArray[i].column -
        TokensArray[i - 1].column -
        TokensArray[i - 1].text.length;
      result += " ".repeat(space);
    } else {
      result += "\n".repeat(TokensArray[i].line - TokensArray[i - 1].line);
      let space = TokensArray[i].column - 1;
      result += " ".repeat(space);
    }
    result += TokensArray[i].text;
  }
  return result;
};

let removeAdditionalBlankLines = (TokensArray) => {
  for (var i = 1; i < TokensArray.length - 1; i++) {
    if (TokensArray[i].line - TokensArray[i - 1].line > 1) {
      var j = i;
      var currline = TokensArray[i].line;
      while (TokensArray[j].line === currline && j < TokensArray.length - 1) {
        TokensArray[j].line = TokensArray[i - 1].line + 1;
        j = j + 1;
      }
    }
  }

  return TokensArray;
};

let quotes = (TokensArray) => {
  for (let i = 0; i < TokensArray.length - 1; i++) {
    if (TokensArray[i].type === "string") {
      if (TokensArray[i].text[0] === "'") {
        continue;
      } else {
        TokensArray[i].text = "'" + TokensArray[i].value + "'";
      }
    }
  }

  return TokensArray;
};

let equals = (TokensArray) => {
  for (let i = 0; i < TokensArray.length - 2; i++) {
    if (TokensArray[i].type === "char") {
      if (
        TokensArray[i].text === "=" &&
        TokensArray[i + 1].text === "=" &&
        TokensArray[i + 2].text !== "="
      ) {
        TokensArray[i + 1].text = "==";
        var j = i + 2;
        var currline = TokensArray[i].line;
        while (TokensArray[j].line === currline) {
          TokensArray[j].column++;
          j++;
        }
      } else if (
        TokensArray[i].text === "!" &&
        TokensArray[i + 1].text === "=" &&
        TokensArray[i + 2].text !== "="
      ) {
        TokensArray[i + 1].text = "==";
        let j = i + 2;
        let currline = TokensArray[i].line;
        while (TokensArray[j].line === currline) {
          TokensArray[j].column++;
          j++;
        }
      }
    }
  }

  return TokensArray;
};

let indentation = (TokensArray) => {
  let BraceStack = new Stack();
  BraceStack.push(0);
  for (let i = 0; i < TokensArray.length - 1; i++) {
    TokensArray[i].column += BraceStack.peek() + 2;
    if (TokensArray[i].text === "{") {
      BraceStack.push(TokensArray[i].column);
    }
    if (TokensArray[i].text === "}") {
      BraceStack.pop();
    }
  }
  return TokensArray;
};

let spaceKeywords = (TokensArray) => {
  for (let i = 0; i < TokensArray.length - 1; i++) {
    if (
      TokensArray[i + 1].type === "char" &&
      TokensArray[i + 1].line === TokensArray[i].line
    ) {
      switch (TokensArray[i + 1].text) {
        case "(":
        case "{":
          if (
            TokensArray[i + 1].column !==
            TokensArray[i].column + TokensArray[i].text.length + 1
          ) {
            var j = i + 1;
            var currline = TokensArray[i].line;
            while (TokensArray[j].line === currline) {
              TokensArray[j].column++;
              j++;
            }
          }
          break;
        default:
          break;
      }
    }
  }
  return TokensArray;
};

let paddingOperators = (TokensArray) => {
  for (let i = 1; i < TokensArray.length - 1; i++) {
    if (
      TokensArray[i].text === "+" ||
      TokensArray[i].text === "-" ||
      TokensArray[i].text === "*" ||
      TokensArray[i].text === "/" ||
      TokensArray[i].text === "?" ||
      TokensArray[i].text === "^" ||
      TokensArray[i].text === ":"
    ) {
      //don't do anything if padding already there before operator:
      if (
        TokensArray[i].column ===
        TokensArray[i - 1].column + TokensArray[i - 1].text.length
      ) {
        var j = i;
        var currline = TokensArray[i].line;
        while (TokensArray[j].line === currline) {
          TokensArray[j].column = TokensArray[j].column + 1;
          j = j + 1;
        }
      }
      //don't do anything if padding is already there after operator
      if (TokensArray[i + 1].column === TokensArray[i].column + 1) {
        let j = i + 1;
        let currline = TokensArray[i].line;
        while (TokensArray[j].line === currline) {
          TokensArray[j].column++;
          j++;
        }
      }
    }
  }
  return TokensArray;
};
//this function will remove parentheses and make if statement single line if it only contains one line inside it
let multilineIf = (TokensArray) => {
  for (var i = 0; i < TokensArray.length - 1; i++) {
    if (TokensArray[i].text === "if") {
      while (TokensArray[i].text !== "{") i = i + 1;
      let j = i;
      while (TokensArray[j].text !== "}") j = j + 1;
      if (TokensArray[i + 1].line === TokensArray[j - 1].line) {
        for (var k = i + 1; k < j; k++) {
          TokensArray[k].line = TokensArray[i - 1].line;
          if (k === i + 1)
            TokensArray[k].column =
              TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1;
          else
            TokensArray[k].column =
              TokensArray[k - 1].column + TokensArray[k - 1].text.length + 1;
        }
        TokensArray.splice(i, 1);
        TokensArray.splice(j - 1, 1);
        i = j - 2;
      }
    }
  }
  return TokensArray;
};
//this function will shift commas (if they are the first character of a new line) to be the last character of previous line
let spacingforSingleLineBrackets = (TokensArray) => {
  for (var i = 1; i < TokensArray.length - 1; i++) {
    if (
      TokensArray[i].text === "{" &&
      TokensArray[i].line === TokensArray[i + 1].line &&
      TokensArray[i + 1].column < TokensArray[i].column + 2
    ) {
      var j = i + 1;
      while (TokensArray[j].line === TokensArray[i].line) {
        TokensArray[j].column = TokensArray[j].column + 1;
        j = j + 1;
      }
    }
    if (
      TokensArray[i].text === "}" &&
      TokensArray[i].line === TokensArray[i - 1].line &&
      TokensArray[i].column <
        TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1
    ) {
      let j = i;
      while (TokensArray[j].line === TokensArray[i - 1].line) {
        TokensArray[j].column = TokensArray[j].column + 1;
        j = j + 1;
      }
    }
  }
  return TokensArray;
};
//this function shifts a dot (property accessor) from last token of previous line to first token of next line
let dotLocation = (TokensArray) => {
  for (var i = 1; i < TokensArray.length - 1; i++) {
    if (
      TokensArray[i].text === "." &&
      TokensArray[i].line < TokensArray[i + 1].line
    ) {
      TokensArray[i].line = TokensArray[i + 1].line;
      TokensArray[i].column = 1;
      var j = i + 1;
      while (TokensArray[j].line === TokensArray[i].line) {
        TokensArray[j].column = TokensArray[j].column + 1;
        j = j + 1;
      }
    }
  }
  return TokensArray;
};
//this function will remove extra spaces from a line if they occur after the first token, i.e. are not part of indentation
let removeUnnecessarySpaces = (TokensArray) => {
  for (var i = 1; i < TokensArray.length - 1; i++) {
    if (
      TokensArray[i].line === TokensArray[i - 1].line &&
      TokensArray[i].column >
        TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1
    )
      TokensArray[i].column =
        TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1;
  }
  return TokensArray;
};

const Beautifier = (input, options) => {
  var TokensArray = [];
  var res = "";
  TokensArray = Tokenize(input);

  try {
    if (options.quotes) {
      TokensArray = quotes(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (options.equals) {
      TokensArray = equals(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (options.spaceKeywords) {
      TokensArray = spaceKeywords(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (options.paddingOperators) {
      TokensArray = paddingOperators(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    if (options.indentation) {
      TokensArray = indentation(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    if (options.multiIf) {
      TokensArray = multilineIf(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (options.sinleLineBraces) {
      TokensArray = spacingforSingleLineBrackets(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (options.blankLine) {
      TokensArray = removeAdditionalBlankLines(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    if (options.dot) {
      TokensArray = dotLocation(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    if (options.spaces) {
      TokensArray = removeUnnecessarySpaces(TokensArray);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    res = stringBulider(TokensArray);
  } catch (error) {
    console.log(error);
    res = input;
  }

  return res;
};

export default Beautifier;
