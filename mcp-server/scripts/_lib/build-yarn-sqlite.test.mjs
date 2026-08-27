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
