import { readFileSync } from "fs";

const mod = await import("./dist/diagnostics/library-catalog.js");
const arr = mod.LIBRARY_CATALOG ?? Object.values(mod).find((v) => Array.isArray(v));

const cmp = (a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
};

const targets = ["mc-cca", "mc-config", "mc-compat-jei", "mc-kotlin-for-forge"];
for (const t of targets) {
  console.log(`===== ${t}`);
  for (const e of arr) {
    const sid = String(e.skillId ?? "");
    const cid = String(e.communityDocId ?? "");
    if (!sid.includes(t) && !cid.includes(t)) continue;
    const rel = (e.supportedVersions ?? [])
      .filter((v) => /^\d+\.\d+(\.\d+)?$/.test(v))
      .sort(cmp);
    console.log(`  entry=${e.id}`);
    console.log(`    skillId=${sid || "(none)"}  communityDocId=${cid || "(none)"}`);
    console.log(`    loaders=${JSON.stringify(e.loaders)}`);
    console.log(`    n=${(e.supportedVersions ?? []).length} stable min=${rel[0]} max=${rel[rel.length - 1]}`);
  }
}

// which lib-* docs have no skillId at all (sanity)
const noSkill = arr.filter((e) => !e.skillId).map((e) => e.id);
console.log("entries without skillId =", JSON.stringify(noSkill));
void readFileSync;
