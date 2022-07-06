import Tokenizr, { Token } from "tokenizr";

//Class for implementation of stack
class Stack {
    constructor() {
        this.item = []
    }

    push = (element) => {
        this.item.push(element)
    }

    pop = () => {
        if (this.item.length === 0)
            return -1
        return this.item.pop()
    }

    isEmpty = () => {
        if (this.item.length === 0)
            return true
        else return false
    }

    peek = () => {
        if (!this.isEmpty()) {
            return this.item.peek()
        }
    }
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
    // lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
    //   ctx.ignore();
    // });
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
    })


    // lexer.rule(/[a-zA-Z][a-zA-Z0-9_]*/, (ctx, match) => {
    //   ctx.accept("id");
    // });

    /*lexer.rule(/(\+)|(-)|(\*)|(\/)|(\.)|(,)|(\^)|(\?)|({)|(})/, (ctx, match) => {
        ctx.accept("char");
      });*/

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
    var result = TokensArray[0].text;
    for (var i = 1; i < TokensArray.length; i++) {
        if (TokensArray[i].line === TokensArray[i - 1].line) {
            var space =
                TokensArray[i].column -
                TokensArray[i - 1].column -
                TokensArray[i - 1].text.length;
            result += " ".repeat(space);
        } else {
            result += "\n".repeat(TokensArray[i].line - TokensArray[i - 1].line);
            var space = TokensArray[i].column - 1;
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
            if (TokensArray[i].text[0] === '\'') {
                continue
            }
            else {
                TokensArray[i].text = "'" + TokensArray[i].value + "'"
            }
        }
    }

    return TokensArray
}

let equals = (TokensArray) => {
    for (let i = 0; i < TokensArray.length - 2; i++) {
        if (TokensArray[i].type === "char") {
            if (TokensArray[i].text === "=" && TokensArray[i + 1].text === "=" && TokensArray[i + 2].text !== "=") {
                TokensArray[i + 1].text = "=="
                var j = i + 2
                var currline = TokensArray[i].line
                while (TokensArray[j].line === currline) {
                    TokensArray[j].column++
                    j++
                }
            }
            else if (TokensArray[i].text === "!" && TokensArray[i + 1].text === "=" && TokensArray[i + 2].text !== "=") {
                TokensArray[i + 1].text = "=="
                var j = i + 2
                var currline = TokensArray[i].line
                while (TokensArray[j].line === currline) {
                    TokensArray[j].column++
                    j++
                }
            }
        }
    }

    return TokensArray
}

let indentation = (TokensArray) => {

    let BraceStack = new Stack();

    for (let i = 0; i < TokensArray.length - 1; i++) {

        if (TokensArray[i].type === "string") {
            if (TokensArray[i + 1].type === "id") {
                TokensArray[i + 1].line = TokensArray[i].line + 1
                if (BraceStack.isEmpty() === false) {
                    TokensArray[i + 1].column = BraceStack.peek() + 2

                }
            }

            else {
                TokensArray[i + 1].line = TokensArray[i].line
                TokensArray[i + 1].column = TokensArray[i].column + TokensArray[i].length + 1
            }
        }

        //When characters are encountered
        else if (TokensArray[i].type === "char") {
            //Open Braces are mention due to their importance in innedations
            if (TokensArray[i].text === '{') {
                let j = i - 1
                //Iterates backwards to find the closes id
                while (j > 0) {
                    if (TokensArray[j].type === "id") {
                        BraceStack.push(TokensArray[j].column)
                        TokensArray[i + 1].column = TokensArray[j].column + 2
                        TokensArray[i + 1].line = TokensArray[j].line + 1
                        break
                    }
                    j = j - 1
                }


            }

            //Closing braces innedations
            else if (TokensArray[i].text === '}' && i > 0) {
                TokensArray[i].line = TokensArray[i - 1].line + 1
                TokensArray[i].column = BraceStack.pop();
                TokensArray[i + 1].line = TokensArray[i].line + 1
            }

            //Remaining characters
            else {
                TokensArray[i].line = TokensArray[i - 1].line
                TokensArray[i].column = TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1
            }
        }

        //When we encounter a number 
        else if (TokensArray[i].type === "number") {
            TokensArray[i + 1].column = TokensArray[i].column + TokensArray[i].text.length + 1;
            TokensArray[i + 1].line = TokensArray[i].line
        }

        //Arrow symbol spacing
        else if (TokensArray[i].type === "arrow") {
            TokensArray[i + 1].column = TokensArray[i].column + TokensArray[i].text + 1
        }

    }

    return TokensArray

}




let spaceKeywords = (TokensArray) => {
    for (let i = 0; i < TokensArray.length - 1; i++) {
        if (TokensArray[i + 1].type === "char" && TokensArray[i + 1].line === TokensArray[i].line) {
                switch (TokensArray[i + 1].text) {
                    case '(':
                    case '{':
                        if (TokensArray[i + 1].column !== TokensArray[i].column + TokensArray[i].text.length + 1) {
                            var j = i + 1
                            var currline = TokensArray[i].line
                            while (TokensArray[j].line === currline) {
                                TokensArray[j].column++
                                j++
                            }
                        }
                        break
                    default: break
                }
        }
    }
    return TokensArray
}


