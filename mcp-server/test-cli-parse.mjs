/**
 * cli-parse 单测（不 spawn 全进程）
 */
import assert from "node:assert/strict";
import * as z from "zod";
import {
  AmbiguousFlagError,
  applyPositionalCompat,
  canonicalFlagName,
  coerceFlagValue,
  coerceFlags,
  extractGlobalFlags,
  FLAG_ALIASES,
  flagHelpPointer,
  flagKeyCandidates,
  isToolFailure,
  kebabToCamel,
  mapShortCommand,
  nearFlagNames,
  parseFlags,
  resolveFlagKey,
  schemaObjectShape,
  schemaPropertyType,
  UnknownFlagError,
  InvalidBooleanFlagError,
  zodToJsonSchema,
  DATA_DIR_TOOLS,
  unusedPositionals,
  POSITIONAL_COMMANDS,
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
  const t = parseFlags(["query", "-className", "Item", "--version", "1.20.1"]);
  assert.deepEqual(t.positional, ["query", "Item"]);
  assert.deepEqual(t.suspectFlags, ["className"]);
  assert.equal(t.flags.version, "1.20.1");
  assert.equal("className" in t.flags, false);

  assert.deepEqual(parseFlags(["convert", "-", "--from", "mcp"]).positional, ["convert", "-"]);
  assert.deepEqual(parseFlags(["convert", "-", "--from", "mcp"]).suspectFlags, []);
  assert.deepEqual(parseFlags(["warmup", "-1"]).positional, ["warmup", "-1"]);
  assert.deepEqual(parseFlags(["warmup", "-1"]).suspectFlags, []);
  const escaped = parseFlags(["query", "--", "-className", "Item"]);
  assert.deepEqual(escaped.positional, ["query", "-className", "Item"]);
  assert.deepEqual(escaped.suspectFlags, []);

  const noSwallow = parseFlags(["--className", "-Item"]);
  assert.equal(noSwallow.flags.className, true);
  assert.deepEqual(noSwallow.suspectFlags, ["Item"]);

  assert.equal(new UnknownFlagError("className").message, "未知参数 --className");
  const suggested = new UnknownFlagError("className", "-className");
  assert.match(suggested.message, /未知参数 -className/);
  assert.match(suggested.message, /请改用 --className/);
}

{
  const { flags, positional } = parseFlags(["--tag", "a", "--tag", "b"]);
  assert.deepEqual(flags.tag, ["a", "b"]);
}

{
  const { flags, positional } = parseFlags(["--limit", "-1", "search_docs"]);
  assert.equal(flags.limit, "-1");
  assert.deepEqual(positional, ["search_docs"]);
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
  assert.throws(() => coerceFlagValue("junk", "boolean"), (e) => e instanceof InvalidBooleanFlagError);
  assert.throws(
    () => extractGlobalFlags(parseFlags(["--json=junk"]).flags),
    (e) => e instanceof InvalidBooleanFlagError,
  );
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
  const { globals } = extractGlobalFlags(
    parseFlags(["--json=false", "--compact=false", "--fail-on-error=false"]).flags,
  );
  assert.equal(globals.json, false);
  assert.equal(globals.compact, false);
  assert.equal(globals.failOnError, false);
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
  assert.equal(isToolFailure({ found: false, error: { code: "INDEX_CORRUPT" } }, false, false), true);
}

{
  const dash = parseFlags(["query", "--", "--className", "Item"]);
  assert.deepEqual(dash.positional, ["query", "--className", "Item"]);
}

