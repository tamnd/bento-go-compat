# bento-go-compat

An end-to-end conformance corpus for bento's TypeScript to Go interop.

bento compiles a typed subset of TypeScript to Go and links it into a single
native binary.
Part of that surface is the `go:` import: a TypeScript module reaches into a real
Go package, and bento marshals every value that crosses the boundary through its
interop bridge.
This repository proves that crossing works, one data type and one shape at a time,
from the TypeScript a developer writes through to the bytes the compiled program
prints.

Each case is three files that live together under `cases/`:

- `<name>.ts` is the TypeScript source, a small program that imports a `go:`
  package and prints what it gets back.
- `<name>.golden` is the Go source bento lowers that TypeScript to, committed so a
  change in the compiler shows up as a reviewable diff.
- `<name>.out` is exactly what the program prints, the behavior a developer expects
  under correct JavaScript semantics.

The test harness holds all three honest against each other:

1. `TestGoldensMatchLowering` re-runs bento's real ahead-of-time lowering
   (`build.EmitGo`) on each `.ts` and checks the result byte for byte against the
   committed `.golden`.
2. `TestGoldensRunToExpectedOutput` compiles the committed `.golden` against
   bento's real runtime and runs it, then checks what it printed against the
   `.out`.
3. `TestEveryCaseHasItsThreeFiles` checks that every `.ts` has a golden and an
   output beside it, and that no stray golden or output is left without a source.

The `.golden` is generated and the `.out` is authored by hand, so the two never
derive from each other.
The lowering test proves bento produces the code we reviewed, and the run test
proves that code still behaves, so a runtime regression that keeps compiling is
caught by the bytes it prints.

## Running it

```
go test ./...          # regenerate, compare, compile, and run every case
go test -short ./...    # lowering and completeness checks only, skips compile-and-run
go test -update ./...   # rewrite the goldens from the current lowering
```

The harness pins one bento release in `go.mod`, so the corpus tracks a known
compiler rather than whatever is checked out next door.
Bumping bento is a deliberate step: raise the version, run `go test -update`,
review the golden diff, and commit.

## What is covered

Every case below runs green, TypeScript in and expected output out, against the
pinned bento.

| Case | Crossing it proves |
| --- | --- |
| `strings/upper_prefix` | string argument and result, bool result |
| `strings/repeat_contains` | int argument alongside strings, bool result |
| `numbers/marshal` | int argument, float64 both ways, int result through the range check |
| `numbers/parse_widths` | int64 and uint64 results, `(T, error)` hoisted to a throw |
| `booleans/format` | bool argument |
| `constants/math` | untyped float and untyped int constants |
| `defined/const` | a defined-type constant over int64 stripped to its number |
| `defined/param` | a defined-type parameter converted to its named Go type |
| `slices/split_join` | `[]string` result and argument, element by element |
| `slices/fields_length` | a slice result as a real bento array with `.length` |
| `variadic/path_join` | a variadic `...string` spread, including the zero-argument call |
| `variadic/sprintf` | a fixed parameter ahead of a variadic `...any` tail |
| `errors/atoi_throw` | a Go error hoisted to a catchable `Error` with its message |
| `errors/identity` | `errors.Is` against a `go:` sentinel through `err.is` |
| `errors/panic_guard` | a Go panic converted to a catchable exception |
| `namespace/two_packages` | the `import * as` namespace form over two packages |
| `opaque/level_roundtrip` | a non-projected Go type carried through as an opaque token |
| `any/echo_name` | an `any` parameter and result, number, string, and bool kinds |
| `bytes/hex_roundtrip` | a `Uint8Array` into `[]byte` and a `[]byte` back into a `Uint8Array`, with length and indexed reads |
| `bytes/fill_encode` | a length-allocated `Uint8Array` written byte by byte, then crossed into `[]byte` |

## What is not covered yet

These crossings are landing in bento's runtime and get their cases here as each one
starts to lower.
The corpus grows with the compiler, so this list is the honest edge of what is
proven, not a set of silent gaps.

- `Map<K, V>`, a Go map crossed as a keyed collection.
- a Go struct crossed as an object box, with field identity and write-through.
- a TypeScript callback passed in as a Go `func`.
- `bigint`, the opt-in wide-integer crossing.

## Adding a case

Drop the three files in a directory under `cases/`, then generate the golden:

```
cases/<category>/<name>.ts     # the TypeScript that reaches into a go: package
cases/<category>/<name>.out    # the exact bytes it should print
go test -run TestGoldensMatchLowering -update ./...   # writes <name>.golden
go test ./...                                          # proves it end to end
```

Author the `.out` by hand from what correct semantics produce, never from the
golden's own run, so the output stays an independent check on the compiler.
