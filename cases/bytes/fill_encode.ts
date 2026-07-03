// A Uint8Array allocated at a length, then written byte by byte, then crossed into
// Go as a []byte. new Uint8Array(3) zeroes a three-byte buffer, each element is set
// with an indexed write, and EncodeToString marshals the filled buffer through the
// byte bridge and returns its hex. The bytes are 0x48 0x69 0x21 ("Hi!"), so the hex
// is 486921.
import { EncodeToString } from "go:encoding/hex";

const b = new Uint8Array(3);
b[0] = 72;
b[1] = 105;
b[2] = 33;
console.log(EncodeToString(b));
