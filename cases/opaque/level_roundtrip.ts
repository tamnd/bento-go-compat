// A Go type the bridge does not project crosses as an opaque token: WithLevel
// returns a Level the program never inspects, holds as a bridge.Opaque, and hands
// straight back to Describe, which recovers the concrete type and reads the level
// it carries. The token round-trips through bento untouched.
import { WithLevel, Describe } from "go:github.com/tamnd/bento/pkg/goimport/optfixture";

const opt = WithLevel(7);
console.log(Describe(opt));
