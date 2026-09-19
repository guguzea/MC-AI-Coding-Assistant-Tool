/**
 * yarn v1 tiny 的 **named 列对齐重写**（N-11.2 产品化收编）。
 *
 * 背景（temp/audit/sweep81/NEXT-ROUND.md:161-173 / UNFIXED-REPORT-VERDICT.md §7）：
 * 上游 yarn `-v2.jar`/`-mergedv2.jar` 的 `mappings/mappings.tiny`（tiny v2）named 列完整，
 * 而上游 v1 导出件（`yarn-<ver>-tiny.gz`，与 maven v1 artifact 逐字节相同）会丢 named ——
 * 实测 1.21.1 34.15% / 1.21.11 35.69% 的字段降级为 `named==intermediary`。
 *
 * 修法（收编自 temp/audit/sweep81/probes/fix-yarn-named.mjs，一次性修复器）：按
 * **intermediary** 对齐，只逐行替换 v1 的 named 列；official / intermediary 列字节不动。
 *
 * 收编时修掉的缺陷（相对 one-off 原版）：
 *  1. `fetchV2Tiny` 缓存命中时不再丢 URL（原版返回 `from: "cache"`，导致现有 13 份
 *     provenance 的 `upstreamV2Used` 全是 `"cache"` 而非完整 URL）；
 *  2. `stats.missClass` / `stats.missMember` 保持数字（原版写 provenance 时误用
 *     `.length`，数字上取 `.length` 得 `undefined`，JSON.stringify 直接丢字段）；
 *  3. 尾换行不再增长（原版 `out.join(eol)` 已完整复原原文——split 的尾空串就是文件尾
 *     换行的产物——再无条件补一个 eol，实测 13 档盘上 tiny 均以 `\n\n` 结尾而上游 v1
 *     备份以 `\n` 结尾；照抄会使 `--force` 重跑每次多一个换行、永远无法 idempotent）。
 *     这里把尾空串弹掉一个、join 后按原样补回 ⇒ repair(repair(x)) === repair(x)。
 *
 * 另一处防御收紧：v2 的空 named 列（""）不当作有效名覆写 v1（原版会把 v1 named 清成
 * 空串）。实测真实 yarn v2 jar 无空 named 列（13 档缓存 0 行，1.21.11+build.6
 * 94,909 成员行全查），该分支只对异常输入生效，不影响既有 13 档的重算结果。
 *
 * 抓取惯例 mirror src/decompile/downloaders/yarn.ts：固定 maven URL 模式 + maven 路径段
 * 形态门（yarn.ts:91-100）+ `.sha256` sidecar 校验、无 sidecar 拒绝下载（yarn.ts:123-129）。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createHash } from "node:crypto";

/** 产品化管线版本（写进 provenance.pipelineVersion，区分 one-off 修复器产物）。 */
export const PIPELINE_VERSION = "repair-named-v2/1";
/** 产出 tiny 仍是 v1 形态（仅 named 列被重写）。 */
export const FORMAT_VERSION = "yarn-tiny-v1";

export const REPAIR_REASON = "上游 v1 导出件丢 named（named==intermediary 降级）；按上游 v2 jar 对齐重写 named 列";
export const REPAIR_AGENT = "mcp-server/scripts/_lib/build-yarn-mappings.mjs repair-named-v2";

const YARN_MAVEN_BASE = "https://maven.fabricmc.net/net/fabricmc/yarn";

/** mirror src/decompile/downloaders/yarn.ts:91 的 maven 路径段形态门。 */
const YARN_SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9._+-]*$/;

