// A (T, error) Go result hoists its error to a throw: Atoi returns (int, error), so
// a good parse crosses the int back and a bad one throws an Error whose message is
// the Go error's string, which a bento catch recovers and reads.
import { Atoi } from "go:strconv";

console.log(Atoi("42"));
try {
  Atoi("nope");
} catch (e) {
  if (e instanceof Error) {
    console.log("caught: " + e.message);
  }
}
