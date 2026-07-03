// A fixed parameter ahead of a variadic tail marshals by its own type while the
// tail marshals by the element type: Sprintf takes a fixed format string and a
// variadic ...any, so the format crosses through the string bridge and each
// trailing argument boxes through the any crossing before the formatted result
// crosses back.
import { Sprintf } from "go:fmt";

console.log(Sprintf("%s and %s", "cats", "dogs"));
