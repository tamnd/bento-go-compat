// The wide integer results cross back through the range check: ParseInt returns a
// Go int64 and ParseUint a Go uint64, each paired with an error that hoists to a
// throw, and the base and bit-size arguments marshal in as Go ints.
import { ParseInt, ParseUint } from "go:strconv";

console.log(ParseInt("123", 10, 64));
console.log(ParseUint("456", 10, 64));
