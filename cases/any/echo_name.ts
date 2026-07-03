// An any parameter boxes and unboxes through the value model: Echo takes and
// returns a Go any, so an argument lifts to a value and marshals across, and Name
// reports the Go kind the crossing unwrapped it to. A number stays a number across
// the round trip, a string reports as a string, and a bool as a bool.
import { Echo, Name } from "go:github.com/tamnd/bento/pkg/goimport/anyfixture";

console.log(Name(Echo(3)));
console.log(Name("hi"));
console.log(Name(true));
