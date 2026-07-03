// A variadic Go function spreads its arguments positionally: Join is
// func(...string), so each argument marshals through the string crossing on its own
// and Go reassembles the slice, with no bento-side slice built. The no-argument
// call reassembles into an empty slice and returns the empty string.
import { Join } from "go:path";

console.log(Join("usr", "local", "bin"));
console.log(Join());
