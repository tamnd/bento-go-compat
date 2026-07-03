// A panic inside the Go library becomes a catchable exception: Repeat with a
// negative count panics, and the boundary guard converts that panic to a thrown
// GoError whose message is the panic's string form, which a bento try/catch
// recovers and reads.
import { Repeat } from "go:strings";

try {
  Repeat("x", -1);
} catch (e) {
  if (e instanceof Error) {
    console.log("caught: " + e.message);
  }
}
