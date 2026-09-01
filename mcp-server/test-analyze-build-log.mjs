/**
 * analyze_build_log 回归：真实 javac/Gradle 输出形状 + 建议参数可调用性 + 截断诚实性。
 *
 * 三条曾经真实存在的缺陷：
 *  - javac 把 symbol:/location: 印在错误头行之后的**缩进续行**里，只看头行永远取不到
 *    符号名 → 旧代码把占位符 "unknown"/"type" 当查询词发给 search_*_docs。
 *  - 文件:行号正则的字符类不含 `:` → `C:\Users\me\Foo.java:42` 被切成 `/Users/me/Foo.java`，
 *    盘符丢失，下游按这个路径打不开文件。
 *  - 所有 search_*_docs 的 version 都是必填；旧建议在缺版本时硬塞 "1.21.1"，等于编造用户
 *    没说过的版本（并且 Quilt 被路由到 Fabric 文档集）。
 */
import assert from "node:assert/strict";
import { analyzeBuildLog } from "./dist/build-log/index.js";

const LOG_MAX = 2 * 1024 * 1024;

/** 真实 javac 块：Windows 反斜杠路径 + 源码行 + `^` + 缩进续行。 */
const JAVAC_BLOCK = [
  "> Task :compileJava FAILED",
  'H:\\demo\\src\\main\\java\\com\\example\\DemoMod.java:42: error: cannot find symbol',
  "    Registry.register(FMLRegistries.BLOCK, id);",
  "                              ^",
  "  symbol:   variable FMLRegistries",
  "  location: class DemoMod",
  "1 error",
].join("\n");

const r = analyzeBuildLog({ logText: JAVAC_BLOCK, platform: "forge", minecraftVersion: "1.20.1" });
assert.equal(r.ok, true, JSON.stringify(r));
assert.equal(r.issueCount, 1, JSON.stringify(r.issues.map((i) => [i.kind, i.symbol])));
const sym = r.issues.find((i) => i.kind === "cannot_find_symbol");
assert.ok(sym, "未识别 cannot find symbol");
assert.equal(sym.symbol, "FMLRegistries", "symbol: 续行没读到（旧实现只会给出 undefined → 查询词 unknown）");
assert.equal(sym.location, "DemoMod", "location: 续行没读到");
assert.equal(sym.line, 42);
assert.equal(
  sym.file,
  "H:/demo/src/main/java/com/example/DemoMod.java",
  "Windows 盘符被正则吃掉（字符类不含 `:`）= 下游按错误路径打不开文件",
);
assert.ok(
  sym.suggestedTools.some((t) => t.tool === "query_loader_api" && t.args.className === "FMLRegistries"),
  "应给出针对该符号的 loader API 核对",
);
assert.ok(
  sym.suggestedTools.some((t) => t.tool === "search_forge_docs" && t.args.version === "1.20.1"),
  "有版本时必须给出可直接调用的文档检索",
);

/** 方法符号：参数表是噪音，必须剥掉。 */
const method = analyzeBuildLog({
  logText: [
    "src/main/java/com/example/Foo.java:7: error: cannot find symbol",
    "        e.getHealth(x);",
    "         ^",
    "  symbol:   method getHealth(int)",
    "  location: class LivingEntity",
  ].join("\n"),
  platform: "neoforge",
  minecraftVersion: "1.21.1",
});
assert.equal(method.issues[0].symbol, "getHealth", "method 符号应剥掉参数表");
assert.equal(method.issues[0].location, "LivingEntity");
assert.equal(method.issues[0].file, "src/main/java/com/example/Foo.java");

/** 缺版本 → 绝不编造版本号，改为先列可用版本。 */
const noVer = analyzeBuildLog({ logText: JAVAC_BLOCK, platform: "fabric" });
const noVerTools = noVer.issues[0].suggestedTools;
assert.ok(
  noVerTools.some((t) => t.tool === "list_fabric_versions"),
  `缺 MC 版本时应建议 list_fabric_versions，实际 ${JSON.stringify(noVerTools.map((t) => t.tool))}`,
);
for (const t of noVerTools) {
  assert.ok(!/"version"/.test(JSON.stringify(t.args)), `args 里出现了凭空的 version：${JSON.stringify(t)}`);
  assert.ok(!JSON.stringify(t.args).includes("1.21.1"), `编造了 1.21.1：${JSON.stringify(t)}`);
}

/** Quilt 的 QSL 问题不能路由到 Fabric 文档集。 */
const quilt = analyzeBuildLog({
  logText: "src/main/java/Q.java:3: error: cannot find symbol\n  symbol: class QSLRegistry",
  platform: "quilt",
  minecraftVersion: "1.21.1",
});
const quiltDocs = quilt.issues[0].suggestedTools.filter((t) => /^search_/.test(t.tool));
assert.ok(
  quiltDocs.length > 0 && quiltDocs.every((t) => t.tool === "search_docs" && t.args.platform === "quilt"),
  `Quilt 必须走通用 search_docs(platform=quilt)：${JSON.stringify(quiltDocs.map((t) => t.tool))}`,
);

