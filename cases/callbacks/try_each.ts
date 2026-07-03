// A callback that reports failure through a Go error return is the WalkFunc shape:
// TryEach calls the callback for each value and stops at the first error it gets back,
// where a TypeScript author signals that error with a throw. So a throw inside the
// bento callback has to become the Go func's non-nil error for TryEach to see it and
// stop. The callback routes its conditional throw through a named function because a
// block-body arrow is a later slice, but the crossing is the same. The first call
// throws at 2, so TryEach stops and its (int, error) result hoists back to a throw the
// program catches and reads. The second never reaches 2, so TryEach runs to the end
// and returns its count, proving a callback that does not throw hands Go a nil error.
import { TryEach } from "go:github.com/tamnd/bento/pkg/goimport/funcfixture";

function boom(i: number): void {
  if (i === 2) {
    throw new Error("stop at " + i);
  }
}

try {
  console.log(TryEach(4, (i: number): void => boom(i)));
} catch (e) {
  if (e instanceof Error) {
    console.log("caught: " + e.message);
  }
}
console.log(TryEach(2, (i: number): void => boom(i)));