export function sha256Hex(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * 从 zip/jar 的原始字节里按 central directory 找到 `entryName` 并解压
 * （store 与 deflate；收编自 fix-yarn-named.mjs:22-46，逻辑未改）。
 * 找不到（无 EOCD / 无该 entry）返回 null。
 */
export function readZipEntry(buf, target) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) return null;
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) break;
    const method = buf.readUInt16LE(off + 10);
    const csize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const lho = buf.readUInt32LE(off + 42);
    const name = buf.toString("utf8", off + 46, off + 46 + nameLen);
    if (name === target) {
      const ln = buf.readUInt16LE(lho + 26);
      const le = buf.readUInt16LE(lho + 28);
      const start = lho + 30 + ln + le;
      const data = buf.subarray(start, start + csize);
      return method === 0 ? data : zlib.inflateRawSync(data);
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

/**
 * yarn v2 jar 的 maven 候选 URL（按优先序）：`-mergedv2.jar`（official/intermediary/named
 * 三列，mirror yarn.ts:122 的 URL 形态）优先，回退 `-v2.jar`（intermediary/named 两列，
 * fix-yarn-named 实际使用的形态 —— 对按 intermediary 对齐的修复两者皆可）。
 * 版本串先过 yarn.ts:91-100 的形态门，非法直接抛错。
 */
export function yarnV2JarUrls(version) {
  if (!YARN_SEGMENT_RE.test(version)) {
    throw new Error(`yarn 版本串形态非法，拒绝拼进 maven URL：${JSON.stringify(version)}`);
  }
  return [
    `${YARN_MAVEN_BASE}/${version}/yarn-${version}-mergedv2.jar`,
    `${YARN_MAVEN_BASE}/${version}/yarn-${version}-v2.jar`,
  ];
}

/**
 * 解析 tiny v2 文本（头行 `tiny\t2\t0\t<命名空间…>`；`c` 行 1 tab 起名，`\tf`/`\tm` 行
 * 2 tab 起描述符再按命名空间起名）→ 结构化对象 + 供对齐用的三张派生表。
 *
 * 列索引按头行命名空间动态定位（缓存过的 `-v2.jar` 是 2 命名空间
 * `intermediary/named`，`-mergedv2.jar` 是 3 命名空间 `official/intermediary/named`），
 * 不写死列号；`\t\tp` 参数行与注释行不计入映射。
 */
export function parseTinyV2(text) {
  const lines = text.split(/\r?\n/);
  const header = lines[0] ?? "";
  const h = header.split("\t");
  if (h[0] !== "tiny" || h[1] !== "2") {
    throw new Error(`不是 tiny v2（头行 ${JSON.stringify(header.slice(0, 60))}）`);
  }
  const namespaces = h.slice(3);
  const intermediaryIdx = namespaces.indexOf("intermediary");
  const namedIdx = namespaces.indexOf("named");
  if (intermediaryIdx < 0 || namedIdx < 0) {
    throw new Error(
      `tiny v2 缺 intermediary/named 命名空间，无法按 intermediary 对齐（头行命名空间 ${JSON.stringify(namespaces)}）`,
    );
  }
  const classes = [];
  const members = [];
  const classNamed = new Map(); // inter -> named
  const memberNamed = new Map(); // `${interOwner}.${interName}:${desc}` -> named
  const memberNoDesc = new Map(); // `${interOwner}.${interName}` -> named（仅唯一时）
  const dupNoDesc = new Set();
  let cur = null; // 当前 class 行的 per-namespace names（v2 成员行必紧跟其 class 行）
  let classSelfEq = 0;
  let memberSelfEq = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split("\t");
    if (cols[0] === "c") {
      const names = namespaces.map((_, k) => cols[1 + k] ?? "");
      classes.push({ names, lineNo: i + 1 });
      cur = names;
      const inter = names[intermediaryIdx];
      const named = names[namedIdx];
      classNamed.set(inter, named);
      if (named === inter) classSelfEq++;
      continue;
    }
    if (cols[0] === "" && (cols[1] === "f" || cols[1] === "m")) {
      const descriptor = cols[2] ?? "";
      const names = namespaces.map((_, k) => cols[3 + k] ?? "");
      members.push({ tag: cols[1], descriptor, names, lineNo: i + 1 });
      const inter = names[intermediaryIdx];
      const named = names[namedIdx];
      if (cur) {
        const ownerInter = cur[intermediaryIdx];
        memberNamed.set(`${ownerInter}.${inter}:${descriptor}`, named);
        const k2 = `${ownerInter}.${inter}`;
        if (memberNoDesc.has(k2) && memberNoDesc.get(k2) !== named) dupNoDesc.add(k2);
        else memberNoDesc.set(k2, named);
      }
      if (named === inter) memberSelfEq++;
      continue;
    }
    // \t\tp 参数行 / 其他行：不计入映射
  }
  return {
    namespaces,
    intermediaryIdx,
    namedIdx,
    classes,
    members,
    classNamed,
    memberNamed,
    memberNoDesc,
    dupNoDesc,
    base: { classes: classes.length, classSelfEq, members: members.length, memberSelfEq },
  };
}

