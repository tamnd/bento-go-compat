// A bool crosses in as an argument: FormatBool takes a Go bool and returns its
// "true" or "false" spelling, so the boolean the TypeScript passes marshals across
// the boundary and the string comes back.
import { FormatBool } from "go:strconv";

console.log(FormatBool(true));
console.log(FormatBool(false));
