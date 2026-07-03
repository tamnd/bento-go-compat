// A Go struct result crosses back as a read-only object box: MakePoint returns a
// Point with two integer fields, and the program reads them straight off the boxed
// result, so a struct becomes an object whose fields are the Go fields. The box then
// crosses back into Go as a struct argument to Sum, and a fresh object literal that
// matches the shape crosses in the same way, so a struct parameter accepts either a
// boxed result or a plain object.
import { MakePoint, Sum } from "go:github.com/tamnd/bento/pkg/goimport/structfixture";

const p = MakePoint(3, 4);
console.log(p.X);
console.log(p.Y);
console.log(Sum(p));
console.log(Sum({ X: 10, Y: 20 }));
