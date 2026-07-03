// The same WalkFunc crossing as try_each, but the callback carries a statement
// block instead of routing its conditional through a named function. A block body
// is what a developer actually writes when the callback needs a local or an if, so
// this proves the block lowers inside the Go func value: the local is computed, the
// inline throw becomes the func's non-nil error, and TryEach stops at the first one.
// The first call throws on the third step, so TryEach's (int, error) result hoists
// back to a throw the program catches and reads. The second never trips the limit,
// so the block runs to the end on every step and hands Go a nil error, and TryEach
// returns its count.
import { TryEach } from "go:github.com/tamnd/bento/pkg/goimport/funcfixture";

try {
  console.log(
    TryEach(5, (i: number): void => {
      const doubled = i * 2;
      if (doubled >= 4) {
        throw new Error("too far at " + i);
      }
    }),
  );
} catch (e) {
  if (e instanceof Error) {
    console.log("caught: " + e.message);
  }
}

console.log(
  TryEach(2, (i: number): void => {
    const doubled = i * 2;
    if (doubled >= 4) {
      throw new Error("too far at " + i);
    }
  }),
);
