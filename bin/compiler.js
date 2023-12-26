"use strict";
const jsoncode = {
    "name": "BreezeScript",
    "assignmentOperators": [
        "+=",
        "-=",
        "/=",
        "*=",
        "="
    ],
    "operators": [
        "(",
        ")",
        "+",
        "-",
        "/",
        "*"
    ],
    "delimiters": [
        "(",
        ")",
        " ",
        "[",
        "]",
        ","
    ],
    "keywords": [
        {
            "string": "function",
            "js": "function ${line[1]} ${line.slice(2).join(' ')} {"
        },
        {
            "string": "end",
            "js": "}"
        },
        {
            "string": "let",
            "js": "let ${line[1]} = ${line.slice(3).join(' ')};"
        },
        {
            "string": "if",
            "js": "if (${line.slice(1).join(' ')}) {"
        },
        {
            "string": "else",
            "js": "} else {"
        },
        {
            "string": "for",
            "js": "for (let ${line[2]} of ${line[4]}) {",
            "strict": [
                "for",
                "each",
                "",
                "in",
                ""
            ]
        },
        {
            "string": "repeat",
            "js": "for (let ${line[3]} = 0; ${line[3]} < ${line[2]}; ${line[3]}++) {",
            "strict": [
                "repeat",
                "for",
                "",
                ""
            ]
        },
        {
            "string": "while",
            "js": "while (${line.slice(1).join(' ')}) {"
        },
        {
            "string": "return",
            "js": "return ${line.slice(1).join(' ')}"
        },
        {
            "string": "log",
            "js": "console.log${line.slice(1).join(' ')}"
        }
    ],
    "expressionOpen": "(",
    "expressionClose": ")",
    "commentLine": "//",
    "expressionKeywords": [
        {
            "string": "length of ",
            "js": "${term[2]}.length"
        },
        {
            "string": "as ",
            "js": "${term[0]}"
        }
    ]
};
// ... (rest of your code)
async function fetchBreezeScriptCode(src) {
    try {
        const response = await fetch(src);
        const code = await response.text();
        // Handle the loaded BreezeScript code here
        // You can perform additional tasks based on the loaded code
        return code;
    }
    catch (error) {
        console.error("Error fetching brze:", error);
        return '';
    }
}
// ... (rest of your code)
function findObjectByKey(array, key, value) {
    return array.find(item => item[key] === value);
}
function tokenize(code, delimiter) {
    let codeArray = code.split('\n');
    let outputArray = [];
    let delimiters = delimiter;
    codeArray.forEach((line) => {
        let temp = '';
        let lineOutput = [];
        for (let char of line) {
            if (delimiters.includes(char)) {
                if (temp.trim() !== '') {
                    lineOutput.push(temp.trim());
                    temp = '';
                }
                if (char.trim() !== '') {
                    lineOutput.push(char.trim());
                }
            }
            else if (char.trim() !== '') {
                temp += char;
            }
        }
        if (temp.trim() !== '') {
            lineOutput.push(temp.trim());
        }
        outputArray.push(lineOutput);
    });
    return outputArray;
}
function tokenizeExpression(expression, delimiters) {
    let output = [];
    let temp = '';
    for (const token of expression) {
        for (const char of (token + ' ').split('')) {
            if (delimiters.includes(char)) {
                if (temp != '') {
                    output.push(temp.split(' '));
                }
                temp = '';
                output.push([char]);
            }
            else {
                temp += char;
            }
        }
    }
    return output;
}
function compileExpression(expression, srcLang) {
    const delimiters = srcLang.operators;
    const terms = tokenizeExpression(expression, delimiters);
    // Iterate through terms and handle expression-specific keywords
    const compiledTerms = terms.map((term) => {
        const expressionKeyObj = findObjectByKey(srcLang.expressionKeywords, "string", term[0]);
        if (expressionKeyObj) {
            // Handle expression-specific keyword logic here
            // You might need to recursively call compileExpression for nested expressions
            // ...
            // Return the compiled term
            return eval('`' + expressionKeyObj.js + '`');
        }
        // If not an expression-specific keyword, return the original term
        return term.join('');
    });
    const output = compiledTerms.flat().join('');
    return '(' + output + ')';
}
function compileLine(line, srcLang) {
    if (!line || line.length === 0) {
        // Handle the case where 'line' is undefined or empty
        console.warn("Empty line or line is undefined. Skipping compilation.");
        return '';
    }
    const keyword = line[0]?.trim(); // Use optional chaining to avoid errors if line[0] is undefined
    const keywordObject = findObjectByKey(srcLang.keywords, "string", keyword);
    let js = '';
    if (keywordObject) {
        if (keywordObject.strict) {
            for (let i = 0; i < keywordObject.strict.length; i++) {
                const strictToken = keywordObject.strict[i];
                if (strictToken !== '' && line[i] !== strictToken) {
                    throw new Error(`${srcLang.name.toUpperCase()}_COMPILER: Unexpected token at: "${line.join(' ')}"`);
                }
            }
        }
        // Compile the keyword and its arguments
        js = eval('`' + keywordObject.js + '`');
    }
    else {
        if (!(keyword?.startsWith(srcLang.commentLine))) {
            console.warn("Unknown token: ", keyword, " The compiler will not compile this line.");
        }
        js = line.join(' ');
    }
    return js;
}
function compile(src) {
    let srcLang = jsoncode;
    const srcCode = src;
    let output = [];
    let tokenArray = tokenize(srcCode, srcLang.delimiters);
    tokenArray.forEach((line) => {
        let compiled = compileLine(line, srcLang);
        output.push(compiled + '\n');
    });
    let out = output;
    return out;
}
