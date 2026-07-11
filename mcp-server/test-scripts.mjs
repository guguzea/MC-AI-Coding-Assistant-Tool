import assert from "node:assert/strict";

import { parseCliArgs, compareVersions } from "./scripts/_lib/args.js";
import { parseCSV } from "./scripts/_lib/csv.js";
import { resolveLatestKey } from "./scripts/check-porting-updates.js";
import { extractChapterPaths } from "./scripts/probe-forge-versions.js";

assert.equal(parseCliArgs(["--version=1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version", "1.20.1"]).flags.version, "1.20.1");
assert.equal(parseCliArgs(["--version="]).flags.versionError, "empty-value");
assert.equal(parseCliArgs(["--version"]).flags.versionError, "missing-value");
assert.ok(compareVersions("1.10.2", "1.9.4") > 0);
assert.ok(compareVersions("20.4.237", "20.2.88") > 0);
assert.equal(resolveLatestKey("neoforge", "1.20.4"), "1.20.4");
assert.equal(resolveLatestKey("neoforge", "1.20.1"), "1.20.1");

const forgeChapters = extractChapterPaths(
  '<a href="../resources/server/recipes/custom/">Custom</a><a href="/en/1.20.1/images/logo.png">Image</a>',
  "https://docs.readthedocs.net/en/1.20.1/gettingstarted/",
);
assert.ok(forgeChapters.includes("resources/server/recipes/custom"));
assert.ok(!forgeChapters.some((chapter) => chapter.includes("images")));

const parsed = parseCSV('searge,name,side,desc\nfunc_1,foo,2,"(I,Ljava/lang/String;)V"\n');
assert.deepEqual(parsed.errors, []);
assert.equal(parsed.rows[0].desc, "(I,Ljava/lang/String;)V");

const escaped = parseCSV('name,desc\nfoo,"contains ""quoted"", comma"\n');
assert.deepEqual(escaped.errors, []);
assert.equal(escaped.rows[0].desc, 'contains "quoted", comma');

const malformed = parseCSV('name,desc\nfoo,"unterminated');
assert.ok(malformed.errors.some((error) => error.includes("unterminated")));

console.log("script helper regression tests passed");
