#!/usr/bin/env node
/**
 * fetch-quilt-docs.js — 抓取 Quilt 官方/wiki 页到 data/quilt_<ver>/quilt-docs/<ver>/
 * 缺页保持空索引，禁止复制 fabric-wiki。
 *
 *   node scripts/fetch-quilt-docs.js [--version=1.20.1] [--dry-run]
 */
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DATA = join(ROOT, "data");

function qslReadmeUrl(mcVersion) {
  const [maj, min] = mcVersion.split(".");
  const branch = `${maj}.${min}`;
  return `https://raw.githubusercontent.com/QuiltMC/quilt-standard-libraries/${branch}/README.md`;
}

function pagesFor(mcVersion) {
  return [
    {
      id: "qsl-qfapi",
      label: "QSL and Quilted Fabric API",
      url: "https://wiki.quiltmc.org/en/concepts/qsl-qfapi",
      tags: ["qsl", "qfapi", "registry"],
    },
    {
      id: "quilt-mod-json",
      label: "quilt.mod.json",
      url: "https://raw.githubusercontent.com/QuiltMC/rfcs/main/specification/0002-quilt.mod.json.md",
      tags: ["loader", "metadata"],
    },
    {
      id: "qsl-readme",
      label: "Quilt Standard Libraries README",
      url: qslReadmeUrl(mcVersion),
      tags: ["qsl"],
    },
  ];
}

function sha(s) {
  return createHash("sha256").update(s).digest("hex");
}

const textCache = new Map();

async function fetchText(url) {
  if (textCache.has(url)) return textCache.get(url);
  let last;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "MC-skill-docs-fetch" } });
      if (res.ok) {
        const text = await res.text();
        textCache.set(url, text);
        return text;
      }
      last = new Error(`${res.status} ${url}`);
    } catch (e) {
      last = e;
    }
    await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
  }
  throw last;
}

function extractMainHtml(html) {
  const candidates = [];
  const re = /<(article|main)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html))) candidates.push(m[2]);
  candidates.sort((a, b) => b.length - a.length);
  if (candidates[0] && candidates[0].length > 800) return candidates[0];
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return body ? body[1] : html;
}

function toMd(html, url) {
  const text = extractMainHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
    .replace(/<header\b[\s\S]*?<\/header>/gi, "")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `> 来源：${url}\n> 抓取时间：${new Date().toISOString()}\n> 警告：Quilt wiki / quilt.mod.json RFC 是未版本化现行页，不是该 MC 版本的历史快照。QSL README 才按 QuiltMC/quilt-standard-libraries/<maj.min> 抓取。\n\n${text.slice(0, 80_000)}\n`;
}

function firstParagraph(md) {
  const body = String(md ?? "")
    .replace(/^>.*$/gm, "")
    .replace(/^#+ .*$/gm, "");
  const para = body
    .split(/\n\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .find((s) => s.length > 40);
  return (para ?? body.replace(/\s+/g, " ").trim()).slice(0, 200);
}

function writeIndexes(outDir, index) {
  const l1 = [];
  const l2 = [];
  for (const e of index) {
    const stem = String(e.id).split("/").pop();
    const processedFile = `processed/${stem}.md`;
    let content = "";
    try {
      content = readFileSync(join(outDir, processedFile), "utf8");
    } catch {
      /* processed 可能尚未写入 */
    }
    l1.push({
      id: e.id,
      version: e.version,
      label: e.label,
      url: e.url,
      tags: e.tags,
      firstParagraph: firstParagraph(content),
      sections: [],
      source: e.source,
      ...(e.sha256 ? { sha256: e.sha256 } : {}),
    });
    l2.push({
      id: e.id,
      version: e.version,
      label: e.label,
      url: e.url,
      tags: e.tags,
      sections: [],
      hasCodeBlocks: content.includes("```"),
      codeBlockCount: Math.floor((content.match(/```/g) || []).length / 2),
      keySections: 0,
      file: `${stem}.md`,
      processedFile,
      source: e.source,
      ...(e.fetchedAt ? { fetchedAt: e.fetchedAt } : {}),
      ...(e.sha256 ? { sha256: e.sha256 } : {}),
    });
  }
  writeFileSync(join(outDir, "index-l0.json"), JSON.stringify(index, null, 2), "utf8");
  writeFileSync(join(outDir, "index-l1.json"), JSON.stringify(l1, null, 2), "utf8");
  writeFileSync(join(outDir, "index-l2.json"), JSON.stringify(l2, null, 2), "utf8");
}

async function main() {
  const argv = process.argv.slice(2);
  const dry = argv.includes("--dry-run");
  const verArg = argv.find((a) => a.startsWith("--version"));
  const version = verArg ? verArg.split("=")[1] || argv[argv.indexOf(verArg) + 1] : "1.20.1";
  const versions = version === "all" ? ["1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.11"] : [version];

  for (const ver of versions) {
    const outDir = join(DATA, `quilt_${ver}`, "quilt-docs", ver);
    const processed = join(outDir, "processed");
    if (!dry) mkdirSync(processed, { recursive: true });
    const index = [];
    for (const page of pagesFor(ver)) {
      try {
        const raw = await fetchText(page.url);
        const md = page.url.endsWith(".md")
          ? `> 来源：${page.url}\n> 抓取时间：${new Date().toISOString()}\n> 警告：Quilt wiki / quilt.mod.json RFC 是未版本化现行页，不是该 MC 版本的历史快照。QSL README 才按 QuiltMC/quilt-standard-libraries/<maj.min> 抓取。\n\n${raw}`
          : toMd(raw, page.url);
        const id = `${ver}/${page.id}`;
        if (!dry) writeFileSync(join(processed, `${page.id}.md`), md, "utf8");
        index.push({
          id,
          version: ver,
          label: page.label,
          url: page.url,
          tags: page.tags,
          priority: "⭐",
          sectionCount: 1,
          source: "quilt-docs",
          fetchedAt: new Date().toISOString(),
          sha256: sha(md),
        });
        console.log(`ok ${page.id} (${md.length} chars)`);
      } catch (e) {
        console.warn(`skip ${page.id}: ${e.message ?? e}`);
      }
    }
    if (!dry) {
      writeIndexes(outDir, index);
      console.log(`wrote ${outDir} (${index.length} pages, l0/l1/l2)`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