let paddingOperators = (TokensArray) => {
    for (let i = 1; i < TokensArray.length - 1; i++) {
        if (TokensArray[i].text === '+' || TokensArray[i].text === '-' || TokensArray[i].text === '*' || TokensArray[i].text === '/' || TokensArray[i].text === '?' || TokensArray[i].text === ':') {
            //don't do anything if padding already there before operator:
            if (TokensArray[i].column === TokensArray[i - 1].column + TokensArray[i - 1].text.length) {
                var j = i
                var currline = TokensArray[i].line
                while (TokensArray[j].line === currline) {
                    TokensArray[j].column++
                    j++
                }
            }
            //don't do anything if padding is already there after operator
            if (TokensArray[i+1].column === TokensArray[i].column + 1) {
                var j = i+1
                var currline = TokensArray[i].line
                while (TokensArray[j].line === currline) {
                    TokensArray[j].column++
                    j++
                }
            }
        }

        return TokensArray
    }
}
//this function will remove parentheses and make if statement single line if it only contains one line inside it
let multilineIf = (TokensArray) => {
    for (var i = 0; i < TokensArray.length - 1; i++) {
        if (TokensArray[i].text === "if") {
            while (TokensArray[i].text !== "{")
                i = i + 1
            let j = i
            while (TokensArray[j].text !== "}")
                j = j + 1;
            if (TokensArray[i + 1].line === TokensArray[j - 1].line) {
                for (var k = i + 1; k < j; k++) {
                    TokensArray[k].line = TokensArray[i - 1].line
                    if (k === i + 1) TokensArray[k].column = (TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1)
                    else TokensArray[k].column = (TokensArray[k - 1].column + TokensArray[k - 1].text.length + 1)
                }
                TokensArray.splice(i, 1)
                TokensArray.splice(j - 1, 1)
                i = j -2
            }
        }
    }
    return TokensArray;
}
//this function will shift commas (if they are the first character of a new line) to be the last character of previous line
let spacingforSingleLineBrackets = (TokensArray) => {
    for (var i = 1; i < TokensArray.length - 1; i++) {
        if (TokensArray[i].text === '{' && TokensArray[i].line === TokensArray[i + 1].line && (TokensArray[i + 1].column < TokensArray[i].column + 2)) {
            var j = i + 1
            while (TokensArray[j].line === TokensArray[i].line) {
                TokensArray[j].column = TokensArray[j].column + 1
                j = j + 1
            }
        }
        if (TokensArray[i].text === '}' && TokensArray[i].line === TokensArray[i - 1].line && (TokensArray[i].column < TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1)) {
            var j = i
            while (TokensArray[j].line === TokensArray[i-1].line) {
                TokensArray[j].column = TokensArray[j].column + 1
                j = j + 1
            }
        }
    }
    return TokensArray;
}
//this function shifts a dot (property accessor) from last token of previous line to first token of next line
let dotLocation = (TokensArray) => {
    for (var i = 1; i < TokensArray.length - 1; i++) {
        if (TokensArray[i].text === "." && (TokensArray[i].line < TokensArray[i + 1].line)) {
            TokensArray[i].line = TokensArray[i].line + 1
            TokensArray[i].column = 1
            var j = i + 1
            while (TokensArray[j].line === TokensArray[i].line) {
                TokensArray[j].column = TokensArray[j].column + 2
                j = j + 1
            }
        }
    }
    return TokensArray;
}
//this function will remove extra spaces from a line if they occur after the first token, i.e. are not part of indentation
let removeUnnecessarySpaces = (TokensArray) => {
    for (var i = 1; i < TokensArray.length - 1; i++) {
        if (TokensArray[i].line === TokensArray[i - 1].line && TokensArray[i].column > (TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1))
            TokensArray[i].column = TokensArray[i - 1].column + TokensArray[i - 1].text.length + 1
    }
    return TokensArray;
}

const Beautifier = (input, options) => {
    var TokensArray = [];
    var res = "";
    TokensArray = Tokenize(input);

    //if (options.equals) {
    //    console.log(options.equals);
    //    TokensArray = extraEquals(TokensArray);
    //}

    if (options.quotes) {
        TokensArray = quotes(TokensArray)
    }

    if (options.equals) {
        TokensArray = equals(TokensArray)
    }

    if (options.spaceKeywords) {
        TokensArray = spaceKeywords(TokensArray)
    }

    if (options.paddingOperators) {
        TokensArray = paddingOperators(TokensArray)
    }

    //if (options.indentation) {
    //    TokensArray = indentation(TokensArray)
    //}

    if (options.multiIf) {
        TokensArray = multilineIf(TokensArray)
    }

    if (options.dot) {
        TokensArray = dotLocation(TokensArray)
    }

    if (options.comma) {
        TokensArray = spacingforSingleLineBrackets(TokensArray)
    }

    if (options.blankLine) {
        TokensArray = removeAdditionalBlankLines(TokensArray);
    }

    if (options.spaces) {
        TokensArray = removeUnnecessarySpaces(TokensArray);
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
