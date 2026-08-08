import assert from "node:assert/strict";
import { test } from "node:test";
import { Readable } from "node:stream";
import { parseTinyStream, parseTinyLine, findNamedMethod } from "./parse-tiny.mjs";

const SAMPLE_TINY = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/entity/LivingEntity",
  "METHOD\ta\t()F\ter\tmethod_6032\tgetHealth",
  "METHOD\ta\t(F)V\ta\tmethod_1\tsetHealth",
  "FIELD\ta\tF\ta\tfield_1\thealth",
  "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
  "METHOD\tb\t()V\tx\ty\tdidFoo",
  "",
].join("\n");

test("parseTinyStream extracts classes/methods/fields", async () => {
  const r = await parseTinyStream(Readable.from([SAMPLE_TINY]));
  assert.equal(r.classes.length, 2);
  assert.equal(r.methods.length, 3);
  assert.equal(r.fields.length, 1);
  const gh = findNamedMethod(r, "getHealth", "LivingEntity");
  assert.ok(gh);
  assert.equal(gh.nameOfficial, "er");
  assert.equal(gh.descriptorNamed, "()F");
  assert.equal(gh.ownerNamed, "net/minecraft/entity/LivingEntity");
});

test("strict:true throws on bad METHOD line", async () => {
  const bad = ["v1\tofficial\tintermediary\tnamed", "METHOD\tonly\ttwo", ""].join("\n");
  await assert.rejects(() => parseTinyStream(Readable.from([bad]), { strict: true }));
});

test("strict:false records warning on bad METHOD line", async () => {
  const bad = [
    "v1\tofficial\tintermediary\tnamed",
    "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/A",
    "METHOD\tonly\ttwo",
    "",
  ].join("\n");
  const r = await parseTinyStream(Readable.from([bad]), { strict: false });
  assert.ok(r.warnings.length >= 1);
  assert.equal(r.methods.length, 0);
});

test("parseTinyLine CLASS", () => {
  const r = parseTinyLine("CLASS\ta\tb\tc", null);
  assert.equal(r.kind, "class");
  assert.equal(r.value.named, "c");
});
