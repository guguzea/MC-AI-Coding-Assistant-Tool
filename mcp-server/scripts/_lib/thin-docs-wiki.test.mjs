import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertNotProtectedProcessed,
  dokuwikiToMarkdown,
  extractDokuTitle,
  isWikiIndexEntry,
  mergeThinL0,
  wikiSlug,
} from "./thin-docs-wiki.mjs";

test("wikiSlug: colon and json", () => {
  assert.equal(wikiSlug("dev:litemod.json"), "wiki_dev_litemod_json");
  assert.equal(wikiSlug("dev:tutorial:eclipse"), "wiki_dev_tutorial_eclipse");
});

test("dokuwikiToMarkdown: headings and code", () => {
  const raw = "~~META:title=quick start~~\n====== Hello ======\n<code java>\nX\n</code>\n";
  const md = dokuwikiToMarkdown(raw);
  assert.match(md, /^# Hello/m);
  assert.match(md, /```java/);
  assert.equal(extractDokuTitle(raw, "fb"), "quick start");
});

test("dokuwikiToMarkdown: setext Interfaces", () => {
  const raw = "~~NOTOC~~\n\nInterfaces\n==========\n\nAll LiteLoader mods";
  assert.equal(extractDokuTitle(raw, "fb"), "Interfaces");
  assert.match(dokuwikiToMarkdown(raw), /^# Interfaces/m);
});

test("isWikiIndexEntry vs 核实表", () => {
  assert.equal(isWikiIndexEntry({ id: "1.12.2/verified-api", source: "liteloader-docs" }), false);
  assert.equal(isWikiIndexEntry({ id: "1.12.2/wiki_dev", source: "liteloader-wiki" }), true);
  assert.equal(isWikiIndexEntry({ id: "1.13.2/making-mods-wiki", source: "rift-docs" }), false);
  assert.equal(isWikiIndexEntry({ id: "1.13.2/wiki_making_mods", source: "rift-wiki" }), true);
});

test("assertNotProtectedProcessed", () => {
  assert.throws(() => assertNotProtectedProcessed("verified-api.md"), /核实表/);
  assert.throws(() => assertNotProtectedProcessed("making-mods-wiki.md"), /核实表/);
  assert.throws(() => assertNotProtectedProcessed("dev.md"), /wiki_/);
  assert.doesNotThrow(() => assertNotProtectedProcessed("wiki_dev.md"));
});

test("mergeThinL0 keeps 核实表 cards", () => {
  const dir = mkdtempSync(join(tmpdir(), "thin-wiki-"));
  try {
    mkdirSync(dir, { recursive: true });
    const indexPath = join(dir, "index-l0.json");
    writeFileSync(
      indexPath,
      JSON.stringify([
        { id: "1.12.2/verified-api", source: "liteloader-docs", label: "verified-api" },
        { id: "1.12.2/wiki_old", source: "liteloader-wiki", label: "stale" },
      ]),
      "utf8",
    );
    const stats = mergeThinL0(indexPath, [
      { id: "1.12.2/wiki_dev", source: "liteloader-wiki", label: "dev" },
    ]);
    const out = JSON.parse(readFileSync(indexPath, "utf8"));
    assert.equal(stats.kept, 1);
    assert.equal(out[0].id, "1.12.2/verified-api");
    assert.equal(out[1].id, "1.12.2/wiki_dev");
    assert.ok(!out.some((e) => e.id === "1.12.2/wiki_old"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
