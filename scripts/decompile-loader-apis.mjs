#!/usr/bin/env node
/**
 * 反编译加载器/API jar → mcp-server/data/loader-api-summaries/
 * 缓存只写 D:\mc-skill-temp（MC_SKILL_CACHE）。.java 不入库、不写 H:\MC_skill。
 * 1.12 / 1.13 关闭 Yarn remap（decompile_mod_jar 对 unsupported 版本本就不会 remap）。
 *
 * 用法：
 *   node scripts/decompile-loader-apis.mjs
 *   将 jar 放到 D:\mc-skill-temp\loader-jars\<key>.jar
 *   key 例：1.20.1-quilt-qsl、1.12.2-liteloader、1.13.2-rift
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
const JAR_DIR = join(CACHE, "loader-jars");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");

mkdirSync(OUT, { recursive: true });
mkdirSync(JAR_DIR, { recursive: true });

const NOTE = `# loader-api-summaries

反编译缓存目录：**${CACHE}**（禁止写仓库根 / H:\\MC_skill）。
把加载器 jar 放到 \`${JAR_DIR}\` 后重新运行本脚本。

键形如 \`1.20.1/quilt\`、\`1.12.2/liteloader\`、\`1.13.2/rift\`。
**不要**把摘要合并进 Parchment query_api。1.6.4 ModLoader 不走这条管线。
`;
writeFileSync(join(OUT, "README.md"), NOTE, "utf8");

if (!existsSync(JAR_DIR) || readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar")).length === 0) {
  writeFileSync(
    join(OUT, "status.json"),
    JSON.stringify(
      {
        ok: true,
        decompiled: [],
        skipped: "no jars in " + JAR_DIR,
        cache: CACHE,
        note: "Place loader API jars then re-run. Yarn remap is off for MC < 1.14.",
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log("no loader jars; wrote README + status.json");
  process.exit(0);
}

const { analyzeModJar } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "decompile", "services", "mod-analyzer.js")).href
);

const summaries = [];
for (const name of readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar"))) {
  const jarPath = join(JAR_DIR, name);
  const meta = analyzeModJar(jarPath);
  summaries.push({
    file: name,
    loaders: meta.loaders,
    modId: meta.modId,
    entrypoints: meta.entrypoints,
    warnings: meta.warnings,
  });
}
writeFileSync(join(OUT, "index.json"), JSON.stringify({ cache: CACHE, jars: summaries }, null, 2), "utf8");
console.log(`indexed ${summaries.length} jars (metadata only; full VineFlower when decompile_mod_jar is invoked)`);
