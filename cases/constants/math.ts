// A go: constant is read where a value is expected: Pi is an untyped float that
// crosses as a plain float64, and MaxInt32 is an untyped int that crosses through
// the range check. A constant read cannot panic, so it carries no boundary guard.
import { Pi, MaxInt32 } from "go:math";

console.log(Pi);
console.log(MaxInt32);
