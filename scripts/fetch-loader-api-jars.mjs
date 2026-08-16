#!/usr/bin/env node
/**
 * 从已解压 MDK 的 gradle.properties / build.gradle 读坐标，下官方 API jar 到 $MC_SKILL_CACHE/loader-jars。
 * jar 不入库。坐标以打开到的 build.gradle 为准，禁止猜 artifactId。
 *
 * 用法：node scripts/fetch-loader-api-jars.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
const MDK_ROOT = join(CACHE, "mdk");
const JAR_DIR = join(CACHE, "loader-jars");
const UA = { "User-Agent": "MC-AI-Coding-Assistant-Tool" };

mkdirSync(JAR_DIR, { recursive: true });

function walkUnpacked(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return acc;
  }
  if (names.includes("unpacked")) {
    acc.push(join(dir, "unpacked"));
    return acc;
  }
  for (const n of names) {
    const full = join(dir, n);
    try {
      if (statSync(full).isDirectory()) walkUnpacked(full, acc);
    } catch {
      /* skip */
    }
  }
  return acc;
}

function unpackedRoot(extractDir) {
  const names = readdirSync(extractDir).filter((n) => n !== "." && n !== "..");
  if (names.length === 1) {
    const only = join(extractDir, names[0]);
    try {
      if (statSync(only).isDirectory()) return only;
    } catch {
      /* fall */
    }
  }
  return extractDir;
}

function parseProps(txt) {
  const get = (k) => txt.match(new RegExp(`^\\s*${k}\\s*=\\s*(\\S+)`, "m"))?.[1];
  return {
    neo_version: get("neo_version") || get("neoforge_version"),
    forge_version: get("forge_version"),
    minecraft_version: get("minecraft_version"),
    parchment_minecraft_version: get("parchment_minecraft_version"),
    parchment_mappings_version: get("parchment_mappings_version"),
    neo_form_version: get("neo_form_version"),
    mapping_channel: get("mapping_channel"),
    mapping_version: get("mapping_version"),
    mappings: get("mappings"),
    fabric_api_version: get("fabric_api_version"),
    fabric_version: get("fabric_version"),
    yarn_mappings: get("yarn_mappings"),
  };
}

function mappingsFromProps(p, buildGradle) {
  if (p.parchment_minecraft_version && p.parchment_mappings_version) {
    return `parchment-${p.parchment_minecraft_version}-${p.parchment_mappings_version}`;
  }
  if (p.neo_form_version) return `mojmap-neoform-${p.neo_form_version}`;
  if (p.mapping_channel && p.mapping_version) return `${p.mapping_channel}-${p.mapping_version}`;
  if (p.yarn_mappings) return `yarn-${p.yarn_mappings}`;
  if (p.mappings) return p.mappings;
  const bg = buildGradle || "";
  const fgMap = bg.match(/mappings\s+channel:\s*['"]([^'"]+)['"],\s*version:\s*['"]([^'"]+)['"]/);
  if (fgMap) return `${fgMap[1]}-${fgMap[2]}`;
  if (/officialMojangMappings|loom\.officialMojangMappings/.test(bg)) {
    return `mojmap-${p.minecraft_version || "unknown"}`;
  }
  if (String(p.minecraft_version || "").startsWith("26.")) {
    return `mojmap-${p.minecraft_version}`;
  }
  return null;
}

const WANTED_KEYS = new Set([
  "1.20.4-neoforge",
  "1.21.1-neoforge",
  "1.21.3-neoforge",
  "1.21.8-neoforge",
  "1.21.11-neoforge",
  "26.1-neoforge",
  "1.20.4-forge",
  "1.20.1-forge",
  "1.19.4-forge",
  "1.18.2-forge",
  "1.17.1-forge",
  "1.16.5-forge",
  "1.15.2-forge",
  "1.14.4-forge",
  "1.13.2-forge",
  "1.12.2-forge",
  "1.14.4-fabric-api",
  "1.16.5-fabric-api",
  "1.17.1-fabric-api",
  "1.18.2-fabric-api",
  "1.19.4-fabric-api",
  "1.20.1-fabric-api",
  "1.20.4-fabric-api",
  "1.21.1-fabric-api",
  "1.21.3-fabric-api",
  "1.21.11-fabric-api",
  "26.1.2-fabric-api",
]);

