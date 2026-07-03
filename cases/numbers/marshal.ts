// Numbers cross in three shapes the signature settles: Itoa takes a Go int, Abs
// takes and returns a float64 with no conversion, and RuneCountInString returns a
// Go int widened back to a number through the range check.
import { Itoa } from "go:strconv";
import { Abs } from "go:math";
import { RuneCountInString } from "go:unicode/utf8";

console.log(Itoa(42));
console.log(Abs(-3.5));
console.log(RuneCountInString("héllo"));
