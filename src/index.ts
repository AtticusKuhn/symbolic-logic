import nearley from "nearley";
//@ts-ignore
const grammar = require("../grammar.js")
import fs from "fs"

export function parse(code: string): AST {
    // console.log("parsing", code)
    code = code.replace(/[\s\t ]+?/g, "")
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    const res: AST[] = parser.results
    // console.log("res", res)
    if (res.length > 1) {
        for (let i = 0; i < res.length; i++) {
            console.log("ambiguous parser")
            console.log(`${ASTToString(res[i])}`)
        }
        fs.writeFileSync("./dump.json", JSON.stringify(res, null, 4))
        throw new Error("ambiguous parser")
    }
    if (parser.results.length === 0) {
        console.log(`no parse found for`, code)
        throw new Error(`no parse found for code "${code}"`)
    }
    return parser.results[0]
}
type value = Variable | Symbol
type Variable = {
    type: 'variable',
    value: tokenInfo
}
type tokenInfo = {
    "type": string,
    "value": string,
    "text": string,
    "offset": number,
    "lineBreaks": number,
    "line": number,
    "col": number
}
type Symbol = {
    type: 'symbol',
    value: tokenInfo
}

type Functor = {
    type: "functor",
    value: value,
    args: AST[]
}
type AST = value | Functor
//@ts-ignore
const rule = "f(X, Y) = X + 1 "

type maybe<T> = null | T;
type binding = Map<string, AST>;
const patternMatchHelper = (pattern: AST, input: AST, binding: binding): maybe<binding> => {
    if (pattern.type === "symbol" && input.type === "symbol") {
        if (pattern.value.value === input.value.value) {
            return binding
        } else {
            return null
        }
    }
    if (pattern.type === "variable") {
        if (pattern.value.value === "_") return binding
        const bound = binding.get(pattern.value.value)
        if (bound) {
            if (equal(bound, input)) {
                return binding
            } else {
                // console.log(`pattern matched failed due to already bound varaible: ${bound} !== ${input.value}`)
                return null;
            }
        } else {
            binding.set(pattern.value.value, input)
            return binding
        }
    }
    if (pattern.type === "functor" && input.type === "functor") {
        if (patternMatchHelper(pattern.value, input.value, binding) && input.args.length === pattern.args.length) {
            for (let i = 0; i < input.args.length; i++) {
                if (!patternMatchHelper(pattern.args[i], input.args[i], binding)) {
                    return null;
                }
            }
            return binding
        } else {
            false
        }
    }
    return null
}
const patternMatch = (pattern: AST, input: AST): maybe<binding> => {
    let binding: binding = new Map()
    return patternMatchHelper(pattern, input, binding)
}
const replace = (bindings: binding, AST: AST): AST => {
    if (AST.type === "functor") {
        const a = bindings.get(AST.value.value.value)
        if (a) {
            return a
        } else {
            // console.log(`${AST.value.value} is not in`, bindings)
            const newF: Functor = {
                type: "functor",
                value: AST.value,
                args: AST.args.map((x) => replace(bindings, x))
            }
            return newF;
        }
    } else {
        // console.log("")
        const a = bindings.get(AST.value.value)
        if (a) {
            return a
        } else {
            // console.log(`${AST.value.value} is not in `, bindings)
            return AST
        }
    }
}
const toRule = (rule: AST): Rule => (input) => {
    if (rule.type !== "functor") {
        throw new Error(`AST is not a functor`)
    }
    if (rule.value.value.value !== "=") {
        console.log("rule.value.value.value is", rule.value.value.value)
        console.log(typeof rule.value.value.value)
        throw new Error(`Is not a logical equality. Full expression is ${ASTToString(rule)}. Symbol is ${rule.value.value.value}`)
    }
    const ins = rule.args[0]
    const outs = rule.args[1]
    const binding = patternMatch(ins, input)
    if (binding) {
        return replace(binding, outs)
    } else {
        return input
    }
}
type Rule = (ast: AST) => AST;
const infixes = new Set<string>(["+", "-", "*", "/", "^", "="])
const ASTToString = (AST: AST): string => {
    if (AST === undefined) {
        return "undefined"
    }
    if (AST.type === "functor") {
        if (infixes.has(AST?.value?.value?.value)) {
            return `(${ASTToString(AST.args[0])} ${AST.value.value} ${ASTToString(AST.args[1])})`
        }
        return `${AST.value.value}(${AST.args.map(ASTToString).join(", ")})`
    }
    return AST?.value?.value
}
const loadRules = (): Rule[] => {
    const file = fs.readFileSync("./src/rules.txt", "utf-8")
    const lines = file.split("\n")
    const rules = lines.map((line) => {
        const a = line.split(" ").slice(1).join(" ");
        // console.log(a)
        return toRule(parse(a))
    })
    const revRules = lines.map((line) => {
        const a = line.split(" ").slice(1).join(" ");
        // console.log(a)
        const p = parse(a)
        return toRule({
            ...p,
            //@ts-ignore
            args: [p.args[1], p.args[0]],
        })
    })
    return [...rules, ...revRules];
}
const different = (ast1: AST, ast2: AST): boolean => ASTToString(ast1) !== ASTToString(ast2)
const equal = (ast1: AST, ast2: AST): boolean => ASTToString(ast1) === ASTToString(ast2)

