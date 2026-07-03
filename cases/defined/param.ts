// A defined-type parameter converts the crossed number to the named Go type on the
// way in: Sleep takes a time.Duration, so the Duration-branded Millisecond constant
// marshals as an int64 and is wrapped in time.Duration before the call. The sleep
// is a single millisecond, there only to prove the crossing, and the program prints
// once it returns.
import { Sleep, Millisecond } from "go:time";

Sleep(Millisecond);
console.log("slept");
