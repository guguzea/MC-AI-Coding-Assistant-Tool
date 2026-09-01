import assert from "node:assert/strict";
import { test } from "node:test";
import { Readable } from "node:stream";
import {
  parseMojangProguard,
  lookupMojangMethod,
  remapDescriptor,
  emitTinyV2,
  tinyV2HasClasses,
} from "./parse-mojang-proguard.mjs";

const SAMPLE = [
  "net.minecraft.world.entity.Entity -> bfj:",
  "    net.minecraft.world.level.Level getLevel() -> dI",
  "    12:12:net.minecraft.world.phys.Vec3 getDeltaMovement() -> dl",
  "    boolean isCrouching() -> bP",
  "    99:99:boolean isUnderWater() -> aZ",
  "net.minecraft.world.level.Level -> cmm:",
  "net.minecraft.world.phys.Vec3 -> eei:",
  "net.minecraft.world.entity.LivingEntity -> bfz:",
  "    1094:1094:float getHealth() -> er",
  "",
].join("\n");

test("parseMojangProguard maps obf methods to Mojang names", async () => {
  const maps = await parseMojangProguard(Readable.from([SAMPLE]));
  assert.equal(maps.obfToNamed.get("bfj"), "net/minecraft/world/entity/Entity");
  const level = lookupMojangMethod(maps, "bfj", "()Lcmm;", "dI");
  assert.ok(level);
  assert.equal(level.name, "getLevel");
  assert.equal(level.descriptor, "()Lnet/minecraft/world/level/Level;");

  const vel = lookupMojangMethod(maps, "bfj", "()Leei;", "dl");
  assert.equal(vel?.name, "getDeltaMovement");

  const health = lookupMojangMethod(maps, "bfz", "()F", "er");
  assert.equal(health?.name, "getHealth");
  assert.equal(health?.descriptor, "()F");
});

test("remapDescriptor rewrites class refs", () => {
  const map = new Map([
    ["cmm", "net/minecraft/world/level/Level"],
    ["eei", "net/minecraft/world/phys/Vec3"],
  ]);
  assert.equal(
    remapDescriptor("(Leei;Lcmm;)V", map),
    "(Lnet/minecraft/world/phys/Vec3;Lnet/minecraft/world/level/Level;)V",
  );
});

const INNER_SAMPLE = [
  "net.minecraft.world.entity.Entity -> bfj:",
  "    net.minecraft.world.level.Level getLevel() -> dI",
  "    12:12:net.minecraft.world.phys.Vec3 getDeltaMovement() -> dl",
  "    boolean isCrouching() -> bP",
  "    99:99:boolean isUnderWater() -> aZ",
  "    float health -> a",
  "    java.lang.String[] tags -> b",
  "    int[][] matrix -> c",
  "    1:8:void <init>() -> <init>",
  "    void <clinit>() -> <clinit>",
  "    net.minecraft.world.entity.Entity$Inner getInner() -> dJ",
  "net.minecraft.world.entity.Entity$Inner -> bfj$a:",
  "    int value -> d",
  "    2:4:void <init>(net.minecraft.world.entity.Entity) -> <init>",
  "net.minecraft.world.entity.Entity$1 -> bfj$1:",
  "net.minecraft.world.level.Level -> cmm:",
  "net.minecraft.world.phys.Vec3 -> eei:",
  "net.minecraft.world.entity.LivingEntity -> bfz:",
  "    1094:1094:float getHealth() -> er",
  "",
].join("\n");

