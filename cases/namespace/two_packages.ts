// The namespace form binds a whole Go package and calls its members through the
// binding, lowering to the same direct Go calls a named import would: strs.ToUpper
// and strs.HasPrefix cross through the bridge, and a second namespace's sc.Itoa
// marshals a number, all in one program.
import * as strs from "go:strings";
import * as sc from "go:strconv";

const shout = strs.ToUpper("hello");
console.log(shout);
console.log(strs.HasPrefix(shout, "HE"));
console.log(sc.Itoa(42));
