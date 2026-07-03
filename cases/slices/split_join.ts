// A slice crosses both ways: Split returns a []string that becomes a bento array,
// and Join takes that array back as a []string. Each element marshals through the
// string crossing on its own, so the round trip is element by element.
import { Split, Join } from "go:strings";

const parts = Split("a,b,c", ",");
console.log(Join(parts, "-"));