{
  const w = applyPositionalCompat("warmup", {}, ["1.20.1"]);
  assert.equal(w.version, "1.20.1");
  const st = applyPositionalCompat("get_server_status", {}, ["1.21.1"]);
  assert.equal(st.version, "1.21.1");
  assert.ok(POSITIONAL_COMMANDS.has("warmup"));
  assert.ok(POSITIONAL_COMMANDS.has("status"));
  assert.ok(POSITIONAL_COMMANDS.has("get_server_status"));
  assert.deepEqual(unusedPositionals("query", ["Item", "getName", "extra"]), ["extra"]);
  assert.deepEqual(unusedPositionals("warmup", ["1.20.1", "nope"]), ["nope"]);
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

{
  const { getMethodParamsSchema, convertMappingSchema } = await import("./dist/tool-registry.js");
  const methodJson = zodToJsonSchema(getMethodParamsSchema);
  const mappingJson = zodToJsonSchema(convertMappingSchema);
  assert.ok((methodJson.required ?? []).includes("version"), JSON.stringify(methodJson.required));
  assert.ok((mappingJson.required ?? []).includes("version"), JSON.stringify(mappingJson.required));
}

// ── S2: 归一化 flag 匹配 + 未知参数纠错 ─────────────────────────────────────
{
  assert.equal(canonicalFlagName("allow-fallback"), "allowfallback");
  assert.equal(canonicalFlagName("allowFallback"), "allowfallback");
  assert.equal(canonicalFlagName("allow_fallback"), "allowfallback");
  assert.equal(canonicalFlagName("ALLOW-Fallback"), "allowfallback");
  assert.equal(canonicalFlagName("dryRun"), "dryrun");
}

{
  const snake = new Set(["from", "to", "memberName", "allow_fallback"]);
  // 纯分隔符/大小写差异由回退接管（这两条曾经靠 FLAG_ALIASES 里的 allow-fallback / allowFallback）
  assert.equal(resolveFlagKey("allow-fallback", snake), "allow_fallback");
  assert.equal(resolveFlagKey("allowFallback", snake), "allow_fallback");
  assert.equal(resolveFlagKey("ALLOW_FALLBACK", snake), "allow_fallback");
  assert.equal(resolveFlagKey("allow_fallback", snake), "allow_fallback");
  assert.equal(resolveFlagKey("highlight-key", snake), undefined);
  // exact 先于回退，双拼写并存的 schema 不会因归一化而自相歧义
  assert.equal(resolveFlagKey("dryRun", new Set(["dryRun", "dry_run"])), "dryRun");
  assert.equal(resolveFlagKey("dry_run", new Set(["dryRun", "dry_run"])), "dry_run");
  // 语义改名 alias 优先于归一化回退（否则 class 会撞上 className/class_name 歧义）
  assert.equal(resolveFlagKey("class", new Set(["className", "class_name"])), "className");
  assert.equal(resolveFlagKey("name", new Set(["memberName", "crashReport"])), "memberName");
  assert.equal(resolveFlagKey("dry-run", new Set(["dryRun"])), "dryRun");
}

{
  const both = new Set(["foo_bar", "fooBar", "version"]);
  assert.deepEqual(flagKeyCandidates("foo-bar", both), ["fooBar", "foo_bar"]);
  // kebabToCamel 先命中，故双拼写并存时 --foo-bar 明确取 camel 写法，不进歧义分支
  assert.equal(resolveFlagKey("foo-bar", both), "fooBar");
  assert.throws(
    () => resolveFlagKey("FOO-BAR", both),
    (err) =>
      err instanceof AmbiguousFlagError &&
      err.candidates.length === 2 &&
      /歧义/.test(err.message) &&
      /--fooBar/.test(err.message) &&
      /--foo_bar/.test(err.message),
  );
  assert.deepEqual(flagKeyCandidates("version", both), ["version"]);
  assert.equal(resolveFlagKey("none-of-these", both), undefined);
}

{
  const known = ["className", "memberName", "methodName", "version", "dryRun"];
  assert.deepEqual(nearFlagNames("classNam", known), ["className"]);
  assert.deepEqual(nearFlagNames("versoin", known), ["version"]);
  assert.deepEqual(nearFlagNames("xyz", known), []);
  assert.deepEqual(nearFlagNames("af", ["ae", "ab", "ac", "ad"]), ["ab", "ac", "ad"]);
}

{
  assert.equal(flagHelpPointer("query_api"), "查看全部参数：node mcp-server/dist/cli.js query_api --help");
  const plain = new UnknownFlagError("className");
  assert.equal(plain.message, "未知参数 --className");
  const withTool = new UnknownFlagError("xyzz", undefined, { tool: "search_docs", knownFlags: ["query", "version"] });
  assert.match(withTool.message, /^未知参数 --xyzz；/);
  assert.match(withTool.message, /node mcp-server\/dist\/cli\.js search_docs --help/);
  assert.deepEqual(withTool.nearFlags, []);
  assert.deepEqual(withTool.knownFlags, ["query", "version"]);
  const withNear = new UnknownFlagError("classNam", undefined, { knownFlags: ["className", "version"] });
  assert.deepEqual(withNear.nearFlags, ["className"]);
  assert.match(withNear.message, /近似：--className/);
  assert.equal("tool" in withNear, false);
}

{
  const { listAllToolSchemas } = await import("./dist/tool-registry.js");
  const all = listAllToolSchemas();
  const convertMapping = all.find((t) => t.name === "convert_mapping");
  const forgeDoc = all.find((t) => t.name === "get_forge_doc_full");
  assert.deepEqual(coerceFlags({ "allow-fallback": "true" }, convertMapping.inputSchema), { allow_fallback: true });
  assert.deepEqual(coerceFlags({ allowFallback: true }, convertMapping.inputSchema), { allow_fallback: true });
  assert.deepEqual(coerceFlags({ "highlight-key": "true" }, forgeDoc.inputSchema), { highlight_key: true });
  assert.deepEqual(coerceFlags({ highlightKey: true }, forgeDoc.inputSchema), { highlight_key: true });
}

{
  // 新回退规则的安全性证明：全部 schema 内 canonical 形式必须两两不撞，
  // 且每个既有 key 仍能原样解析回自己（回永不把已能用的写法变成歧义）。
  const { listAllToolSchemas } = await import("./dist/tool-registry.js");
  const all = listAllToolSchemas();
  assert.ok(all.length >= 80, `registry shrank to ${all.length}`);
  let keyTotal = 0;
  const distinct = new Set();
  for (const t of all) {
    const names = Object.keys(schemaObjectShape(t.inputSchema) ?? {});
    keyTotal += names.length;
    for (const n of names) distinct.add(n);
    const groups = new Map();
    for (const n of names) groups.set(canonicalFlagName(n), [...(groups.get(canonicalFlagName(n)) ?? []), n]);
    for (const [c, ns] of groups) {
      assert.equal(ns.length, 1, `canonical collision in ${t.name}: ${c} <- ${ns.join(", ")}`);
    }
    const keys = new Set(names);
    for (const n of names) {
      assert.equal(n.includes("-"), false, `${t.name}.${n} contains a hyphen`);
      assert.equal(resolveFlagKey(n, keys), n, `${t.name}.${n} no longer resolves to itself`);
    }
  }
  assert.ok(keyTotal >= 300, `unexpectedly few schema keys: ${keyTotal}`);
  assert.ok(distinct.size >= 100, `unexpectedly few distinct keys: ${distinct.size}`);
}

{
  // 禁止再往 alias 表塞 S2 回退已覆盖的那一类（目标是 snake_case = 只差分隔符/大小写）
  const redundant = Object.entries(FLAG_ALIASES).filter(([, to]) => to.includes("_"));
  assert.deepEqual(redundant, [], `snake_case alias targets belong to canonical fallback: ${JSON.stringify(redundant)}`);
}

console.log("test-cli-parse: ok");
