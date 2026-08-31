import assert from "node:assert/strict";
import { test } from "node:test";
import { Readable } from "node:stream";
import {
  parseMojangProguard,
  lookupMojangMethod,
  remapDescriptor,
  emitTinyV2,
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