const applyRule = (ast: AST, rule: Rule): AST => {
    // console.log("call  on", ASTToString(ast))
    if (different(rule(ast), ast)) {
        return rule(ast)
    } else {
        if (ast.type === "functor") {
            const copy = { ...ast }
            for (let i = 0; i < ast.args.length; i++) {
                const arg = { ...ast.args[i] }
                // console.log("loop on", ASTToString(arg))
                if (different(applyRule(arg, rule), arg)) {
                    copy.args[i] = applyRule(arg, rule);
                    return copy
                }
            }
            return ast;
        } else {
            return ast
        }
    }
}
const rules = loadRules()
//@ts-ignore
const apply = (AST: AST): Set<string> => {
    const s = new Set<string>([ASTToString(AST)]);
    for (let i = 0; i < 5; i++) {
        for (const rule of rules) {
            const elements = [...s]
            for (const e of elements) {
                const r = applyRule(parse(e), rule)
                if (!s.has(ASTToString(r))) {
                    console.log("adding", ASTToString(r));
                    s.add(ASTToString(r))
                }
            }
        }
    }
    return s;
}
const size = (ast: AST): number => {
    if (ast.type === "symbol") return 1
    if (ast.type === "variable") return 1
    return 1 + ast.args.map(size).reduce((a, b) => a + b, 0)
}
///@ts-ignore
const simplify = (ast: AST): AST => {
    const equivalent_exprs = apply(ast)
    let min = 9999999;
    //@ts-ignore
    let expr: AST = undefined
    for (const e of equivalent_exprs) {
        // console.log(e)
        if (size(parse(e)) < min) {
            min = size(parse(e));
            expr = parse(e)
        }
    }
    console.log(`found ${equivalent_exprs.size} equivalent exprs`)
    return expr;
}
// const dist = toRule(parse(`A*(B+C) = A*B+A*C`))
// const comm = toRule(parse(` A*B = B*A `))
// const Assoc = toRule(parse(`A+(B+C) = (A+B)+C`))
// const double = toRule(parse(` A + A = 2*A`))
console.log("ast",
    ASTToString(simplify(parse(`deri(square, x)`))),
    // JSON.stringify(parse("F(A,B,C,D,E)"), null, 4),
);
// const dist = toRule(parse(`A*(B+C) = A*B+A*C`))
// console.log("dist", patternMatch(parse(`A+A`), parse("1+2")))
// )
// console.log("rule", ASTToString(toRule(parse("f(X) = X + 1"))(parse("f(1)")))) // 1+1
// console.log("rule", ASTToString(toRule(parse("F(a) = F*a + F"))(parse("g(a)")))) // a+g
// console.log("rule", ASTToString(toRule(parse("A^B * A^C = A^(B+C)"))(parse("2^2*2^3")))) // a+g
// console.log(ASTToString(parse("A^B*C^D= 1")))
// console.log(patternMatch(
//     parse("F(X)"),
//     parse("f(a)")
// ))
// console.log(ASTToString((parse("A^B * A^C = A^(B+C)"))));
// fs.writeFileSync("./dump.json", JSON.stringify(parse("A^B * A^C = A^(B+C)"), null, 4))
