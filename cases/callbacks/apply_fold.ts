// A TypeScript function crosses the boundary as a Go func value the library calls
// back. Apply hands the callback a single Go int and returns what it produced, so the
// doubled result crosses back as the Go int Apply returns. SumTo calls the callback
// once per value in a Go loop and folds the results, proving the wrapper survives
// repeated invocation. Greet passes a Go string and a Go int into a two-parameter
// callback, so each argument marshals by its own type. Each drives a void callback
// for its effect, one console.log per value, proving a Go func with no result runs
// with no return to marshal. Together they prove a bento function marshals into a Go
// func value, its Go arguments cross in as bento values, and its result crosses back
// to the Go return type.
import { Apply, SumTo, Greet, Each } from "go:github.com/tamnd/bento/pkg/goimport/funcfixture";

console.log(Apply(5, (n: number): number => n * 2));
console.log(SumTo(4, (i: number): number => i + 1));
console.log(Greet("ada", 3, (name: string, times: number): string => name + "!" + times));
Each(3, (i: number): void => console.log(i));
