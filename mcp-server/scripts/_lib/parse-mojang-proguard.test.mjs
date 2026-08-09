import assert from "node:assert/strict";
import { test } from "node:test";
import { Readable } from "node:stream";
import {
  parseMojangProguard,
  lookupMojangMethod,
  remapDescriptor,
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