const SKIP_DOWNLOAD_KEYS = new Set([
  "1.12.2-liteloader",
  "1.10.2-liteloader",
  "1.8.9-liteloader",
  "1.13.2-rift",
  "1.6.4-modloader",
  "1.5.2-modloader",
  "1.2.5-modloader",
]);

function parseCoords(buildGradle, props) {
  const deps = [];
  const uncommented = buildGradle.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  const re = /["'](net\.neoforged|net\.minecraftforge|net\.fabricmc\.fabric-api):([a-zA-Z0-9._-]+):([^"']+)["']/g;
  let m;
  while ((m = re.exec(uncommented))) {
    let ver = m[3];
    ver = ver.replace(/\$\{neo_version\}/g, props.neo_version || "");
    ver = ver.replace(/\$\{neoforge_version\}/g, props.neo_version || "");
    ver = ver.replace(/\$\{forge_version\}/g, props.forge_version || "");
    ver = ver.replace(/\$\{minecraft_version\}/g, props.minecraft_version || "");
    ver = ver.replace(/\$\{fabric_api_version\}/g, props.fabric_api_version || "");
    ver = ver.replace(/\$\{fabric_version\}/g, props.fabric_api_version || props.fabric_version || "");
    ver = ver.replace(/\$\{project\.fabric_api_version\}/g, props.fabric_api_version || "");
    ver = ver.replace(/\$\{project\.fabric_version\}/g, props.fabric_version || props.fabric_api_version || "");
    if (!ver || ver.includes("$") || ver === "-" || ver.startsWith("-") || ver.endsWith("-")) continue;
    deps.push({ group: m[1], artifact: m[2], version: ver, from: "quoted-maven-coord" });
  }
  // ModDevGradle MDK 打开到 plugin + neoForge { version = project.neo_version }，无 quoted 坐标。
  // artifactId 来自同系列 NeoGradle MDK 已打开的 `net.neoforged:neoforge:${neo_version}`，不另猜名字。
  if (
    /id\s+['"]net\.neoforged\.moddev['"]/.test(uncommented) &&
    /neoForge\s*\{/.test(uncommented) &&
    props.neo_version &&
    !deps.some((d) => d.group === "net.neoforged" && d.artifact === "neoforge")
  ) {
    deps.push({
      group: "net.neoforged",
      artifact: "neoforge",
      version: props.neo_version,
      from: "moddev-plugin+neoForge.version",
    });
  }
  return deps;
}

function mavenBase(group) {
  if (group === "net.neoforged") return "https://maven.neoforged.net/releases";
  if (group === "net.minecraftforge") return "https://maven.minecraftforge.net";
  if (group === "net.fabricmc.fabric-api") return "https://maven.fabricmc.net";
  return null;
}

async function tryDownload(url) {
  const tmp = join(JAR_DIR, `_dl-${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`);
  try {
    const { spawnSync } = await import("child_process");
    const r = spawnSync(
      "curl.exe",
      ["-fL", "--retry", "3", "--retry-delay", "2", "--connect-timeout", "20", "-A", "MC-AI-Coding-Assistant-Tool", "-o", tmp, url],
      { windowsHide: true, encoding: "utf8" },
    );
    if (r.status === 0 && existsSync(tmp) && statSync(tmp).size > 1000) {
      const buf = readFileSync(tmp);
      return { ok: true, url, buf };
    }
    if (existsSync(tmp) && statSync(tmp).size === 0) {
      /* fall through to fetch */
    }
  } catch {
    /* fall through */
  } finally {
    try {
      const { unlinkSync } = await import("fs");
      if (existsSync(tmp)) unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
  let last = { ok: false, status: 0, url };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow" });
      if (!res.ok) {
        last = { ok: false, status: res.status, url };
        if (res.status === 404) return last;
        await new Promise((r) => setTimeout(r, 400 * attempt));
        continue;
      }
      return { ok: true, url, buf: Buffer.from(await res.arrayBuffer()) };
    } catch (e) {
      last = { ok: false, status: 0, url, error: String(e) };
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  return last;
}

function keyName(root, props, group, coord) {
  const fromPath = String(root)
    .replace(/\\/g, "/")
    .match(/\/(?:forge|fabric|neoforge)\/(\d+\.\d+(?:\.\d+)?)/)?.[1];
  const fromCoord = String(coord?.version || "").match(/^(\d+\.\d+(?:\.\d+)?)/)?.[1];
  const mc = props.minecraft_version || fromPath || fromCoord || "unknown";
  if (group === "net.neoforged") {
    const short = mc.startsWith("26.") ? mc.replace(/^(\d+\.\d+).*/, "$1") : mc;
    return `${short}-neoforge`;
  }
  if (group === "net.fabricmc.fabric-api") return `${mc}-fabric-api`;
  return `${mc}-forge`;
}

function versionRank(v) {
  const n = String(v || "")
    .split(/[.+-]/)
    .map((x) => parseInt(x, 10))
    .filter((x) => !Number.isNaN(x));
  return n.concat([0, 0, 0, 0]).slice(0, 4);
}

function betterCandidate(a, b) {
  const ra = versionRank(a.coord.version);
  const rb = versionRank(b.coord.version);
  for (let i = 0; i < 4; i++) {
    if (ra[i] !== rb[i]) return ra[i] > rb[i];
  }
  return false;
}

function considerCandidate(best, log, cand) {
  const { root, key } = cand;
  if (!WANTED_KEYS.has(key)) {
    log.push({ root, key, skipped: "不在 WANTED_KEYS（对照索引，不造 00–10）" });
    return;
  }
  if (SKIP_DOWNLOAD_KEYS.has(key)) {
    log.push({ root, key, skipped: "官方不代下（LiteLoader/Rift/ModLoader）" });
    return;
  }
  const prev = best.get(key);
  if (!prev || betterCandidate(cand, prev)) best.set(key, cand);
}

/** 无 example-mod MDK 时，只读该档 scaffold / 00-project-setup 写明的 fabric-api 坐标。 */
function collectRepoFabricPins(best, log) {
  const fabricRoot = join(ROOT, "fabric");
  if (!existsSync(fabricRoot)) return;
  let vers = [];
  try {
    vers = readdirSync(fabricRoot);
  } catch {
    return;
  }
  for (const ver of vers) {
    const key = `${ver}-fabric-api`;
    if (!WANTED_KEYS.has(key) || best.has(key)) continue;
    const dir = join(fabricRoot, ver);
    const scaffoldGp = join(dir, "scaffold", "gradle.properties");
    const setup = join(dir, ".cursor", "rules", "00-project-setup.mdc");
    let txt = "";
    let from = null;
    if (existsSync(scaffoldGp)) {
      txt = readFileSync(scaffoldGp, "utf8");
      from = scaffoldGp;
    }
    let props = parseProps(txt);
    if (!(props.fabric_api_version || props.fabric_version) && existsSync(setup)) {
      txt = readFileSync(setup, "utf8");
      from = setup;
      props = parseProps(txt);
    }
    const apiVer = props.fabric_api_version || props.fabric_version;
    if (!apiVer || apiVer.includes("$")) {
      log.push({ root: dir, key, skipped: "该档文档未写明 fabric-api 坐标，禁止借邻版" });
      continue;
    }
    const yarn = props.yarn_mappings;
    const cand = {
      root: dir,
      props: { ...props, minecraft_version: props.minecraft_version || ver },
      coord: {
        group: "net.fabricmc.fabric-api",
        artifact: "fabric-api",
        version: apiVer,
        from: from,
      },
      key,
      mappingsHint: yarn ? `yarn-${yarn}` : null,
    };
    log.push({ root: dir, key, pinned: apiVer, from: "repo-docs" });
    considerCandidate(best, log, cand);
  }
}

async function downloadCoord(c) {
  const base = mavenBase(c.group);
  if (!base) return null;
  const groupPath = c.group.replace(/\./g, "/");
  const classifiers = ["sources", "universal", "userdev", ""];
  const versionSegs = [...new Set([c.version, encodeURIComponent(c.version)])];
  const tries = [];
  for (const cl of classifiers) {
    const fileName = cl ? `${c.artifact}-${c.version}-${cl}.jar` : `${c.artifact}-${c.version}.jar`;
    for (const verSeg of versionSegs) {
      const url = `${base}/${groupPath}/${c.artifact}/${verSeg}/${fileName}`;
      try {
        const r = await tryDownload(url);
        if (r.ok) return { ...r, name: fileName };
        tries.push({ url, status: r.status, error: r.error });
      } catch (e) {
        tries.push({ url, error: String(e) });
      }
    }
  }
  return { ok: false, tries };
}

function parseFabricApiPomModules(pomXml) {
  const out = [];
  const blocks = pomXml.match(/<dependency>[\s\S]*?<\/dependency>/g) || [];
  for (const block of blocks) {
    const gid = block.match(/<groupId>([^<]+)<\/groupId>/)?.[1]?.trim();
    const aid = block.match(/<artifactId>([^<]+)<\/artifactId>/)?.[1]?.trim();
    const ver = block.match(/<version>([^<]+)<\/version>/)?.[1]?.trim();
    if (gid !== "net.fabricmc.fabric-api" || !aid || !ver || aid === "fabric-api") continue;
    out.push({ group: gid, artifact: aid, version: ver });
  }
  return out;
}

async function expandFabricApiModules(coord, log) {
  const base = mavenBase(coord.group);
  const groupPath = coord.group.replace(/\./g, "/");
  const versionSegs = [...new Set([coord.version, encodeURIComponent(coord.version)])];
  let pom = null;
  for (const verSeg of versionSegs) {
    const url = `${base}/${groupPath}/${coord.artifact}/${verSeg}/${coord.artifact}-${coord.version}.pom`;
    const r = await tryDownload(url);
    if (r.ok) {
      pom = r.buf.toString("utf8");
      break;
    }
    log.push({ tried: url, status: r.status, note: "fabric-api pom" });
  }
  if (!pom) return { ok: false, reason: "fabric-api POM 404" };
  const mods = parseFabricApiPomModules(pom);
  if (!mods.length) return { ok: false, reason: "POM 无 fabric-api 模块" };
  const distZip = join(ROOT, "mcp-server", "dist", "decompile", "zip-util.js");
  const distMdk = join(ROOT, "mcp-server", "dist", "mdk", "index.js");
  if (!existsSync(distZip) || !existsSync(distMdk)) {
    return { ok: false, reason: "need mcp-server dist to merge module sources" };
  }
  const { readZip } = await import(pathToFileURL(distZip).href);
  const { createStoreZip } = await import(pathToFileURL(distMdk).href);
  const javaEntries = [];
  let moduleHits = 0;
  for (const m of mods) {
    const got = await downloadCoord(m);
    if (!got?.ok) continue;
    moduleHits++;
    try {
      const map = readZip(got.buf);
      for (const [name, data] of map) {
        const posix = String(name).replace(/\\/g, "/");
        if (posix.endsWith(".java")) javaEntries.push({ name: posix, data });
      }
    } catch {
      /* skip bad zip */
    }
  }
  if (!javaEntries.length) return { ok: false, reason: "modules had no .java", moduleHits, moduleCount: mods.length };
  return {
    ok: true,
    buf: createStoreZip(javaEntries),
    url: `fabric-api-pom-modules:${coord.version}`,
    name: `${coord.artifact}-${coord.version}-modules-sources.jar`,
    moduleHits,
    moduleCount: mods.length,
    javaFileCount: javaEntries.length,
  };
}

async function main() {
  const unpackedDirs = walkUnpacked(MDK_ROOT);
  const log = [];
  const best = new Map();
  for (const u of unpackedDirs) {
    const root = unpackedRoot(u);
    const gp = join(root, "gradle.properties");
    const bg = existsSync(join(root, "build.gradle"))
      ? join(root, "build.gradle")
      : existsSync(join(root, "build.gradle.kts"))
        ? join(root, "build.gradle.kts")
        : null;
    if (!existsSync(gp) || !bg) {
      log.push({ root, skipped: "no gradle.properties/build.gradle" });
      continue;
    }
    const props = parseProps(readFileSync(gp, "utf8"));
    const bgText = readFileSync(bg, "utf8");
    const coords = parseCoords(bgText, props);
    if (!coords.length) {
      log.push({ root, skipped: "build.gradle 未打开到 maven 坐标，禁止猜 artifactId" });
      continue;
    }
    for (const c of coords) {
      const key = keyName(root, props, c.group, c);
      considerCandidate(best, log, { root, props, coord: c, key, bgText });
    }
  }
  collectRepoFabricPins(best, log);

  for (const cand of best.values()) {
    const { root, props, coord: c, key } = cand;
    const dest = join(JAR_DIR, `${key}.jar`);
    const bgText = existsSync(join(root, "build.gradle"))
      ? readFileSync(join(root, "build.gradle"), "utf8")
      : existsSync(join(root, "build.gradle.kts"))
        ? readFileSync(join(root, "build.gradle.kts"), "utf8")
        : existsSync(join(root, "scaffold", "build.gradle"))
          ? readFileSync(join(root, "scaffold", "build.gradle"), "utf8")
          : "";
    const mv = cand.mappingsHint || mappingsFromProps(props, cand.bgText || bgText);
    const destBuf = existsSync(dest) ? readFileSync(dest) : null;
    const hasJava = destBuf && destBuf.includes(Buffer.from(".java"));
    const userdevOnly = destBuf && destBuf.includes(Buffer.from("joined.lzma")) && !hasJava;
    if (existsSync(dest) && hasJava && (existsSync(`${dest}.sidecar`) || existsSync(`${dest}.mappings.json`)) && !userdevOnly) {
      log.push({ ok: true, dest, skipped: "idempotent cache hit (jar contains .java)", key, mappingsVersion: mv, coord: c });
      continue;
    }
    let got = await downloadCoord(c);
    if (got?.ok && !got.buf.includes(Buffer.from(".java")) && c.group === "net.fabricmc.fabric-api") {
      const expanded = await expandFabricApiModules(c, log);
      if (expanded.ok) {
        log.push({
          key,
          expandedModules: true,
          moduleHits: expanded.moduleHits,
          moduleCount: expanded.moduleCount,
          javaFileCount: expanded.javaFileCount,
        });
        got = expanded;
      } else {
        log.push({ key, warning: "fabric-api aggregator 无 .java，模块展开失败", reason: expanded.reason });
      }
    }
    if (!got?.ok) {
      log.push({ root, coord: c, key, skipped: "maven 404，不编造 jar", tries: got?.tries?.slice(0, 8) });
      continue;
    }
    writeFileSync(dest, got.buf);
    if (mv) {
      const side = { mappingsVersion: mv, mappingsSource: "mdk-gradle.properties", coord: c, url: got.url };
      writeFileSync(`${dest}.mappings.json`, JSON.stringify({ ...side, from: side.mappingsSource }, null, 2));
      writeFileSync(`${dest}.sidecar`, JSON.stringify(side, null, 2));
    }
    if (!got.buf.includes(Buffer.from(".java"))) {
      log.push({ root, coord: c, key, warning: "downloaded jar has no .java entries; sources classifier 优先但仍可能是 userdev" });
    }
    log.push({ ok: true, dest, url: got.url, bytes: got.buf.length, mappingsVersion: mv, coord: c, key });
  }

  for (const key of WANTED_KEYS) {
    if (SKIP_DOWNLOAD_KEYS.has(key)) continue;
    if (![...best.keys()].includes(key) && !log.some((x) => x.key === key && x.ok)) {
      log.push({ key, skipped: "LOADER_API_NOT_INDEXED：无 MDK/文档坐标，禁止借邻版 jar" });
    }
  }

  writeFileSync(
    join(ROOT, "mcp-server", "data", "loader-api-summaries", "fetch-jars-last.json"),
    JSON.stringify({ cache: CACHE, log }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        jarDir: JAR_DIR,
        ok: log.filter((x) => x.ok).length,
        wanted: [...WANTED_KEYS],
        log: log.filter((x) => x.ok || x.skipped),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