/**
 * 下载 yarn v2 jar（带 .sha256 sidecar 校验 + 磁盘缓存）。
 * @returns {Promise<{jarBuffer: Buffer, url: string}>} url 恒为完整 maven URL
 *  （缓存命中也一样 —— 修 one-off 缺陷①）。
 * 缓存形态：`<cacheDir>/<jar文件名>` + `<jar文件名>.sha256`（sidecar hex）。
 * 命中先按 TOFU 校验（mirror yarn.ts:24-27 cacheHashMatches），坏缓存当未命中重下。
 * 无网络 / 两个候选都不可用时抛出包含全部失败原因的错误。
 */
export async function fetchV2Tiny({ version, cacheDir }) {
  const urls = yarnV2JarUrls(version);
  const dir = cacheDir ?? path.join(process.env.TEMP ?? "/tmp", "yarn-v2-cache");
  fs.mkdirSync(dir, { recursive: true });
  const failures = [];
  for (const url of urls) {
    const name = url.slice(url.lastIndexOf("/") + 1);
    const cacheJar = path.join(dir, name);
    const cacheShaPath = `${cacheJar}.sha256`;
    if (fs.existsSync(cacheJar) && fs.existsSync(cacheShaPath)) {
      const jar = fs.readFileSync(cacheJar);
      const want = fs.readFileSync(cacheShaPath, "utf8").trim().split(/\s+/)[0].toLowerCase();
      if (/^[0-9a-f]{64}$/.test(want) && sha256Hex(jar) === want) {
        return { jarBuffer: jar, url };
      }
      // 缓存损坏（sha 对不上）→ 当未命中，走网络重下覆盖
    }
    let jarRes;
    let shaRes;
    try {
      [jarRes, shaRes] = await Promise.all([
        fetch(url, { signal: AbortSignal.timeout(120_000) }),
        fetch(`${url}.sha256`, { signal: AbortSignal.timeout(30_000) }),
      ]);
    } catch (e) {
      failures.push(`${e instanceof Error ? e.message : String(e)} (${url})`);
      continue;
    }
    if (!jarRes.ok) {
      failures.push(`HTTP ${jarRes.status} (${url})`);
      continue;
    }
    if (!shaRes.ok) {
      // mirror yarn.ts:123-129：无 maven checksum sidecar 一律拒绝无校验下载（fail-closed）。
      throw new Error(`yarn jar 无 .sha256 sidecar，拒绝无校验下载: ${url} (HTTP ${shaRes.status})`);
    }
    const jar = Buffer.from(await jarRes.arrayBuffer());
    const want = (await shaRes.text()).trim().split(/\s+/)[0].toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(want) || sha256Hex(jar) !== want) {
      throw new Error(`yarn jar sha256 校验失败: ${url} want=${want} got=${sha256Hex(jar)}`);
    }
    fs.writeFileSync(cacheJar, jar);
    fs.writeFileSync(cacheShaPath, `${want}\n`);
    return { jarBuffer: jar, url };
  }
  throw new Error(`yarn v2 jar 下载失败（无网络或 maven.fabricmc.net 不可达）：${failures.join("；")}`);
}

/**
 * 按 intermediary 对齐、只替换 v1 tiny 的 named 列。
 * @returns {{newTinyText: string, stats: object, changed: boolean}}
 *   stats.missClass / stats.missMember 恒为数字（修 one-off 缺陷②）；
 *   changed = newTinyText !== tinyV1Text（严格幂等：已修复文本再跑 changed=false）。
 */
