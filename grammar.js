// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const { lexer } = require("./dist/lexer")


/*const flat = (x) =>{
    if(Array.isArray(x) && x.length === 1 && Array.isArray(x[0])){
        return x[0]
    }else{
        return x
    }
}*/
function convertTokenId(data) {
    return convertToken(data[0]);
}
const first = (d)=> Array.isArray(d) && d.length > 0 ? first(d[0]) : d
/* 
primary  (%binary4   operator4):*
[
    tree, [
        [op1, tree],
        [op2, tree],
        [op3, tree],
        [op4, tree],
        [op5, tree],
    ]
]
    */
const binaryFunc = (d)=>{
    console.log("d", JSON.stringify(d, null, 2))
    const left = d[0]
    const right =  d[1]
    console.log("d[0]", d[0], `d[0] === null`,  d[0] === null)
    if(left === null || left === undefined){
        return right
    }
    if(right === undefined || right === null){
        return left
    }
    if(right.length === 0) return left
    const op = right[0][0]
    return {
            type:"functor",
            value:{
                type:"symbol",
                value: op
            },
        args: [left, binaryFunc([right[0][1], ...right.slice(1)])]
    }
    /*console.log("d", d)
    if(d[1] && d[1].length === 0) return d[0]
    const op = first(d[1])
    if(d[1] && d[1].first){
        return {
            head:op.toString(),
            nodes:[d[0], ...d[1].flat(1)]
        }
    }
    if(d[1] && d[1].length === 2){
        return {
            head:op.toString(),
            nodes:[d[0],...d[1][1].flat(1)]
        }
    }
    return {
        head:op.toString(),
        nodes:[d[0], ...binaryFunc([d[1][1], ...d[1].slice(1).flat(1)])]
    }*/
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "tree", "symbols": ["operator1"], "postprocess": id},
    {"name": "operator1$ebnf$1", "symbols": []},
    {"name": "operator1$ebnf$1$subexpression$1", "symbols": [(lexer.has("binary1") ? {type: "binary1"} : binary1), "operator1"]},
    {"name": "operator1$ebnf$1", "symbols": ["operator1$ebnf$1", "operator1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator1", "symbols": ["operator2", "operator1$ebnf$1"], "postprocess": binaryFunc},
    {"name": "operator2$ebnf$1", "symbols": []},
    {"name": "operator2$ebnf$1$subexpression$1", "symbols": [(lexer.has("binary2") ? {type: "binary2"} : binary2), "operator2"]},
    {"name": "operator2$ebnf$1", "symbols": ["operator2$ebnf$1", "operator2$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator2", "symbols": ["operator3", "operator2$ebnf$1"], "postprocess": binaryFunc},
    {"name": "operator3$ebnf$1", "symbols": []},
    {"name": "operator3$ebnf$1$subexpression$1", "symbols": [(lexer.has("binary3") ? {type: "binary3"} : binary3), "operator3"]},
    {"name": "operator3$ebnf$1", "symbols": ["operator3$ebnf$1", "operator3$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator3", "symbols": ["operator4", "operator3$ebnf$1"], "postprocess": binaryFunc},
    {"name": "operator4$ebnf$1", "symbols": []},
    {"name": "operator4$ebnf$1$subexpression$1", "symbols": [(lexer.has("binary4") ? {type: "binary4"} : binary4), "operator4"]},
    {"name": "operator4$ebnf$1", "symbols": ["operator4$ebnf$1", "operator4$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator4", "symbols": ["primary", "operator4$ebnf$1"], "postprocess": binaryFunc},
    {"name": "primary$subexpression$1", "symbols": [(lexer.has("lParen") ? {type: "lParen"} : lParen), "tree", (lexer.has("rParen") ? {type: "rParen"} : rParen)]},
    {"name": "primary", "symbols": ["primary$subexpression$1"], "postprocess": (d) => d[1]},
    {"name": "primary", "symbols": ["applicationChain"], "postprocess": id},
    {"name": "primary", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": d=>({
                type:"symbol",
                value: d[0]
        })},
    {"name": "primary", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d=>({
                type:"variable",
                value: d[0]
        })},
    {"name": "applicationChain$subexpression$1", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)]},
    {"name": "applicationChain$subexpression$1", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)]},
    {"name": "applicationChain$ebnf$1$subexpression$1", "symbols": ["funArgs"]},
    {"name": "applicationChain$ebnf$1", "symbols": ["applicationChain$ebnf$1$subexpression$1"]},
    {"name": "applicationChain$ebnf$1$subexpression$2", "symbols": ["funArgs"]},
    {"name": "applicationChain$ebnf$1", "symbols": ["applicationChain$ebnf$1", "applicationChain$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "applicationChain", "symbols": ["applicationChain$subexpression$1", "applicationChain$ebnf$1"], "postprocess": d=>({
            type:"functor",
            value:{
                type:d[0][0].type,
                value: d[0][0]
        },
            args:d[1][0]
        })},
    {"name": "funArgs", "symbols": [(lexer.has("lParen") ? {type: "lParen"} : lParen), "ArgsList", (lexer.has("rParen") ? {type: "rParen"} : rParen)], "postprocess": d=>d[1]},
    {"name": "ArgsList", "symbols": ["tree"], "postprocess": d => d},
    {"name": "ArgsList", "symbols": ["tree", (lexer.has("comma") ? {type: "comma"} : comma), "ArgsList"], "postprocess": d=>[d[0], ...d[2]]},
    {"name": "__ml$ebnf$1", "symbols": []},
    {"name": "__ml$ebnf$1", "symbols": ["__ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__ml", "symbols": ["__ml$ebnf$1"]},
    {"name": "_ml$ebnf$1", "symbols": ["multi_line_ws_char"]},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "tree"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
