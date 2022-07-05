import Tokenizr from "tokenizr";

const Tokenize = (InputString) => {
  let lexer = new Tokenizr();

  lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
    ctx.accept("id");
  });
  lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
    ctx.accept("number", parseInt(match[0]));
  });
  lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
    ctx.accept("string", match[1].replace(/\\"/g, '"'));
  });
  lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
    ctx.ignore();
  });
  lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
    ctx.ignore();
  });
  // lexer.rule(/./, (ctx, match) => {
  //   ctx.accept("char");
  // });

  // lexer.rule(/[a-zA-Z][a-zA-Z0-9_]*/, (ctx, match) => {
  //   ctx.accept("id");
  // });

  lexer.rule(/(\+)|(-)|(\*)|(\/)|(\.)|(,)|(\^)|(\?)|({)|(})/, (ctx, match) => {
    ctx.accept("char");
  });

  // lexer.rule(/\/\.*[\n]*\*\//, (ctx, match) => {
  //   ctx.accept("comment");
  // });

  // lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
  //   ctx.accept("comment");
  // });

  // lexer.rule(/"==="|"=="|"!=="|">="|"<="|"!="|"<"|">"/, (ctx, match) => {
  //   ctx.accept("comparators");
  // });

  // lexer.rule(/"&&"|"\|\|"/, (ctx, match) => {
  //   ctx.accept("Joiners");
  // });

  // lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
  //   ctx.accept("number", parseInt(match[0]));
  // });

  // lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
  //   ctx.accept("string", match[1].replace(/\\"/g, '"'));
  // });

  // lexer.rule(/'((?:\\"|[^\r\n])*)'/, (ctx, match) => {
  //   ctx.accept("string", match[1].replace(/\\"/g, '"'));
  // });

  // lexer.rule(/=>/, (ctx, match) => {
  //   ctx.accept("arrow");
  // });

  lexer.input(InputString);
  lexer.debug(true);
  let TokensArray = lexer.tokens();
  console.log(TokensArray);
  return TokensArray;
};

//this function will be used at the very end after all conventions have been applied to our tokens list
let stringBulider = (TokensArray) => {
  var result = "";
  for (var i = 0; i < TokensArray.length - 1; i++) {
    result += TokensArray[i].text;
    if (TokensArray[i].line === TokensArray[i + 1].line) {
      var space =
        TokensArray[i + 1].column -
        TokensArray[i].column -
        TokensArray[i].text.length;
      result += " ".repeat(space);
    } else {
      result += "\n".repeat(TokensArray[i + 1].line - TokensArray[i].line);
    }
  }
  return result;
};

//this function will change == to === and != to !==
let extraEquals = (TokensArray) => {
  for (var i = 0; i < TokensArray.length - 1; i++) {
    if (TokensArray[i].text === "!=" || TokensArray[i].text === "==")
      TokensArray[i].text += "=";
  }
  return TokensArray;
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

const Beautifier = (input, options) => {
  var TokensArray = [];
  var res = "";
  TokensArray = Tokenize(input);

  if (options.equals) {
    console.log(options.equals);
    TokensArray = extraEquals(TokensArray);
  }

  if (options.blankLine) {
    TokensArray = removeAdditionalBlankLines(TokensArray);
  }

  res = stringBulider(TokensArray);

  // try {
  //   TokensArray = Tokenize(input);
  //   res = stringBulider(TokensArray);
  // } catch (error) {
  //   console.log(console.log(error));
  //   res = input;
  // }

  return res;
};

export default Beautifier;