export function repairNamed({ tinyV1Text, v2TinyText }) {
  const v2 = parseTinyV2(v2TinyText);
  const text = tinyV1Text;
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const endsWithEol = text.endsWith(eol);
  const lines = text.split(/\r?\n/);
  // 【修缺陷③】split 的尾空串是文件尾换行的产物，弹掉一个；join 后按原样补回，
  // 使 repair 对任意输入严格幂等（含 one-off 留下的 \n\n 结尾盘上数据）。
  if (endsWithEol && lines[lines.length - 1] === "") lines.pop();

  // official→inter（CLASS 行；扁平布局档也成立：不依赖近邻）
  const offToInter = new Map();
  for (const l of lines) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      offToInter.set(p[1], p[2]);
    }
  }
  const toInterDesc = (d) =>
    d.replace(/L([^;]+);/g, (m, cls) => (offToInter.has(cls) ? `L${offToInter.get(cls)};` : m));

  const stats = {
    classes: 0,
    classFixed: 0,
    members: 0,
    memberFixed: 0,
    missClass: 0,
    missMember: 0,
    missClassSample: [],
    missMemberSample: [],
    stillSelfEqUnmatched: 0, // 修后仍 selfEq 且 v2 找不到的（潜在 join 缺陷）
    conflict: [],
    classSelfEqBefore: 0,
    classSelfEqAfter: 0,
    memberSelfEqBefore: 0,
    memberSelfEqAfter: 0,
    v2Base: v2.base,
  };

  const out = [];
  for (const l of lines) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      stats.classes++;
      if (p[3] === p[2]) stats.classSelfEqBefore++;
      const n = v2.classNamed.get(p[2]);
      if (n && n !== p[3]) {
        if (p[3] !== p[2] && p[3] !== n && stats.conflict.length < 5) {
          stats.conflict.push(`CLASS ${p[2]}: v1=${p[3]} v2=${n}`);
        }
        p[3] = n;
        stats.classFixed++;
      } else if (!n) {
        // v2 缺该类，或 v2 named 为空（防御：空名不当有效名）
        stats.missClass++;
        if (stats.missClassSample.length < 3) stats.missClassSample.push(p[2]);
      }
      if (p[3] === p[2]) stats.classSelfEqAfter++;
      out.push(p.join("\t"));
    } else if (l.startsWith("FIELD\t") || l.startsWith("METHOD\t")) {
      const p = l.split("\t");
      stats.members++;
      if (p[5] === p[4]) stats.memberSelfEqBefore++;
      const ownerInter = offToInter.get(p[1]);
      const kind = l.slice(0, 5);
      const descInter = toInterDesc(p[2]);
      let n =
        ownerInter === undefined ? undefined : v2.memberNamed.get(`${ownerInter}.${p[4]}:${descInter}`);
      if (n === undefined && ownerInter !== undefined) {
        n = v2.memberNamed.get(`${ownerInter}.${p[4]}:${p[2]}`);
      }
      if (n === undefined && ownerInter !== undefined) {
        const k2 = `${ownerInter}.${p[4]}`;
        if (!v2.dupNoDesc.has(k2)) n = v2.memberNoDesc.get(k2);
      }
      if (n === undefined || n === "") {
        // v2 缺该成员（或 named 为空 —— 防御：不当有效名覆写 v1）
        stats.missMember++;
        if (p[5] === p[4]) stats.stillSelfEqUnmatched++;
        if (stats.missMemberSample.length < 3) {
          stats.missMemberSample.push(`${kind} ${ownerInter ?? "?"}.${p[4]}:${descInter}`);
        }
      } else if (n !== p[5]) {
        if (p[5] !== p[4] && p[5] !== n && stats.conflict.length < 5) {
          stats.conflict.push(`${kind} ${ownerInter}.${p[4]}: v1=${p[5]} v2=${n}`);
        }
        p[5] = n;
        stats.memberFixed++;
      }
      if (p[5] === p[4]) stats.memberSelfEqAfter++;
      out.push(p.join("\t"));
    } else {
      out.push(l);
    }
  }

  const repaired = out.join(eol) + (endsWithEol ? eol : "");
  return { newTinyText: repaired, stats, changed: repaired !== text };
}

/**
 * 构造 provenance 对象。字段沿用现有 yarn-tiny-provenance.json 的形状
 * （repairedAt/reason/agent/upstreamV1{file,sha256,note}/upstreamV2Used/repairedSha256/stats），
 * 新增 pipelineVersion 与 formatVersion 两个字符串字段。
 * upstreamV2Used 恒为完整 URL；repairedSha256 为修复产物 gz 的 sha256（node:crypto）。
 */
export function buildProvenance(opts) {
  return {
    repairedAt: (opts.now ?? new Date()).toISOString(),
    reason: REPAIR_REASON,
    agent: REPAIR_AGENT,
    upstreamV1: {
      file: `upstream/${opts.tinyName}.v1-upstream.gz.bak`,
      sha256: opts.upstreamV1Sha256,
      note: "修复前盘上 v1 tiny 的逐字节备份",
    },
    upstreamV2Used: opts.upstreamV2Url,
    repairedSha256: sha256Hex(opts.repairedGz),
    stats: opts.stats,
    pipelineVersion: PIPELINE_VERSION,
    formatVersion: FORMAT_VERSION,
  };
}
