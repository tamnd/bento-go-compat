package compat

import (
	"bytes"
	"flag"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	"github.com/tamnd/bento/pkg/build"
)

// stamp is the fixed build identifier written into every golden's generated
// header, in place of the version and commit the CLI records, so a golden names
// the corpus rather than the exact bento build that produced it and does not
// churn when that build's version moves. Regenerating with -update always writes
// this stamp, and the check below always compares against it, so the header is
// deterministic across machines and releases.
const stamp = "conformance"

// update, set by `go test -update`, rewrites every golden from the current
// lowering instead of checking against the committed one. It regenerates only the
// .golden files, never the .out files: the expected output is the ground truth of
// what correct JavaScript semantics produce, authored by hand and checked against
// the golden's actual run, so it is never derived from the compiler it is meant to
// hold honest.
var update = flag.Bool("update", false, "rewrite the .golden files from the current lowering")

// aCase is one corpus entry: a TypeScript source and the two files that pin its
// behavior, the generated Go golden and the expected program output. The name is
// the path under cases/ without an extension, used for the subtest name and the
// failure messages.
type aCase struct {
	name   string // e.g. "strings/upper_prefix"
	ts     string // absolute path to the .ts source
	golden string // absolute path to the .golden generated Go
	out    string // absolute path to the .out expected stdout
}

// discoverCases walks the cases tree and returns one entry per .ts source, sorted
// by name so the suite runs in a stable order. It is the single place that knows
// the corpus layout, so adding a case is only a matter of dropping the three files
// in a directory under cases/.
func discoverCases(t *testing.T) []aCase {
	t.Helper()
	root, err := filepath.Abs("cases")
	if err != nil {
		t.Fatalf("resolve cases dir: %v", err)
	}
	var cases []aCase
	err = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || !strings.HasSuffix(path, ".ts") {
			return nil
		}
		base := strings.TrimSuffix(path, ".ts")
		name, err := filepath.Rel(root, base)
		if err != nil {
			return err
		}
		cases = append(cases, aCase{
			name:   filepath.ToSlash(name),
			ts:     path,
			golden: base + ".golden",
			out:    base + ".out",
		})
		return nil
	})
	if err != nil {
		t.Fatalf("walk cases: %v", err)
	}
	sort.Slice(cases, func(i, j int) bool { return cases[i].name < cases[j].name })
	if len(cases) == 0 {
		t.Fatal("no cases found under cases/")
	}
	return cases
}

// TestGoldensMatchLowering proves the committed golden is exactly the Go bento
// lowers each .ts to today. It re-runs the real ahead-of-time front half through
// build.EmitGo and compares byte for byte, so a change in the lowerer that would
// alter the generated code shows up here as a diff a reviewer sees before it lands.
// With -update it writes the new lowering instead of failing, the one supported way
// to move a golden.
func TestGoldensMatchLowering(t *testing.T) {
	for _, c := range discoverCases(t) {
		t.Run(c.name, func(t *testing.T) {
			t.Parallel()
			got, err := build.EmitGo(c.ts, stamp)
			if err != nil {
				t.Fatalf("EmitGo(%s): %v", c.name, err)
			}
			if *update {
				if err := os.WriteFile(c.golden, []byte(got), 0o644); err != nil {
					t.Fatalf("write golden: %v", err)
				}
				return
			}
			want, err := os.ReadFile(c.golden)
			if err != nil {
				t.Fatalf("read golden (run with -update to create it): %v", err)
			}
			if got != string(want) {
				t.Errorf("generated Go for %s does not match %s\nrun `go test -update` to refresh it after reviewing the change\n--- got ---\n%s", c.name, filepath.Base(c.golden), got)
			}
		})
	}
}

// TestGoldensRunToExpectedOutput proves the crossing works all the way through: it
// compiles the committed golden against bento's real runtime and runs it, then
// checks what it printed against the expected output. This is the end-to-end proof
// the corpus exists for, the .out is the behavior a developer expects and the
// golden is the code that must produce it, so a runtime regression that still
// compiles is caught by the bytes it prints. It compiles the golden the corpus
// ships, not a fresh lowering, so the checked-in artifact itself is exercised.
func TestGoldensRunToExpectedOutput(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping golden compile-and-run under -short")
	}
	if _, err := exec.LookPath("go"); err != nil {
		t.Skip("go toolchain not found on PATH; running a golden needs it")
	}
	root, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	for _, c := range discoverCases(t) {
		t.Run(c.name, func(t *testing.T) {
			t.Parallel()
			golden, err := os.ReadFile(c.golden)
			if err != nil {
				t.Fatalf("read golden: %v", err)
			}
			want, err := os.ReadFile(c.out)
			if err != nil {
				t.Fatalf("read expected output (run with -update after authoring it): %v", err)
			}
			got := runGolden(t, root, golden)
			if got != string(want) {
				t.Errorf("%s printed %q, want %q", c.name, got, want)
			}
		})
	}
}

// runGolden writes the golden into a scratch directory inside this module and runs
// it with `go run`, returning what it printed. The scratch directory sits under the
// module root so the golden's imports of bento's value package and interop bridge
// resolve from this module's requirements with no separate go.mod, the same way
// bento's own build compiles a program inside its module tree.
func runGolden(t *testing.T, root string, golden []byte) string {
	t.Helper()
	dir, err := os.MkdirTemp(root, "goldenrun-")
	if err != nil {
		t.Fatalf("scratch dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(dir) }()
	if err := os.WriteFile(filepath.Join(dir, "main.go"), golden, 0o644); err != nil {
		t.Fatalf("write golden main: %v", err)
	}
	cmd := exec.Command("go", "run", ".")
	cmd.Dir = dir
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		t.Fatalf("go run failed: %v\n--- golden ---\n%s\n--- stderr ---\n%s", err, golden, stderr.String())
	}
	return stdout.String()
}

// TestEveryCaseHasItsThreeFiles proves the corpus is complete in shape: every .ts
// has a golden and an expected-output file beside it, and every golden and .out has
// a .ts that owns it. A crossing added without its golden or its output, or a stray
// file left after a case is renamed, fails here rather than silently sitting
// unchecked, which is what keeps the corpus honest about covering what it claims.
func TestEveryCaseHasItsThreeFiles(t *testing.T) {
	cases := discoverCases(t)
	owned := map[string]bool{}
	for _, c := range cases {
		owned[c.golden] = true
		owned[c.out] = true
		for _, f := range []struct{ path, kind string }{
			{c.golden, "golden"},
			{c.out, "expected-output"},
		} {
			if _, err := os.Stat(f.path); err != nil {
				t.Errorf("case %s is missing its %s file %s", c.name, f.kind, filepath.Base(f.path))
			}
		}
	}
	root, err := filepath.Abs("cases")
	if err != nil {
		t.Fatalf("resolve cases dir: %v", err)
	}
	err = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		switch filepath.Ext(path) {
		case ".golden", ".out":
			if !owned[path] {
				rel, _ := filepath.Rel(root, path)
				t.Errorf("%s has no .ts source that owns it", filepath.ToSlash(rel))
			}
		}
		return nil
	})
	if err != nil {
		t.Fatalf("walk cases: %v", err)
	}
}
