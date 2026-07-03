// A string crosses into Go and back: ToUpper takes a string and returns one,
// HasPrefix takes two strings and returns a bool. This is the plainest go:
// crossing, the one every other case builds on.
import { ToUpper, HasPrefix } from "go:strings";

const shout = ToUpper("hello");
const ok = HasPrefix(shout, "HE");
console.log(shout);
console.log(ok);
