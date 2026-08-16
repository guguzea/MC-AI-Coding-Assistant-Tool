#!/usr/bin/env node
/**
 * 从已解压 MDK 的 gradle.properties / build.gradle 读坐标，下官方 API jar 到 $MC_SKILL_CACHE/loader-jars。
 * jar 不入库。坐标以打开到的 build.gradle 为准，禁止猜 artifactId。
 *
 * 用法：node scripts/fetch-loader-api-jars.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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
  const get = (k) => txt.match(new RegExp(`^${k}\\s*=\\s*(\\S+)`, "m"))?.[1];
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
  };
}

function mappingsFromProps(p) {
  if (p.parchment_minecraft_version && p.parchment_mappings_version) {
    return `parchment-${p.parchment_minecraft_version}-${p.parchment_mappings_version}`;
  }
  if (p.neo_form_version) return `mojmap-neoform-${p.neo_form_version}`;
  if (p.mapping_channel && p.mapping_version) return `${p.mapping_channel}-${p.mapping_version}`;
  if (p.mappings) return p.mappings;
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
]);

function parseCoords(buildGradle, props) {
  const deps = [];
  const uncommented = buildGradle.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  const re = /["'](net\.neoforged|net\.minecraftforge):([a-zA-Z0-9._-]+):([^"']+)["']/g;
  let m;
  while ((m = re.exec(uncommented))) {
    let ver = m[3];
    ver = ver.replace(/\$\{neo_version\}/g, props.neo_version || "");
    ver = ver.replace(/\$\{neoforge_version\}/g, props.neo_version || "");
    ver = ver.replace(/\$\{forge_version\}/g, props.forge_version || "");
    ver = ver.replace(/\$\{minecraft_version\}/g, props.minecraft_version || "");
    if (!ver || ver.includes("$")) continue;
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

function keyName(root, props, group) {
  const mc = props.minecraft_version || "unknown";
  if (group === "net.neoforged") {
    const short = mc.startsWith("26.") ? mc.replace(/^(\d+\.\d+).*/, "$1") : mc;
    return `${short}-neoforge`;
  }
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
    const coords = parseCoords(readFileSync(bg, "utf8"), props);
    if (!coords.length) {
      log.push({ root, skipped: "build.gradle 未打开到 maven 坐标，禁止猜 artifactId" });
      continue;
    }
    for (const c of coords) {
      const key = keyName(root, props, c.group);
      if (!WANTED_KEYS.has(key)) {
        log.push({ root, key, skipped: "本收口只拉六档 Neo + 1.20.4 Forge 对照 jar" });
        continue;
      }
      const cand = { root, props, coord: c, key };
      const prev = best.get(key);
      if (!prev || betterCandidate(cand, prev)) best.set(key, cand);
    }
  }

  for (const cand of best.values()) {
    const { root, props, coord: c, key } = cand;
    const dest = join(JAR_DIR, `${key}.jar`);
    const mv = mappingsFromProps(props);
    const userdevOnly =
      existsSync(dest) &&
      (() => {
        try {
          return readFileSync(dest).includes(Buffer.from("joined.lzma"));
        } catch {
          return false;
        }
      })();
    if (existsSync(dest) && existsSync(dest + ".mappings.json") && !userdevOnly) {
      log.push({ ok: true, dest, skipped: "idempotent cache hit", key, mappingsVersion: mv, coord: c });
      continue;
    }
    const base = mavenBase(c.group);
    if (!base) continue;
    const groupPath = c.group.replace(/\./g, "/");
    const classifiers = ["sources", "universal", "userdev", ""];
    let got = null;
    for (const cl of classifiers) {
      const name = cl ? `${c.artifact}-${c.version}-${cl}.jar` : `${c.artifact}-${c.version}.jar`;
      const url = `${base}/${groupPath}/${c.artifact}/${c.version}/${name}`;
    try {
      const r = await tryDownload(url);
      if (r.ok) {
        got = { ...r, name };
        break;
      }
      log.push({ tried: url, status: r.status, error: r.error });
    } catch (e) {
      log.push({ tried: url, error: String(e) });
    }
    }
    if (!got) {
      log.push({ root, coord: c, skipped: "maven 404，不编造 jar" });
      continue;
    }
    writeFileSync(dest, got.buf);
    if (mv) {
      writeFileSync(
        dest + ".mappings.json",
        JSON.stringify({ mappingsVersion: mv, from: "mdk-gradle.properties", coord: c, url: got.url }, null, 2),
      );
    }
    log.push({ ok: true, dest, url: got.url, bytes: got.buf.length, mappingsVersion: mv, coord: c, key });
  }
  writeFileSync(join(ROOT, "mcp-server", "data", "loader-api-summaries", "fetch-jars-last.json"), JSON.stringify({ cache: CACHE, log }, null, 2));
  console.log(JSON.stringify({ jarDir: JAR_DIR, ok: log.filter((x) => x.ok).length, wanted: [...WANTED_KEYS], log: log.filter((x) => x.ok || x.skipped) }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