/** 没有 symbol: 时不得把占位符当查询词。 */
const bare = analyzeBuildLog({
  logText: "Foo.java:9: error: cannot find symbol\n9 errors\n",
  platform: "forge",
  minecraftVersion: "1.20.1",
});
const bareIssue = bare.issues.find((i) => i.kind === "cannot_find_symbol");
assert.equal(bareIssue.symbol, undefined);
for (const t of bareIssue.suggestedTools) {
  const q = JSON.stringify(t.args);
  assert.ok(!/"query":"unknown"|"query":"type"/.test(q), `占位符被当成查询词：${JSON.stringify(t)}`);
  assert.ok(t.tool === "analyze_build_log", `无 symbol 时只应建议重新粘贴：${t.tool}`);
}
assert.equal(bareIssue.file, "Foo.java");

/** 截断：真异常在末尾，头部截断会把失败原因整段丢掉。 */
const padTo = (bytes, tag) => {
  const line = `[${tag}] downloading dependency / resolving checksums / configuration cache entry\n`;
  const n = Math.max(1, Math.floor(bytes / line.length));
  return line.repeat(n);
};
const bigLog = [
  "src/main/java/com/example/Head.java:1: error: cannot find symbol",
  "  symbol:   class HeadThing",
  padTo(3.5 * 1024 * 1024, "head"),
  "src/main/java/com/example/Middle.java:2: error: cannot find symbol",
  "  symbol:   class MiddleMustNotAppear",
  padTo(4 * 1024 * 1024, "tail"),
  "src/main/java/com/example/Tail.java:3: error: cannot find symbol",
  "  symbol:   class TailThing",
  "  location: class TailMod",
  "BUILD FAILED in 4m",
].join("\n");
const big = analyzeBuildLog({ logText: bigLog, platform: "forge", minecraftVersion: "1.20.1" });
assert.ok(Buffer.byteLength(bigLog, "utf8") > LOG_MAX, "样本没超过上限，测不到截断");
assert.equal(big.truncated, true, "超过上限却没报 truncated");
assert.equal(big.totalBytes, Buffer.byteLength(bigLog, "utf8"), "totalBytes 不是截断前的字节数");
assert.ok(big.keptBytes <= LOG_MAX + 200, `keptBytes=${big.keptBytes} 超过预算（截断按码元而非字节）`);
assert.ok(big.omittedBytes > 0, "omittedBytes 缺失 → 无法证明中段被丢弃");
const bigSymbols = big.issues.map((i) => i.symbol).filter(Boolean);
assert.ok(bigSymbols.includes("HeadThing"), "头部片段丢失");
assert.ok(bigSymbols.includes("TailThing"), "尾部片段丢失：Gradle 的真正失败原因在末尾");
assert.ok(!bigSymbols.includes("MiddleMustNotAppear"), `中段本应被省略却仍在：${bigSymbols}`);
assert.ok(big.summary.some((s) => s.includes("字节")), "截断说明未给出字节数");

/** 40 条上限不得静默吞掉命中。 */
const many = Array.from(
  { length: 45 },
  (_, i) => `src/main/java/M${i}.java:${i + 1}: error: cannot find symbol\n  symbol:   class Missing${i}`,
).join("\n");
const capped = analyzeBuildLog({ logText: many, platform: "forge", minecraftVersion: "1.20.1" });
assert.equal(capped.issueCount, 40);
assert.equal(capped.droppedMatches, 5, "被上限挤掉的命中数必须报出来");
assert.ok(capped.summary.some((s) => s.includes("挤掉")), "summary 未说明 issueCount 不是全部命中");

/** 其余模式仍要命中（回归：不因为重构丢功能）。 */
const mixed = analyzeBuildLog({
  logText: [
    "groovy.lang.MissingPropertyException: Could not get unknown property 'forge_version' for object of type DefaultProject",
    "Failed to remap jar with tiny-remapper",
    "BUILD FAILED in 12s",
    "> Could not resolve: net.fabricmc:fabric-loader:0.16.0",
  ].join("\n"),
  platform: "forge",
  minecraftVersion: "1.20.1",
}).issues.map((i) => i.kind);
for (const k of ["missing_property", "loom_remap", "compilation_failure", "dependency"]) {
  assert.ok(mixed.includes(k), `模式 ${k} 丢了：${mixed}`);
}

const empty = analyzeBuildLog({});
assert.equal(empty.ok, false);
assert.ok(!/未识别/.test(empty.summary.join()), "失败路径不应带分析结论");

console.log("test-analyze-build-log: OK");