test("parseMojangProguard maps inner classes, fields, constructors, arrays", async () => {
  const maps = await parseMojangProguard(INNER_SAMPLE);
  assert.equal(maps.obfToNamed.get("bfj"), "net/minecraft/world/entity/Entity");
  assert.equal(maps.obfToNamed.get("bfj$a"), "net/minecraft/world/entity/Entity$Inner");
  assert.equal(maps.obfToNamed.get("bfj$1"), "net/minecraft/world/entity/Entity$1");
  assert.equal(maps.namedToObf.get("net/minecraft/world/entity/Entity$Inner"), "bfj$a");

  const ctor = lookupMojangMethod(maps, "bfj", "()V", "<init>");
  assert.ok(ctor);
  assert.equal(ctor.name, "<init>");
  assert.equal(ctor.descriptor, "()V");

  const clinit = lookupMojangMethod(maps, "bfj", "()V", "<clinit>");
  assert.equal(clinit?.name, "<clinit>");

  const innerCtor = lookupMojangMethod(maps, "bfj$a", "(Lbfj;)V", "<init>");
  assert.ok(innerCtor);
  assert.equal(innerCtor.name, "<init>");
  assert.equal(innerCtor.descriptor, "(Lnet/minecraft/world/entity/Entity;)V");

  const healthField = maps.fieldsByObf.get("bfj\tF\ta");
  assert.ok(healthField);
  assert.equal(healthField.name, "health");
  assert.equal(healthField.descriptor, "F");

  const tagsField = maps.fieldsByObf.get("bfj\t[Ljava/lang/String;\tb");
  assert.ok(tagsField);
  assert.equal(tagsField.name, "tags");
  assert.equal(tagsField.descriptor, "[Ljava/lang/String;");

  const matrixField = maps.fieldsByObf.get("bfj\t[[I\tc");
  assert.ok(matrixField);
  assert.equal(matrixField.name, "matrix");
  assert.equal(matrixField.descriptor, "[[I");

  const getInner = lookupMojangMethod(maps, "bfj", "()Lbfj$a;", "dJ");
  assert.equal(getInner?.name, "getInner");
  assert.equal(getInner?.descriptor, "()Lnet/minecraft/world/entity/Entity$Inner;");
});

test("emitTinyV2 is parseable Tiny v2 official/named and round-trips Entity anchors", async () => {
  const maps = await parseMojangProguard(INNER_SAMPLE);
  const tiny = emitTinyV2(maps);
  const lines = tiny.trimEnd().split("\n");
  assert.equal(lines[0], "tiny\t2\t0\tofficial\tnamed");

  const classes = new Map();
  let current = null;
  for (const line of lines.slice(1)) {
    if (line.startsWith("c\t")) {
      const [, obf, named] = line.split("\t");
      current = { obf, named, methods: [], fields: [] };
      classes.set(obf, current);
      continue;
    }
    assert.ok(current, `member line without class: ${line}`);
    if (line.startsWith("\tm\t")) {
      const parts = line.slice(1).split("\t");
      assert.equal(parts[0], "m");
      current.methods.push({ desc: parts[1], obf: parts[2], named: parts[3] });
    } else if (line.startsWith("\tf\t")) {
      const parts = line.slice(1).split("\t");
      assert.equal(parts[0], "f");
      current.fields.push({ desc: parts[1], obf: parts[2], named: parts[3] });
    } else {
      assert.fail(`unexpected tiny line: ${JSON.stringify(line)}`);
    }
  }

  const entity = classes.get("bfj");
  assert.ok(entity);
  assert.equal(entity.named, "net/minecraft/world/entity/Entity");
  assert.ok(entity.methods.some((m) => m.obf === "dI" && m.named === "getLevel" && m.desc === "()Lcmm;"));
  assert.ok(entity.methods.some((m) => m.named === "<init>" && m.desc === "()V"));
  assert.ok(entity.methods.some((m) => m.named === "<clinit>"));
  assert.ok(entity.fields.some((f) => f.named === "health" && f.desc === "F"));
  assert.ok(entity.fields.some((f) => f.named === "tags" && f.desc === "[Ljava/lang/String;"));
  assert.ok(entity.fields.some((f) => f.named === "matrix" && f.desc === "[[I"));

  const inner = classes.get("bfj$a");
  assert.equal(inner?.named, "net/minecraft/world/entity/Entity$Inner");
  assert.ok(inner.methods.some((m) => m.named === "<init>" && m.desc === "(Lbfj;)V"));

  const anon = classes.get("bfj$1");
  assert.equal(anon?.named, "net/minecraft/world/entity/Entity$1");

  const living = classes.get("bfz");
  assert.ok(living.methods.some((m) => m.named === "getHealth" && m.obf === "er" && m.desc === "()F"));
});

// ── emitTinyV2 回归锁：曾经对每个类全量重扫成员（≈5 万类 × 百万成员 → 永不返回）────

