// A Uint8Array crosses into Go as a []byte and a []byte crosses back as a
// Uint8Array. The buffer is built from a number list, so its construction is the
// value model's own; EncodeToString takes a []byte, so the buffer marshals through
// the byte bridge on the way in and the hex string crosses back. DecodeString
// returns a ([]byte, error), so the error half feeds the throw machinery and the
// byte half crosses back into a Uint8Array whose length and bytes are then read.
// The bytes spell "Hello" (0x48 0x65 0x6c 0x6c 0x6f), so back[0] is 72 and back[4]
// is 111.
import { EncodeToString, DecodeString } from "go:encoding/hex";

const buf = new Uint8Array([65, 66, 67]);
console.log(EncodeToString(buf));

const back = DecodeString("48656c6c6f");
console.log(back.length);
console.log(back[0]);
console.log(back[4]);
