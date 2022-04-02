# SymLogic


Symbolic Logic is an experssion manipulator inspired
by [noq](https://github.com/tsoding/Noq/).
It is also inspired by the [Wolfram Language](https://www.wolfram.com/language/)

# How it works
First you give SymLogic a set of rules like

```
dist A*(B+C) = A*B+A*C
comm A*B = B*A 
Assoc A+(B+C) = (A+B)+C
double A + A = 2*A
square A^2 = A*A
```

Then you give it an expression to transform like

```
(A+B)^2
```

And SymLogic will find all equivalent expressions

```
((A + B) ^ 2)
((A + B) * (A + B))
(((A + B) * A) + ((A + B) * B))
(2 * ((A + B) * B))
(((A + B) * B) * 2)
(((A + B) * B) + ((A + B) * B))
(((A + B) * B) ^ 2)
(2 ^ 2)
(((A + B) * B) * ((A + B) * B))
(2 * 2)
((A + B) * (B + B))
((B + B) * (A + B))
(2 + 2)
((B + B) ^ 2)
(((B + B) * A) + ((B + B) * B))
(2 * ((B + B) * B))
((B + B) * (B + B))
(((B + B) * B) * 2)
(((B + B) * B) + ((B + B) * B))
(((B + B) * B) ^ 2)
(((B + B) * B) * ((B + B) * B))
```