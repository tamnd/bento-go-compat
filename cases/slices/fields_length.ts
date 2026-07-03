// A slice result is a real bento array that carries its own length: Fields splits
// on whitespace into a []string, and reading .length on the array the crossing
// produced counts its elements without a second call into Go.
import { Fields } from "go:strings";

const words = Fields("one two three");
console.log(words.length);
