/**
 * cli-parse 单测（不 spawn 全进程）
 */
import assert from "node:assert/strict";
import * as z from "zod";
import {
  applyPositionalCompat,
  coerceFlagValue,
  coerceFlags,
  extractGlobalFlags,
  isToolFailure,
  kebabToCamel,
  mapShortCommand,
  parseFlags,
  resolveFlagKey,
  schemaPropertyType,
  UnknownFlagError,
  zodToJsonSchema,
  DATA_DIR_TOOLS,
} from "./dist/cli-parse.js";

{
  const { flags, positional } = parseFlags(["--from", "mcp", "--to=mojang", "--name", "getHealth", "leftover"]);
  assert.equal(flags.from, "mcp");
  assert.equal(flags.to, "mojang");
  assert.equal(flags.name, "getHealth");
  assert.deepEqual(positional, ["leftover"]);
}

{
  const { flags, positional } = parseFlags(["--compact", "convert", "--from", "mcp"]);
  assert.equal(flags.compact, true);
  assert.equal(flags.from, "mcp");
  assert.deepEqual(positional, ["convert"]);
}

{
  const { flags } = parseFlags(["--tag", "a", "--tag", "b"]);
  assert.deepEqual(flags.tag, ["a", "b"]);
}

{
  assert.equal(kebabToCamel("dry-run"), "dryRun");
  assert.equal(kebabToCamel("class-name"), "className");
}

{
  const w = mapShortCommand("warmup");
  assert.equal(w.tool, "get_server_status");
  assert.equal(w.inject.warmup, true);
  const s = mapShortCommand("status");
  assert.equal(s.tool, "get_server_status");
  assert.deepEqual(s.inject, {});
  assert.equal(mapShortCommand("query").tool, "query_api");
  assert.equal(mapShortCommand("convert").tool, "convert_mapping");
  assert.equal(mapShortCommand("update").tool, "mc_skill_update");
}

{
  assert.equal(coerceFlagValue("TRUE", "boolean"), true);
  assert.equal(coerceFlagValue("false", "boolean"), false);
  assert.equal(coerceFlagValue("0", "boolean"), false);
  assert.equal(coerceFlagValue("yes", "boolean"), true);
  assert.equal(coerceFlagValue("", "number"), "");
  assert.equal(coerceFlagValue("12", "number"), 12);
  assert.equal(coerceFlagValue("123", "union"), "123");
  assert.deepEqual(coerceFlagValue("1, 120", "tuple", "number"), [1, 120]);
  assert.deepEqual(coerceFlagValue("1,120", "tuple", "number"), [1, 120]);
  assert.deepEqual(coerceFlagValue("[1,120]", "tuple", "number"), [1, 120]);
}

{
  const schema = z.object({
    dryRun: z.boolean().optional(),
    confirmed: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    lines: z.tuple([z.number(), z.number()]).optional(),
    className: z.string().optional(),
    count: z.union([z.string(), z.number()]).optional(),
  });
  const kebab = coerceFlags(
    { "dry-run": "false", confirm: true },
    schema,
    {},
  );
  assert.equal(kebab.dryRun, false);
  assert.equal(kebab.confirmed, true);

  const boolCase = coerceFlags({ dryRun: "TRUE" }, schema, {});
  assert.equal(boolCase.dryRun, true);

  const appended = coerceFlags({ tags: ["a", "b"] }, schema, {});
  assert.deepEqual(appended.tags, ["a", "b"]);

  const lines = coerceFlags({ lines: "1, 120" }, schema, {});
  assert.deepEqual(lines.lines, [1, 120]);

  const unionKeep = coerceFlags({ count: "123" }, schema, {});
  assert.equal(unionKeep.count, "123");
  assert.equal(schemaPropertyType(schema, "count"), "union");

  const convertLike = z.object({ memberName: z.string().optional() });
  assert.throws(() => coerceFlags({ "class-name": "Foo" }, convertLike, {}), (e) => {
    return e instanceof UnknownFlagError && /class-name|未知/.test(e.message);
  });

  const inject = coerceFlags({}, z.object({ warmup: z.boolean().optional() }), { warmup: true });
  assert.equal(inject.warmup, true);
  const userWins = coerceFlags({ warmup: "false" }, z.object({ warmup: z.boolean().optional() }), { warmup: true });
  assert.equal(userWins.warmup, false);
}