const ord = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** 直白实现（每类重扫），用作线性重写的等价性基准。 */
function emitTinyV2Naive(maps, fromNs = "official", toNs = "named") {
  const lines = [`tiny\t2\t0\t${fromNs}\t${toNs}`];
  const classes = [...maps.obfToNamed.entries()].sort((a, b) => ord(a[0], b[0]));
  for (const [obf, named] of classes) {
    lines.push(`c\t${obf}\t${named}`);
    const methods = [];
    for (const [key, val] of maps.methodsByObf) {
      const [owner, desc, obfName] = key.split("\t");
      if (owner !== obf) continue;
      methods.push({ desc, obfName, named: val.name });
    }
    methods.sort((a, b) => ord(a.obfName, b.obfName) || ord(a.desc, b.desc));
    for (const m of methods) lines.push(`\tm\t${m.desc}\t${m.obfName}\t${m.named}`);
    const fields = [];
    for (const [key, val] of maps.fieldsByObf) {
      const [owner, desc, obfName] = key.split("\t");
      if (owner !== obf) continue;
      fields.push({ desc, obfName, named: val.name });
    }
    fields.sort((a, b) => ord(a.obfName, b.obfName) || ord(a.desc, b.desc));
    for (const f of fields) lines.push(`\tf\t${f.desc}\t${f.obfName}\t${f.named}`);
  }
  return lines.join("\n") + "\n";
}

/** 合成一份 obf 名短且互不相同的映射（结构与真实 mojmap 同形）。 */
function synthMaps(classCount, methodsPerClass, fieldsPerClass) {
  const obfToNamed = new Map();
  const methodsByObf = new Map();
  const fieldsByObf = new Map();
  for (let c = 0; c < classCount; c++) {
    const obf = `c${String(c).padStart(5, "0")}`;
    obfToNamed.set(obf, `synth/pkg${c % 97}/Class${c}`);
    for (let m = 0; m < methodsPerClass; m++) {
      methodsByObf.set(`${obf}\t(I)V\tm${c}_${m}`, { name: `doThing${m}`, descriptor: "(I)V" });
    }
    for (let f = 0; f < fieldsPerClass; f++) {
      fieldsByObf.set(`${obf}\tI\tf${c}_${f}`, { name: `field${f}`, descriptor: "I" });
    }
  }
  return { obfToNamed, namedToObf: new Map(), methodsByObf, fieldsByObf };
}

test("emitTinyV2 matches a straightforward reference emitter byte-for-byte", async () => {
  const maps = await parseMojangProguard(INNER_SAMPLE);
  assert.equal(emitTinyV2(maps), emitTinyV2Naive(maps));
  assert.equal(emitTinyV2(maps, "official", "mojmap"), emitTinyV2Naive(maps, "official", "mojmap"));
  assert.equal(emitTinyV2(synthMaps(120, 6, 3)), emitTinyV2Naive(synthMaps(120, 6, 3)));
});

test("emitTinyV2 scales linearly (quadratic rescan would blow the budget)", () => {
  const maps = synthMaps(10_000, 20, 5); // 10k classes / 250k members
  const startedAt = Date.now();
  const tiny = emitTinyV2(maps);
  const elapsedMs = Date.now() - startedAt;
  const lines = tiny.trimEnd().split("\n");
  assert.equal(lines.length, 1 + 10_000 + 250_000, `line count: ${lines.length}`);
  // 线性实现约百毫秒级；每类重扫的旧实现是 ~2.5e9 次迭代（数十秒起），必然越界。
  assert.ok(elapsedMs < 5_000, `emitTinyV2 took ${elapsedMs}ms — 退化成每类全量重扫了`);
});

test("emitTinyV2 output is stable across calls (artifact must not churn)", () => {
  const maps = synthMaps(300, 4, 2);
  assert.equal(emitTinyV2(maps), emitTinyV2(maps));
});

test("tinyV2HasClasses rejects a header-only Tiny", () => {
  // 实测：这种文件让 tiny-remapper 退出码 0 并产出**仍然混淆**的 jar。
  assert.equal(tinyV2HasClasses("tiny\t2\t0\tofficial\tnamed\n"), false);
  assert.equal(tinyV2HasClasses("tiny\t2\t0\tofficial\tnamed\nc\ta\tFoo\n"), true);
  assert.equal(tinyV2HasClasses(""), false);
  assert.equal(tinyV2HasClasses(emitTinyV2(synthMaps(1, 1, 1))), true);
});
