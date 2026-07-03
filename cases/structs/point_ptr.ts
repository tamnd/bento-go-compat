// A pointer to a Go struct crosses the boundary as the same read-only object box a
// value struct uses. MakePointPtr returns a *Point, and the program reads its fields
// straight off the boxed result, because a field read auto-derefs on the Go side and
// a bento object is already a reference. The box then crosses back into Go as a
// *Point argument to SumPtr, and a fresh object literal that matches the shape crosses
// in the same way, so a pointer parameter accepts either a boxed result or a plain
// object.
import { MakePointPtr, SumPtr } from "go:github.com/tamnd/bento/pkg/goimport/structfixture";

const p = MakePointPtr(3, 4);
console.log(p.X);
console.log(p.Y);
console.log(SumPtr(p));
console.log(SumPtr({ X: 10, Y: 20 }));
