/**
 * Direct (in-process) audit of MCP tool handlers. No stdio framing.
 * Read-only product audit — writes _audit-findings.json
 */
import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// 仓库根（本文件在 mcp-server/scripts/）：data/ 与 community_knowledge/ 都在根上。
// 写成 join(__dirname,"..") 会指到 mcp-server/，于是 MC_SKILL_DATA 与 scaffold
// fixture 双双指向不存在的目录，而断言只是「查不到就算过」——整段静默空转。
const REPO = join(__dirname, "..", "..");
process.env.MC_SKILL_DATA ??= join(REPO, "data");
process.env.MC_SKILL_COMMUNITY ??= join(REPO, "community_knowledge");

const findings = [];
const note = (sev, tool, msg, detail) => findings.push({ sev, tool, msg, detail });

function safe(obj, n = 400) {
  try {
    const s = JSON.stringify(obj);
    return s.length > n ? s.slice(0, n) + "…" : obj;
  } catch {
    return String(obj);
  }
}

function unwrap(r) {
  if (r && Array.isArray(r.content) && r.content[0]?.text) {
    try {
      return JSON.parse(r.content[0].text);
    } catch {
      return { _raw: r.content[0].text };
    }
  }
  return r;
}

async function main() {
  console.error("[audit] start");
  const docs = await import("../dist/docs-platform/index.js");
  const { queryApi } = await import("../dist/api/index.js");
  const { convertMapping, getMethodParams } = await import("../dist/mappings/index.js");
  const { getVersionInfo } = await import("../dist/version/index.js");
  const { diagnoseGradle } = await import("../dist/gradle/index.js");
  const { generateDatagen } = await import("../dist/datagen/index.js");
  const { analyzeCrash } = await import("../dist/crash/index.js");
  const { validateProject } = await import("../dist/validate/index.js");
  const { diagnoseDataPaths } = await import("../dist/utils/path.js");
  const { analyzePortingPath, portProject } = await import("../dist/porting/index.js");

  const step = (s) => console.error("[audit]", s);

  note("info", "audit", "env", {
    DATA: process.env.MC_SKILL_DATA,
    COMMUNITY: process.env.MC_SKILL_COMMUNITY,
  });

  // Community
  step("community");
  let r = unwrap(await docs.listCommunitySources());
  if ((r.byKind?.unknown ?? 0) > 0) note("warn", "list_community_sources", "unknown kind", r.byKind);
  note("info", "list_community_sources", "ok", { total: r.total, byKind: r.byKind });

  r = unwrap(await docs.searchCommunityDocs({ query: "" }));
  if (r.total !== 0) note("warn", "search_community_docs", "empty query returns hits", r.total);

  r = unwrap(await docs.searchCommunityDocs({ query: "asdfghjkl-no-hit-xyz" }));
  if (r.total !== 0) note("warn", "search_community_docs", "garbage hits", r);

  try {
    await docs.getCommunityDocFull({ id: "nope" });
    note("warn", "get_community_doc_full", "missing id should throw");
  } catch (e) {
    note("info", "get_community_doc_full", "missing id throws Error (MCP wraps as plain 错误 text)", String(e.message || e));
  }

  r = unwrap(await docs.getCommunityDocFull({ id: "links/mcmod-6071-forge-engineering" }));
  if (!r.linkOnly || r.content) note("error", "get_community_doc_full", "links leak", safe(r));

  r = unwrap(await docs.getCommunityDocFull({ id: "authored/machine-be-gui-working" }));
  if (r.content?.startsWith("\r")) note("warn", "get_community_doc_full", "leading CR remains", r.content.slice(0, 20));

  // Forge docs
  step("forge docs");
  r = unwrap(await docs.listForgeVersions());
  const forgeVers = r.versions ?? r;
  if (!Array.isArray(forgeVers) || !forgeVers.length) note("error", "list_forge_versions", "empty", r);

  r = unwrap(await docs.searchForgeDocs({ query: "DeferredRegister", version: "1.20.1" }));
  if (!(r.total > 0)) note("warn", "search_forge_docs", "DeferredRegister no hits", safe(r));

  try {
    r = unwrap(await docs.searchForgeDocs({ query: "constructor", version: "1.12.2" }));
    if (!Array.isArray(r.results) && r.error) note("error", "search_forge_docs", "constructor query failed", safe(r));
    else note("info", "search_forge_docs", "constructor query ok", { total: r.total, semantic: r.semantic });
  } catch (e) {
    note("error", "search_forge_docs", "constructor must not throw (Object.prototype)", String(e.message || e));
  }

  r = unwrap(await docs.searchForgeDocs({ query: "registry", version: "9.9.9" }));
  const used = r.results?.[0]?.version;
  if (r.error) {
    note("info", "search_forge_docs", "invalid version returns error object", safe(r));
  } else if (used && used !== "9.9.9" && !r.fallback && !r.warning && !r.resolvedVersion) {
    note("warn", "search_forge_docs", "invalid version silent fallback, no warning field", {
      requested: "9.9.9",
      used,
      keys: Object.keys(r),
    });
  }

  r = unwrap(await docs.searchForgeDocs({ query: "registry", version: "1.20.1" }));
  if (r.results?.[0] && /datapackregistries/i.test(r.results[0].id)) {
    note("warn", "search_forge_docs", "registry ranks datagen first", r.results[0]);
  }

  const fid = "1.20.1/concepts_registries";
  r = unwrap(await docs.getForgeDocSummary({ id: fid, version: "1.20.1" }));
  if (!r.label && r.error) note("error", "get_forge_doc_summary", "fail", safe(r));
  r = unwrap(await docs.getForgeDocFull({ id: fid, version: "1.20.1" }));
  if (!r.content) note("warn", "get_forge_doc_full", "no content", Object.keys(r));
  r = unwrap(await docs.getForgeDocRelated({ id: fid, version: "1.20.1" }));

  // Fabric
  step("fabric docs");
  r = unwrap(await docs.listFabricVersions());
  r = unwrap(await docs.searchFabricDocs({ query: "item", version: "1.20.1" }));
  if (!(r.total > 0 || r.results?.length)) note("warn", "search_fabric_docs", "empty", safe(r));
  const fabHit = r.results?.[0];
  if (fabHit?.id) {
    // 1.20.1 等档的 fabric-docs 是空树，search 兜底到 fabric-wiki；取正文必须回填该 source
    if (!fabHit.source) note("warn", "search_fabric_docs", "results[].source missing → get_* handoff unusable", safe(fabHit));
    const fabSrc = fabHit.source ?? "fabric-docs";
    const fabId = fabHit.id;
    const sum = unwrap(await docs.getFabricDocSummary({ id: fabId, version: "1.20.1", source: fabSrc }));
    if (!sum.firstParagraph && !sum.sections?.length) {
      note("warn", "get_fabric_doc_summary", "search id not resolvable via summary", safe(sum));
    }
    const full = unwrap(await docs.getFabricDocFull({ id: fabId, version: "1.20.1", source: fabSrc }));
    if (!full.content && full.error) {
      note("warn", "get_fabric_doc_full", "search id not resolvable via full", safe(full));
    }
    unwrap(await docs.getFabricDocRelated({ id: fabId, version: "1.20.1", source: fabSrc }));
  }

  // NeoForge
  step("neoforge docs");
  r = unwrap(await docs.listNeoForgeVersions());
  r = unwrap(await docs.searchNeoForgeDocs({ query: "event", version: "1.20.1" }));
  if (!(r.forgeCompatible || r.total > 0 || r.results?.length)) {
    note("warn", "search_neoforge_docs", "1.20.1 unexpected", safe(r));
  } else {
    note("info", "search_neoforge_docs", "1.20.1", { forgeCompatible: r.forgeCompatible, total: r.total });
  }
  r = unwrap(await docs.searchNeoForgeDocs({ query: "registry", version: "1.20.4" }));
  if (!(r.total > 0 || r.results?.length)) note("warn", "search_neoforge_docs", "1.20.4 empty", safe(r));
  const neoId = r.results?.[0]?.id;
  if (neoId) {
    unwrap(await docs.getNeoForgeDocSummary({ id: neoId, version: "1.20.4" }));
    unwrap(await docs.getNeoForgeDocFull({ id: neoId, version: "1.20.4" }));
    unwrap(await docs.getNeoForgeDocRelated({ id: neoId, version: "1.20.4" }));
  }

  // Generic
  step("generic docs");
  unwrap(await docs.listVersions({ platform: "forge" }));
  r = unwrap(await docs.searchDocs({ query: "registry", version: "1.20.1", platform: "forge" }));
  if (!(r.total > 0)) note("warn", "search_docs", "empty", safe(r));
  unwrap(await docs.getDocSummary({ id: fid, version: "1.20.1", platform: "forge" }));
  unwrap(await docs.getDocFull({ id: fid, version: "1.20.1", platform: "forge" }));
  unwrap(await docs.getDocRelated({ id: fid, version: "1.20.1", platform: "forge" }));

  // API
  step("query_api");
  r = await queryApi({ className: "net.minecraft.world.entity.LivingEntity", methodName: "getMaxHealth", version: "1.20.1" });
  if (!r.found) note("error", "query_api", "LivingEntity missing", safe(r));

  r = await queryApi({ className: "net.minecraftforge.registries.DeferredRegister", version: "1.20.1" });
  if (r.found) note("info", "query_api", "found Forge class unexpectedly", safe(r));
  else {
    const blob = JSON.stringify(r.notes ?? r.suggestions ?? r);
    if (!/forge|Forge|Parchment/i.test(blob)) note("warn", "query_api", "Forge miss without clear note", safe(r));
  }

  r = await queryApi({ className: "net.minecraft.world.level.block.entity.Blck", version: "1.20.1" });
  if (Array.isArray(r.suggestions) && r.suggestions.length <= 1 && /未找到/.test(String(r.suggestions[0]))) {
    note("warn", "query_api", "typo Blck: no fuzzy class candidates", r.suggestions);
  }

  step("get_method_params");
  r = getMethodParams({ className: "net.minecraft.world.entity.LivingEntity", methodName: "hurt", version: "1.20.1" });
  note("info", "get_method_params", "hurt", safe(r));

  step("convert_mapping");
  r = convertMapping({
    from: "yarn",
    to: "mojang",
    memberName: "net/minecraft/block/Block",
    version: "1.20.1",
  });
  if (r.converted === "cpn") {
    note("warn", "convert_mapping", "yarn→mojang returns official/obfuscated short name, not named Mojang FQCN", {
      converted: r.converted,
      notes: r.notes,
    });
  }

  r = convertMapping({
    from: "mojang",
    to: "yarn",
    memberName: "net.minecraft.world.level.block.Block",
    version: "1.20.1",
  });
  if (!r.found) note("error", "convert_mapping", "mojang→yarn fail", safe(r));

  r = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.world.entity.LivingEntity",
    version: "1.20.1",
  });
  if (!r.found || !r.converted || r.converted === "getHealth") {
    note("error", "convert_mapping", "mcp→mojang getHealth must return official short name", safe(r));
  } else {
    note("info", "convert_mapping", "mcp→mojang getHealth", safe(r));
  }

  note("warn", "convert_mapping", "semantic asymmetry: enum 'mojang' means named when FROM, official/obf when TO", {
    evidence: "yarn→mojang=cpn vs mojang→yarn accepts net.minecraft.world.level.block.Block",
  });

  // version（getVersionInfo 是 async 导出：漏 await 时 r 是 Promise，
  // 「weak」恒报、「constructor」恒误报 ERROR，另两条检查则永远看不到值）
  step("get_version_info");
  r = await getVersionInfo({ version: "1.20.1", action: "注册方块", platform: "forge" });
  if (!r.recommendation) note("warn", "get_version_info", "weak", safe(r));
  r = await getVersionInfo({ version: "99.0", action: "注册方块", platform: "forge" });
  if (r.recommendation && !r.error && !r.unknown) {
    note("warn", "get_version_info", "unknown MC version still recommends without error flag", safe(r));
  }
  r = await getVersionInfo({ version: "constructor", action: "register", platform: "forge" });
  if (r.forgeVersion !== "unknown" || typeof r.recommendation !== "string" || /undefined。注册流程/.test(r.recommendation)) {
    note("error", "get_version_info", "constructor must not hit Object.prototype", safe(r));
  }
  r = await getVersionInfo({ version: "1.12.2", action: "register", platform: "forge" });
  if (/创建 DeferredRegister/.test(r.recommendation || "")) {
    note("error", "get_version_info", "1.12.2 register must not append DeferredRegister flow", safe(r));
  }

  // crash
  step("crash_analyze");
  r = analyzeCrash({
    version: "1.20.1",
    crashReport:
      "---- Minecraft Crash Report ----\nFile: crash-2024-01-01_12.00.00-fml.txt\nMissing or unsupported mandatory dependencies: foo\n",
  });
  if (r.crashKind !== "fml") note("warn", "crash_analyze", "expected fml", safe(r));

  r = analyzeCrash({
    version: "1.20.1",
    crashReport:
      '---- Minecraft Crash Report ----\njava.lang.NullPointerException: Cannot invoke "net.minecraft.world.level.block.entity.BlockEntity.getBlockState()" because "be" is null\n',
  });
  if (/world 为 null/.test(r.probableCause || "")) {
    note("error", "crash_analyze", "BE-null misdiagnosed as world null", r.probableCause);
  } else if (!/引用为 null|未取到 BE/.test(r.probableCause || "")) {
    note("warn", "crash_analyze", "BE-null unexpected cause", r.probableCause);
  } else {
    note("info", "crash_analyze", "BE-null ok", r.probableCause);
  }

  r = analyzeCrash({ crashReport: "hello world", version: "1.20.1" });
  note("info", "crash_analyze", "garbage input", safe(r));

  // gradle
  step("diagnose_gradle");
  r = diagnoseGradle({ buildGradle: "plugins {}", gradleProperties: "" });
  if (!r.errors?.length) note("warn", "diagnose_gradle", "empty project no errors", safe(r));

  r = diagnoseGradle({
    buildGradle: `plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
minecraft { mappings channel: 'official', version: '1.20.1' }
dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }`,
    gradleProperties: "minecraft_version=1.19.2\nforge_version=43.2.0\n",
  });
  const joined = JSON.stringify(r);
  if (!/1\.19|不一致|不匹配|mismatch|冲突/i.test(joined)) {
    note("warn", "diagnose_gradle", "does not detect gradle.properties vs build.gradle version mismatch", safe(r));
  }

  // datagen
  step("generate_datagen");
  r = generateDatagen({ providerType: "recipe", modId: "TestMod", targetName: "My-Block", version: "1.20.1", platform: "forge" });
  const code = r.code ?? r.content ?? JSON.stringify(r);
  if (/TestMod/.test(code) || /My-Block/.test(code)) {
    note("warn", "generate_datagen", "accepts invalid modId (uppercase) and registry name with hyphen", {
      snippet: String(code).slice(0, 280),
    });
  }
  note("info", "generate_datagen", "keys", Object.keys(r));

  // validate
  step("validate_project");
  r = validateProject({
    modsToml: 'modLoader="javafml"\n[[mods]]\nmodId="ExampleMod"\n',
    javaFiles: [{ path: "src/main/java/A.java", content: '@Mod("examplemod")\npublic class A {}' }],
  });
  const hasIssue =
    (r.errors?.length ?? 0) > 0 ||
    (r.issues?.length ?? 0) > 0 ||
    (r.warnings?.length ?? 0) > 0 ||
    (r.problems?.length ?? 0) > 0;
  if (!hasIssue) {
    note("warn", "validate_project", "ExampleMod vs examplemod case mismatch not flagged", safe(r));
  } else {
    note("info", "validate_project", "flagged case mismatch", safe(r));
  }

  // diagnose paths
  step("diagnose_data_paths");
  r = diagnoseDataPaths();
  if (r.community?.status !== "found") note("error", "diagnose_data_paths", "community", r.community);
  if (r.platforms?.fabric?.path && /fabric_1\.21/.test(r.platforms.fabric.path)) {
    note("info", "diagnose_data_paths", "fabric showcase path is newest 1.21.x (not wrong, but easy to misread as only version)", r.platforms.fabric);
  }

  // porting
  step("analyze_porting_path");
  // fixture 不存在 → 工具 ok:false → routeSteps 空 → 下面 4 条断言全部「查不到就算过」。
  // 空转必须是 ERROR，不能继续算通过。
  const scaffold = join(REPO, "forge", "1.20.1", "scaffold");
  if (!existsSync(scaffold)) {
    note("error", "audit-self", "porting fixture missing → porting checks are vacuous", { scaffold });
  }
  const analysisRaw = await analyzePortingPath({
    projectPath: scaffold,
    targetPlatform: "fabric",
    targetVersion: "1.20.1",
  });
  const analysis = typeof analysisRaw === "string" ? JSON.parse(analysisRaw) : unwrap(analysisRaw);
  if (analysis.ok === false) {
    note("error", "audit-self", "analyze_porting_path fixture failed → porting checks are vacuous", analysis.error);
  }
  const a = analysis.analysis ?? analysis;
  if (a?.target?.mappings === "mojmaps") {
    note("warn", "analyze_porting_path", "fabric target mappings default mojmaps; KB versions.json omits yarn for 1.20.1", a.target);
  }
  if (a?.current?.modId === "${mod_id}") {
    note("warn", "analyze_porting_path", "literal unresolved ${mod_id} from scaffold", a.current.modId);
  }
  if (!a?.current?.mcVersion) {
    note("warn", "analyze_porting_path", "scaffold mcVersion/platformVersion null (placeholders not resolved)", {
      mcVersion: a?.current?.mcVersion,
      platformVersion: a?.current?.platformVersion,
    });
  }
  const links = a?.referenceLinks ?? [];
  if (links.some((l) => /26\.1/i.test(`${l.title} ${l.url}`))) {
    note("warn", "analyze_porting_path", "referenceLinks include 26.1 while target is fabric 1.20.1", links.map((x) => x.title));
  }
  const steps = a?.routeSteps ?? [];
  // routeSteps 契约 = string[]。这里曾写 `typeof s === "string" ? s : s?.text ?? ""` 双形态兜底，
  // 正是它让「改成对象数组」的契约破坏静默通过；形状一变直接报 error。
  if (steps.some((s) => typeof s !== "string")) {
    note("error", "analyze_porting_path", "routeSteps must be string[] (contract drift)", steps);
  }
  if (a?.target?.platform === "fabric" && steps.some((s) => /验证.*neoforge|neoforge.*验证/i.test(String(s)))) {
    note("warn", "analyze_porting_path", "fabric target still instructs verify neoforge module", steps);
  }
  if (!Array.isArray(a?.nextSteps) || a.nextSteps.length !== steps.length) {
    note("error", "analyze_porting_path", "nextSteps 缺失或与 routeSteps 不平行", {
      nextSteps: a?.nextSteps,
      routeSteps: steps,
    });
  } else {
    for (const ns of a.nextSteps) {
      if (ns.tool && (typeof ns.args !== "object" || ns.args === null)) {
        note("error", "analyze_porting_path", `nextSteps.${ns.tool} 缺可调用 args`, ns);
      }
    }
  }

  step("port_project");
  const port = await portProject({
    projectPath: join(REPO, "tmp-should-not-write"),
    action: "init_architectury",
    dryRun: false,
    confirmed: true,
    modId: "sandboxmod",
  });
  const portObj = typeof port === "string" ? JSON.parse(port) : unwrap(port);
  if (portObj.ok !== false) note("error", "port_project", "write not blocked", safe(portObj));

  step("neoforge 26.1 sample");
  const neoSearch = unwrap(await docs.searchNeoForgeDocs({ query: "getting", version: "26.1" }));
  note("info", "search_neoforge_docs", "26.1", { total: neoSearch.total, first: neoSearch.results?.[0]?.id });

  step("community tokenizer");
  const tok = unwrap(await docs.searchCommunityDocs({ query: "漏斗管道Capability" }));
  if (tok.total === 0) {
    note("warn", "search_community_docs", "unsegmented Chinese+English query may miss (no tokenizer; needs spaces)", {
      query: "漏斗管道Capability",
      hint: "漏斗 / Capability separately would hit",
    });
  }

  const out = {
    toolSurface: 35,
    findingCount: findings.length,
    bySev: findings.reduce((acc, f) => {
      acc[f.sev] = (acc[f.sev] ?? 0) + 1;
      return acc;
    }, {}),
    findings,
  };
  writeFileSync(join(__dirname, "..", "_audit-findings.json"), JSON.stringify(out, null, 2), "utf8");
  console.log(JSON.stringify(out, null, 2));
  step("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
