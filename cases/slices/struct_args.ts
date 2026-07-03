// A bento array of objects crosses into a Go []struct argument, the inverse of the
// struct_boxes result. SumSlice takes a Go []Point and sums each element's fields on
// the Go side, so a bento array of point objects marshals element by element into the
// Go slice and comes back as one number. DescribeAll takes a Go []Profile and joins a
// string, a number, and a boolean field off every element, proving the argument
// crossing holds over every basic field kind inside the array. Each array is bound to
// a variable first so its element type is the object shape the elements infer, which
// is how idiomatic code passes a built-up array into a Go call.
import {
  SumSlice,
  DescribeAll,
} from "go:github.com/tamnd/bento/pkg/goimport/structfixture";

const pts = [
  { X: 1, Y: 2 },
  { X: 3, Y: 4 },
];
console.log(SumSlice(pts));

const one = [{ X: 5, Y: 6 }];
console.log(SumSlice(one));

const rows = [
  { Name: "ada", Age: 36, Active: true },
  { Name: "linus", Age: 21, Active: false },
];
console.log(DescribeAll(rows));
