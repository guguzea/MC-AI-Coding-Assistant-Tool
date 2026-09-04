import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  buildYarnSqliteForDir,
  importTinyStream,
  openYarnDb,
  initYarnSchema,
} from "./build-yarn-sqlite.mjs";
import { Readable } from "node:stream";

const SAMPLE_TINY = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "METHOD\ta\t()V\tx\ty\tdidFoo",
  "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
  "",
].join("\n");

test("importTinyStream inserts classes with indexes", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-sqlite-"));
  const dbPath = path.join(dir, "t.sqlite");
  const db = openYarnDb(dbPath);
  try {
    const r = await importTinyStream(db, Readable.from([SAMPLE_TINY]), {
      version: "1.20.1",
      format: "yarn-tiny-v1",
    });
    assert.equal(r.classCount, 2);
    const row = db.prepare("SELECT named, intermediary, official FROM classes WHERE named = ?").get(
      "net/minecraft/Alpha",
    );
    assert.equal(row.intermediary, "net/minecraft/class_1");
    assert.equal(row.official, "a");
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("buildYarnSqliteForDir from tiny file", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-sqlite-dir-"));
  fs.writeFileSync(path.join(dir, "mappings.tiny"), SAMPLE_TINY);
  const r = await buildYarnSqliteForDir(dir, { version: "1.20.1" });
  assert.ok(fs.existsSync(r.outPath));
  assert.equal(r.classCount, 2);
  const db = openYarnDb(r.outPath, { readonly: true });
  try {
    const n = db.prepare("SELECT COUNT(*) AS c FROM classes").get().c;
    assert.equal(n, 2);
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("initYarnSchema is idempotent", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-schema-"));
  const dbPath = path.join(dir, "s.sqlite");
  const db = openYarnDb(dbPath);
  try {
    initYarnSchema(db);
    initYarnSchema(db);
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("initYarnSchema creates name_official/intermediary indexes", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-idx-"));
  const dbPath = path.join(dir, "s.sqlite");
  const db = openYarnDb(dbPath);
  try {
    initYarnSchema(db);
    const names = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all().map((r) => r.name);
    for (const n of [
      "idx_methods_name_official",
      "idx_methods_name_intermediary",
      "idx_fields_name_official",
      "idx_fields_name_intermediary",
    ]) {
      assert.ok(names.includes(n), `missing ${n}: ${names.join(",")}`);
    }
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Yarn tiny for 1.19.4 / 1.20.1 / 1.20.4 writes constructors out with the *named* column
// literally `<init>` (3,784 / 3,919 / 4,070 lines). Those rows are deliberately NOT stored.
const CTOR_TINY = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "METHOD\ta\t()V\tx\ty\tdidFoo",
  "METHOD\ta\t()V\t<init>\t<init>\t<init>",
  "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
  "",
].join("\n");

test("tiny <init> rows stay out of methods, and meta separates source lines from stored rows", async () => {
  // Anti-drift pair: build-yarn-mappings.mjs#isSkippedBySqliteBuilder encodes the same
  // `<` rule, and `verify` compares the *inserted* subset at tolerance 0. Flipping either
  // side alone must go red — measured on fabric_1.19.4: storing ctor rows yields
  // `census methods.inserted: json/tiny=36036 sqlite=39820`.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-ctor-"));
  fs.writeFileSync(path.join(dir, "mappings.tiny"), CTOR_TINY);
  const r = await buildYarnSqliteForDir(dir, { version: "1.20.1" });
  const db = openYarnDb(r.outPath, { readonly: true });
  try {
    const meta = Object.fromEntries(
      db.prepare("SELECT key,value FROM meta").all().map((x) => [x.key, x.value]),
    );
    const rows = db.prepare("SELECT name_named FROM methods ORDER BY name_named").all();
    assert.deepEqual(
      rows.map((x) => x.name_named),
      ["didFoo"],
      "`<init>` 不得入库（与 isSkippedBySqliteBuilder 同规则）",
    );
    assert.equal(meta.methodCount, "2", "methodCount = tiny METHOD 源行数（含 <init>）");
    assert.equal(meta.storedMethodCount, "1", "storedMethodCount = methods 表实际行数");
    for (const [storedKey, table] of [
      ["storedClassCount", "classes"],
      ["storedMethodCount", "methods"],
      ["storedFieldCount", "fields"],
    ]) {
      const actual = db.prepare(`SELECT count(*) AS c FROM ${table}`).get().c;
      assert.equal(Number(meta[storedKey]), actual, `${storedKey} must equal COUNT(*) of ${table}`);
    }
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
