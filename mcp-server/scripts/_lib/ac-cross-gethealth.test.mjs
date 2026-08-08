/**
 * A/C cross-check: parchment-extractor merge parseTiny vs build-yarn-sqlite parseTiny
 * must agree on LivingEntity.getHealth fields for 1.20.1.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { findTinyPath, findNamedMethod, parseTiny } from "./parse-tiny.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataRoot = path.resolve(__dirname, "..", "..", "..", "data");

test("A/C cross-check getHealth owner/official/descriptor", async () => {
  const mappings = path.join(dataRoot, "fabric_1.20.1", "mappings");
  const tiny = findTinyPath(mappings);
  assert.ok(tiny, "fabric_1.20.1 tiny required");

  const parsed = await parseTiny(tiny.path, { strict: false });
  const fromParse = findNamedMethod(parsed, "getHealth", "LivingEntity");
  assert.ok(fromParse, "parse-tiny must find getHealth");

  const dbPath = path.join(mappings, "yarn-mappings.sqlite");
  assert.ok(fs.existsSync(dbPath), "sqlite must exist");
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const row = db
      .prepare(
        `SELECT owner_named, name_named, name_official, descriptor_named, name_intermediary
         FROM methods WHERE name_named = ? AND owner_named LIKE ? LIMIT 1`,
      )
      .get("getHealth", "%LivingEntity%");
    assert.ok(row, "sqlite methods must contain getHealth");
    assert.equal(row.owner_named, fromParse.ownerNamed);
    assert.equal(row.name_official, fromParse.nameOfficial);
    assert.equal(row.descriptor_named, fromParse.descriptorNamed);
    assert.equal(row.name_named, fromParse.nameNamed);
  } finally {
    db.close();
  }

  const supplement = path.join(
    dataRoot,
    "forge_1.20.1",
    "extracted",
    "yarn-supplement-getHealth.json",
  );
  if (fs.existsSync(supplement)) {
    const sideA = JSON.parse(fs.readFileSync(supplement, "utf8"));
    assert.equal(sideA.nameOfficial, fromParse.nameOfficial);
    assert.equal(sideA.descriptor, fromParse.descriptorNamed);
    assert.equal(sideA.ownerOfficial, fromParse.ownerOfficial);
  }
});