{
  const { globals, rest } = extractGlobalFlags(
    parseFlags(["--json", "--compact", "--fail-on-error", "--project", ".", "--from", "mcp"]).flags,
  );
  assert.equal(globals.json, true);
  assert.equal(globals.compact, true);
  assert.equal(globals.failOnError, true);
  assert.equal(globals.project, ".");
  assert.equal(rest.from, "mcp");
  assert.equal(rest.json, undefined);
}

{
  const pos = applyPositionalCompat("query", {}, ["net.minecraft.world.item.Item", "getName"]);
  assert.equal(pos.className, "net.minecraft.world.item.Item");
  assert.equal(pos.methodName, "getName");
}

{
  assert.equal(isToolFailure({ found: false }, false, false), false);
  assert.equal(isToolFailure({ found: false }, false, true), true);
  assert.equal(isToolFailure({ ok: false }, false, false), true);
  assert.equal(isToolFailure({ passed: false }, false, false), true);
  assert.equal(isToolFailure({ errors: ["x"] }, false, false), false);
  assert.equal(isToolFailure({ errors: ["x"] }, false, true), true);
  assert.equal(isToolFailure({ hello: 1 }, true, false), true);
  assert.equal(isToolFailure({ error: { code: "UNZIP_TOOL_MISSING" } }, false, false), true);
  assert.equal(isToolFailure({ found: false, action: { code: "NOT_FOUND" } }, false, false), false);
}

{
  assert.equal(isToolFailure({ status: "skipped", passed: null, ok: true }, false, false), false);
  assert.equal(isToolFailure({ passed: null }, false, false), false);
  assert.equal(isToolFailure({ passed: false }, false, false), true);
  assert.equal(isToolFailure({ error: { code: "X" } }, false, false), true);
}

{
  const keys = new Set(["crashReport", "memberName", "dryRun"]);
  assert.equal(resolveFlagKey("crashReport", keys), "crashReport");
  assert.equal(resolveFlagKey("crash-report", keys), "crashReport");
  assert.equal(resolveFlagKey("name", keys), "memberName");
  assert.equal(resolveFlagKey("dry-run", keys), "dryRun");
  assert.equal(resolveFlagKey("class-name", keys), undefined);
}

{
  const withDefault = zodToJsonSchema(z.object({ dryRun: z.boolean().optional().default(true) }));
  assert.equal(withDefault.properties.dryRun.default, true);
  const tup = zodToJsonSchema(z.tuple([z.number(), z.number()]));
  assert.equal(tup.type, "array");
  assert.equal(tup.minItems, 2);
  assert.equal(tup.maxItems, 2);
}

{
  assert.ok(DATA_DIR_TOOLS.has("query_loader_api"));
  assert.ok(DATA_DIR_TOOLS.has("search_loader_api"));
  assert.ok(DATA_DIR_TOOLS.has("query_api"));
}

{
  const { waveToolSchemas, ANALYZE_LOG_DESCRIPTION, READ_KNOWLEDGE_RESOURCE_DESCRIPTION } = await import(
    "./dist/wave/register.js"
  );
  const al = waveToolSchemas.find((t) => t.name === "analyze_log");
  const rk = waveToolSchemas.find((t) => t.name === "read_knowledge_resource");
  assert.equal(al?.description, ANALYZE_LOG_DESCRIPTION);
  assert.ok(String(al?.description ?? "").length > 0);
  assert.equal(rk?.description, READ_KNOWLEDGE_RESOURCE_DESCRIPTION);
  assert.ok(String(rk?.description ?? "").length > 0);
}

console.log("test-cli-parse: ok");
