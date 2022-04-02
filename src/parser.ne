@{%
    const { lexer } = require("./dist/lexer")

function tokenStart(token) {
    return {
        line: token.line,
        col: token.col - 1
    };
}

function tokenEnd(token) {
    const lastNewLine = token.text.lastIndexOf("\n");
    if (lastNewLine !== -1) {
        throw new Error("Unsupported case: token with line breaks");
    }
    return {
        line: token.line,
        col: token.col + token.text.length - 1
    };
}

function convertToken(token) {
    return token.toString();
    return {
        type: token.type,
        value: token.value,
        start: tokenStart(token),
        end: tokenEnd(token)
    };
}
const flat = (x) =>{
    if(Array.isArray(x) && x.length === 1 && Array.isArray(x[0])){
        return x[0]
    }else{
        return x
    }
}
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
    console.log("d", d)
    const left = d[0]
    const right =  d[1]
    if(right === undefined){
        return d[0]
    }
    if(right.length === 0) return d[0]
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
%}

@lexer lexer

# program -> __ml statements __ml {% d=>d[1] %}
# statements -> statement _ml statements {%(d)=>[d[0], ...d[2]]%}
#     | statement {%(d)=>d%}
# statement ->  tree  {%id%}
tree -> operator1 {%id%}
operator1  -> operator2  (%binary1    operator1):* {%binaryFunc%}
operator2  -> operator3  (%binary2    operator2):* {%binaryFunc%}
operator3  -> operator4  (%binary3   operator3):* {%binaryFunc%}
operator4  -> primary  (%binary4   operator4):* {%binaryFunc%}


primary  -> 
    (%lParen  tree  %rParen) {%(d) => d[1]%}
    | applicationChain {%id%}
    | %symbol {%d=>({
            type:"symbol",
            value: d[0]
    })%}
    | %variable {%d=>({
            type:"variable",
            value: d[0]
    })%}
applicationChain -> 
    (%symbol | %variable)  (funArgs):+ {%d=>({
        type:"functor",
        value:{
            type:d[0][0].type,
            value: d[0][0]
    },
        args:d[1][0]
    })%}
funArgs -> %lParen ArgsList %rParen  {%d=>d[1]%}
ArgsList -> 
    tree {%d => d%} 
    | tree  %comma  ArgsList {%d=>[d[0], ...d[2]]%}
__ml -> multi_line_ws_char:*
_ml -> multi_line_ws_char:+

multi_line_ws_char
    -> %ws
    | %nl

__ -> %ws:+

_ -> %ws:*