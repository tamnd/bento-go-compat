// A map crosses the boundary as a real bento Map, not a plain object: Counts
// returns a map[string]int of word frequencies, and the program reads it back with
// the Map API, .has for a key that is present, .has for one that is absent, and .size
// for the entry count, then hands the same map to Total, which sums the counts on the
// Go side. The round trip proves a map result becomes a Map, the Map is a real value
// the bento program owns, and that Map crosses back into Go as a map argument.
import { Counts, Total } from "go:github.com/tamnd/bento/pkg/goimport/mapfixture";

const counts = Counts("a b a c b a");
console.log(counts.has("a"));
console.log(counts.has("z"));
console.log(counts.size);
console.log(Total(counts));
