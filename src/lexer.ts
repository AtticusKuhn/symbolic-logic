import moo from "moo"
export const lexer = moo.compile({
    ws: /[ \t]+/,
    nl: { match: /[\n\s]/, lineBreaks: true },
    lParen: /\(/,
    rParen: /\)/,
    comma: /,/,
    variable: /[A-Z_][A-Za-z]*/,
    binary2: ["+", "-"],///\+|-/,
    binary3: ["*", "/"], // /\*|\//,
    binary4: ["^"], ///\^/,
    binary1: ["="], ///=/,
    symbol: /[a-z0-9][A-Za-z0-9]*/
});

export default lexer