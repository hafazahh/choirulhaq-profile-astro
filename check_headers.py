#!/usr/bin/env python3
"""Validate a Cloudflare Pages _headers file the way Pages parses it.

Checks the exact shape that cost this site an A+ grade:
  - comments (#) must never appear INSIDE a header block (indented)
  - every header block must have at least one indented `Name: value` line
  - the pattern `/*` block must carry the full security header set
  - no duplicate `/*` URL-pattern blocks
"""

import sys


def parse_headers(path):
    """Return list of (url_pattern, [(header, value)], start_line)."""
    blocks = []
    current = None
    with open(path, encoding="utf-8") as fh:
        for lineno, raw in enumerate(fh, 1):
            line = raw.rstrip("\n")
            if not line.strip():
                continue
            if line.lstrip().startswith("#"):
                # A comment at column 0 separates blocks; indented it is
                # inside a block and Pages may drop the whole block.
                if line != line.lstrip():
                    yield ("COMMENT_INSIDE_BLOCK", lineno, line)
                continue
            if not line.startswith((" ", "\t")):
                if current is not None:
                    blocks.append(current)
                current = (line.strip(), [], lineno)
                continue
            if current is None:
                yield ("HEADER_BEFORE_PATTERN", lineno, line)
                continue
            if ":" not in line:
                yield ("MALFORMED_HEADER", lineno, line)
                continue
            name, _, value = line.strip().partition(":")
            current[1].append((name.strip(), value.strip()))
    if current is not None:
        blocks.append(current)
    for pattern, headers, start in blocks:
        yield ("BLOCK", start, (pattern, headers))


def main(path):
    errors = []
    blocks = []
    for kind, lineno, payload in parse_headers(path):
        if kind == "COMMENT_INSIDE_BLOCK":
            errors.append(f"line {lineno}: comment inside a header block -> {payload!r}")
        elif kind == "HEADER_BEFORE_PATTERN":
            errors.append(f"line {lineno}: header line before any URL pattern -> {payload!r}")
        elif kind == "MALFORMED_HEADER":
            errors.append(f"line {lineno}: no ':' in line -> {payload!r}")
        else:
            blocks.append(payload)

    seen = {}
    for pattern, headers in blocks:
        if not headers:
            errors.append(f"pattern {pattern!r}: block has no valid header lines")
        if pattern in seen:
            errors.append(f"pattern {pattern!r}: defined twice (also at line {seen[pattern]})")
        seen[pattern] = None

    required = {
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Cross-Origin-Opener-Policy",
        "Cross-Origin-Resource-Policy",
    }
    catchall = seen and "/*" in seen
    if not catchall:
        errors.append("no `/*` catch-all block found")
    else:
        names = {n for n, _ in next(h for p, h in blocks if p == "/*")}
        missing = required - names
        if missing:
            errors.append(f"`/*` block is missing: {', '.join(sorted(missing))}")
        csp = dict(next(h for p, h in blocks if p == "/*")).get(
            "Content-Security-Policy", ""
        )
        if "script-src" in csp and "'unsafe-inline'" in csp.split("script-src", 1)[1].split(";", 1)[0]:
            errors.append("CSP script-src contains 'unsafe-inline' -> caps the grade at A")

    print(f"blocks parsed: {len(blocks)}")
    for pattern, headers in blocks:
        print(f"  {pattern:16s} {len(headers)} header(s)")
    if errors:
        print("\nERRORS:")
        for e in errors:
            print("  -", e)
        return 1
    print("\nOK - structure matches what Pages accepts.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "dist/_headers"))
