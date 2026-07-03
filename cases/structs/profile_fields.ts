// A struct crossing carries every basic field kind at once: Profile has a string
// name, a numeric age, and a boolean flag. MakeProfile builds one on the Go side and
// the program reads all three fields off the box, and Describe takes a Profile back
// so a fresh object literal with the three field kinds crosses in and the Go side
// renders it. This proves each field marshals by its own type across both directions.
import { MakeProfile, Describe } from "go:github.com/tamnd/bento/pkg/goimport/structfixture";

const u = MakeProfile("ada", 36, true);
console.log(u.Name);
console.log(u.Age);
console.log(u.Active);
console.log(Describe(u));
console.log(Describe({ Name: "bob", Age: 5, Active: false }));
