// A Go []struct result crosses back as a bento array of read-only object boxes. Each
// element is the same box a lone struct result becomes, so the program reads the
// array's length and then reads the fields off an indexed element exactly as it would
// off a single struct. Diagonal returns points on the line y=x, so element i carries
// x=i and y=i, and Profiles returns a roster whose elements carry a string, a number,
// and a boolean field each, proving the crossing holds over every basic field kind
// inside the array.
import {
  Diagonal,
  Profiles,
} from "go:github.com/tamnd/bento/pkg/goimport/structfixture";

const pts = Diagonal(3);
console.log(pts.length);
console.log(pts[0].X + pts[0].Y);
console.log(pts[2].X + pts[2].Y);

const rows = Profiles();
console.log(rows.length);
console.log(rows[0].Name + " " + rows[0].Age + " " + rows[0].Active);
console.log(rows[1].Name + " " + rows[1].Age + " " + rows[1].Active);
