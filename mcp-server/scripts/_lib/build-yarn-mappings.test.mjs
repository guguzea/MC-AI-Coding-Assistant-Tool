import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTinyToClassMap, renderYarnMappingJson } from "./build-yarn-mappings.mjs";

const SAMPLE = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "FIELD\ta\tLaA;\tb\tmcp_field_1\tSTATIC_F",
  "METHOD\ta\t()V\tnet/minecraft/class_3\tmcp_method_3\tdidFoo",
  "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
  "METHOD\tb\t(I)Z\tnet/minecraft/class_11\tmcp_method_4\tdidBar",
  "",
].join("\n");

test("parses class entries without members and counts METHODs", () => {
  const out = parseTinyToClassMap(SAMPLE);
  assert.equal(out.classCount, 2);
  assert.equal(out.methodCount, 2); // two METHOD rows
  const alpha = out.classMap["net/minecraft/Alpha"];
  assert.equal(alpha.officialClass, "a");
  assert.equal(alpha.intermediaryClass, "net/minecraft/class_1");
  assert.equal(alpha.namedClass, "net/minecraft/Alpha");
  // Legacy shape intentionally omits per-class methods/fields; only metadata.
  assert.deepEqual(Object.keys(alpha), ["officialClass", "intermediaryClass", "namedClass"]);
});

test("renders legacy yarn-mappings.json", () => {
  const out = parseTinyToClassMap(SAMPLE);
  const json = renderYarnMappingJson(out, {
    version: "1.21.1+build.3",
    source: "https://maven.fabricmc.net/.../yarn-1.21.1+build.3.jar",
    format: "yarn-tiny-v1",
  });
  const parsed = JSON.parse(json);
  assert.equal(parsed.version, "1.21.1+build.3");
  assert.equal(parsed.classCount, 2);
  assert.equal(parsed.methodCount, 2);
  assert.equal(parsed.classMap["net/minecraft/Alpha"].intermediaryClass, "net/minecraft/class_1");
});
