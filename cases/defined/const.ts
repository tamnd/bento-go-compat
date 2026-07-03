// A constant of a defined type over a basic strips its brand as it crosses: Second
// and Millisecond are time.Duration values over int64, so each reads as the
// qualified Go constant converted back to the underlying number before it marshals.
import { Second, Millisecond } from "go:time";

console.log(Second);
console.log(Millisecond);
