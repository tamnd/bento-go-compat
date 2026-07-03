// A number argument crosses in alongside strings: Repeat takes a string and an
// int count, Contains takes two strings and returns a bool. The count marshals to
// a Go int through the range check the signature drives.
import { Repeat, Contains } from "go:strings";

const s = Repeat("ab", 3);
console.log(s);
console.log(Contains(s, "ba"));
