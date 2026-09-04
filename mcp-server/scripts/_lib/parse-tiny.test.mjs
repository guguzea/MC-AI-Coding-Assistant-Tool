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

test("descriptorNamed remaps official class refs to named", async () => {
  const tiny = [
    "v1\tofficial\tintermediary\tnamed",
    "CLASS\tl\tnet/minecraft/class_l\tnet/minecraft/world/World",
    "CLASS\to\tnet/minecraft/class_o\tnet/minecraft/entity/Entity",
    "METHOD\to\t()Ll;\tdI\tmethod_1\tgetWorld",
    "",
  ].join("\n");
  const r = await parseTinyStream(Readable.from([tiny]));
  const m = findNamedMethod(r, "getWorld", "Entity");
  assert.ok(m);
  assert.equal(m.descriptorOfficial, "()Ll;");
  assert.equal(m.descriptorNamed, "()Lnet/minecraft/world/World;");
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

test("flat Tiny layout (all CLASS then METHOD) resolves ownerNamed by official", async () => {
  // Yarn 1.14–1.19 style: class block first, members later
  const tiny = [
    "v1\tofficial\tintermediary\tnamed",
    "CLASS\ta\tnet/minecraft/class_a\tnet/minecraft/entity/LivingEntity",
    "CLASS\tb\tnet/minecraft/class_b\tnet/minecraft/util/LastClass",
    "FIELD\ta\tF\th\tfield_1\thealth",
    "METHOD\ta\t()F\ter\tmethod_6032\tgetHealth",
    "METHOD\tb\t()V\tx\tmethod_9\tdidLast",
    "",
  ].join("\n");
  const r = await parseTinyStream(Readable.from([tiny]));
  assert.equal(r.classes.length, 2);
  const gh = findNamedMethod(r, "getHealth", "LivingEntity");
  assert.ok(gh, "getHealth must belong to LivingEntity, not LastClass");
  assert.equal(gh.ownerNamed, "net/minecraft/entity/LivingEntity");
  assert.equal(gh.ownerOfficial, "a");
  const last = findNamedMethod(r, "didLast", "LastClass");
  assert.ok(last);
  assert.equal(last.ownerNamed, "net/minecraft/util/LastClass");
  const owners = new Set(r.methods.map((m) => m.ownerNamed));
  assert.equal(owners.size, 2);
  assert.equal(r.fields[0].ownerNamed, "net/minecraft/entity/LivingEntity");
});

// N-7：共享解析器同样必须把「最后一列」当 named（这两行是从
// data/fabric_1.21.11/mappings/yarn-1.21.11+build.6-tiny.gz 第 2/3 行与
// methods 表 name_named=name_intermediary 样例逐字抄来的真实形状）。
test("6-column v1 rows: named = LAST column, not cols[4]", async () => {
  const tiny = [
    "v1\tofficial\tintermediary\tnamed",
    "CLASS\ta\tnet/minecraft/class_7833\tnet/minecraft/util/math/RotationAxis",
    "FIELD\ta\tLa;\ta\tfield_40713\tNEGATIVE_X",
    "METHOD\ta\t(F)Lorg/joml/Quaternionf;\ta\tmethod_46349\tmethod_46349",
    "",
  ].join("\n");
  const r = await parseTinyStream(Readable.from([tiny]));
  assert.equal(r.fields.length, 1);
  assert.equal(r.fields[0].nameOfficial, "a");
  assert.equal(r.fields[0].nameIntermediary, "field_40713");
  assert.equal(r.fields[0].nameNamed, "NEGATIVE_X", "named 必须是 cols[5]");
  assert.equal(r.methods[0].nameIntermediary, "method_46349");
  assert.equal(r.methods[0].nameNamed, "method_46349", "合法未映射：named 列重复 intermediary id");
});
