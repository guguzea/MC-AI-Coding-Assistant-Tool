import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { importTsrgStream } from "./import-tsrg.mjs";
import { importForgeSrgStream } from "./import-forge-srg.mjs";
import { importMcpCsvMethods } from "./import-mcp-csv.mjs";
import { initYarnSchema, openYarnDb } from "./build-yarn-sqlite.mjs";

const SAMPLE_TSRG = [
  "a net/minecraft/entity/LivingEntity",
  "\ta ()F getHealth",
  "\tb (F)V setHealth",
  "\tc fieldHealth",
  "",
].join("\n");

const SAMPLE_SRG = [
  "CL: a net/minecraft/entity/LivingEntity",
  "MD: a/a ()F net/minecraft/entity/LivingEntity/getHealth ()F",
  "MD: a/b (F)V net/minecraft/entity/LivingEntity/setHealth (F)V",
  "",
].join("\n");

test("importTsrgStream methods", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tsrg-"));
  const db = openYarnDb(path.join(dir, "t.sqlite"));
  try {
    initYarnSchema(db);
    const r = await importTsrgStream(db, Readable.from([SAMPLE_TSRG]));
    assert.equal(r.classCount, 1);
    assert.equal(r.methodCount, 2);
    const row = db
      .prepare("SELECT name_official FROM methods WHERE name_named = ?")
      .get("getHealth");
    assert.equal(row.name_official, "a");
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("importForgeSrgStream methods", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "srg-"));
  const db = openYarnDb(path.join(dir, "t.sqlite"));
  try {
    initYarnSchema(db);
    const r = await importForgeSrgStream(db, Readable.from([SAMPLE_SRG]));
    assert.equal(r.classCount, 1);
    assert.equal(r.methodCount, 2);
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("importMcpCsvMethods + name index", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "csv-"));
  const csv = path.join(dir, "methods.csv");
  fs.writeFileSync(
    csv,
    "searge,name,side,desc\nfunc_110143_aJ,getHealth,2,\nfunc_1,foo,0,\n",
  );
  const db = openYarnDb(path.join(dir, "t.sqlite"));
  try {
    initYarnSchema(db);
    const r = importMcpCsvMethods(db, csv);
    assert.equal(r.methodCount, 2);
    const row = db
      .prepare("SELECT searge FROM searge_methods WHERE name_named = ?")
      .get("getHealth");
    assert.equal(row.searge, "func_110143_aJ");
  } finally {
    db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
