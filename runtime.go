// Package compat is the end-to-end conformance corpus for bento's TypeScript to
// Go interop. It holds a tree of cases under cases/, each a TypeScript source
// that reaches into a Go package through a go: import, paired with the Go source
// bento lowers it to and the output running that Go prints. The test in this
// package regenerates the lowered Go, checks it against the committed golden, and
// compiles and runs the golden to check its output, so a crossing is proven from
// the .ts a developer writes through to the bytes the program prints.
//
// The blank imports below pin the two runtime packages every golden links: the
// value model that carries bento's numbers, strings, arrays, and byte buffers,
// and the interop bridge that marshals a value across the Go boundary. Naming
// them here keeps the bento module in this module's requirements and fails the
// build early, with a clear import error, if a bento release ever moves or drops
// a package the goldens depend on.
package compat

import (
	_ "github.com/tamnd/bento/pkg/goimport/bridge"
	_ "github.com/tamnd/bento/pkg/value"
)
