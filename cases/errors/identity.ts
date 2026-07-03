// A caught Go error keeps its identity: the error Atoi returns for a bad number
// wraps strconv.ErrSyntax, and the caught error's is() against a go: sentinel
// lowers to errors.Is against the real variable, so is(ErrSyntax) is true where
// is(ErrRange) is false, the same branch a Go author writes with errors.Is.
import { Atoi, ErrSyntax, ErrRange } from "go:strconv";
import { GoError } from "bento:go";

try {
  Atoi("nope");
} catch (e) {
  if (e instanceof GoError) {
    console.log(e.is(ErrSyntax));
    console.log(e.is(ErrRange));
  }
}
