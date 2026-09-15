// assert-scaffold-wrappers.mjs — W5-4 stage ② gate.
//
// Every version pack whose pack.meta.json declares scaffold.mode === "gradle" must ship a
// self-consistent Gradle wrapper. Checks that can actually fail:
//   1. the four wrapper files + build.gradle + settings.gradle exist and are non-empty
//   2. gradle-wrapper.properties' distributionUrl version === pack.meta scaffold.gradle
//   3. the jar is a ZIP holding org/gradle/wrapper/GradleWrapperMain.class
//   4. the jar is tracked by git and NOT in a gitignored state
// Deliberately NOT checked by default: "the jar was produced by the props-named distribution".
// A wrapper jar embeds no version marker (measured: no Implementation-Version in
// META-INF/MANIFEST.MF, no org/gradle/util/GradleVersion.class in its 31 entries) and the
// bytes `gradle wrapper` writes differ from the dist's own lib/plugins/gradle-wrapper-<v>.jar
// (measured: 0 of 11 distinct repo hashes match any locally available distribution), so the
// claim can only be anchored upstream — see the opt-in branch below (`MC_SKILL_WRAPPER_UPSTREAM=1`),
// which compares `wrapper-jars.json` 登记的发行包 zipSha256 against
// https://services.gradle.org/distributions/gradle-<v>-bin.zip.sha256.
// 2026-09-15 实测：该主机在本机**可达**（.sha256 端点直出），12/12 在用版本与上游一致；
// 台账 `method.download` 里「services.gradle.org 本机不可达」只对**完整 zip**（307 → github）成立。
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// SCAFFOLD_GATE_ROOT lets the failure branches be proven against a throwaway fixture tree
// instead of mutating the shared worktree.
const ROOT = process.env.SCAFFOLD_GATE_ROOT
  ? path.resolve(process.env.SCAFFOLD_GATE_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLATFORMS = ['fabric', 'forge', 'neoforge', 'quilt', 'liteloader', 'rift', 'modloader', 'bedrock'];
const FILES = ['gradlew', 'gradlew.bat', 'gradle/wrapper/gradle-wrapper.jar',
  'gradle/wrapper/gradle-wrapper.properties', 'build.gradle', 'settings.gradle'];
const MAIN_ENTRY = 'org/gradle/wrapper/GradleWrapperMain.class';

const failures = [];
const infos = [];
let gradlePacks = 0;
/** props 声明的 gradle 版本 → 用到它的档（相对 ROOT），供可选的上游校验逐版本查一次 */
const verToPacks = new Map();

function findScaffoldDir(packDir) {
  const s = path.join(packDir, 'scaffold');
  if (!existsSync(s)) return null;
  const hasBuild = (d) => existsSync(path.join(d, 'build.gradle'));
  if (hasBuild(s)) return s;
  for (const e of readdirSync(s, { withFileTypes: true })) {
    if (e.isDirectory() && hasBuild(path.join(s, e.name))) return path.join(s, e.name);
  }
  return s;
}

function propsVersion(dir) {
  const p = path.join(dir, 'gradle', 'wrapper', 'gradle-wrapper.properties');
  if (!existsSync(p)) return null;
  const m = readFileSync(p, 'utf8').match(/gradle-([0-9][0-9.]*)-(?:bin|all)\.zip/);
  return m ? m[1] : null;
}

function readMeta(p) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    return { __bad: String(e.message) };
  }
}

const packDirs = [];
for (const plat of PLATFORMS) {
  const base = path.join(ROOT, plat);
  if (!existsSync(base)) continue;
  for (const e of readdirSync(base, { withFileTypes: true })) {
    if (e.isDirectory()) packDirs.push(path.join(base, e.name));
  }
  if (existsSync(path.join(base, 'pack.meta.json'))) packDirs.push(base);
}

const jarsOnDisk = [];
for (const dir of packDirs) {
  const metaPath = path.join(dir, 'pack.meta.json');
  if (!existsSync(metaPath)) continue;
  const meta = readMeta(metaPath);
  const rel = path.relative(ROOT, dir).replace(/\\/g, '/');
  if (meta.__bad) { failures.push(`${rel}: pack.meta.json unreadable (${meta.__bad})`); continue; }
  const mode = meta.scaffold?.mode;
  if (mode !== 'gradle') continue;
  gradlePacks++;

  const sc = findScaffoldDir(dir);
  if (!sc) { failures.push(`${rel}: scaffold.mode=gradle but no scaffold/ directory`); continue; }
  const scRel = path.relative(ROOT, sc).replace(/\\/g, '/');

  for (const f of FILES) {
    const abs = path.join(sc, f);
    if (!existsSync(abs)) { failures.push(`${scRel}: missing ${f}`); continue; }
    if (statSync(abs).size === 0) failures.push(`${scRel}: ${f} is empty`);
  }

  const propsV = propsVersion(sc);
  const declared = meta.scaffold.gradle;
  if (!propsV) failures.push(`${scRel}: gradle-wrapper.properties has no parsable distributionUrl version`);
  if (!declared) failures.push(`${scRel}: pack.meta.json has no scaffold.gradle`);
  if (propsV && declared && propsV !== declared) {
    failures.push(`${scRel}: props gradle ${propsV} !== pack.meta scaffold.gradle ${declared}`);
  }
  if (propsV) verToPacks.set(propsV, [...(verToPacks.get(propsV) ?? []), rel]);

  const jarAbs = path.join(sc, 'gradle', 'wrapper', 'gradle-wrapper.jar');
  const jarRel = `${scRel}/gradle/wrapper/gradle-wrapper.jar`;
  if (existsSync(jarAbs)) {
    jarsOnDisk.push(jarRel);
    const buf = readFileSync(jarAbs);
    if (buf[0] !== 0x50 || buf[1] !== 0x4b) failures.push(`${jarRel}: not a ZIP (no PK magic)`);
    else if (!buf.includes(MAIN_ENTRY)) failures.push(`${jarRel}: no ${MAIN_ENTRY} entry — not a Gradle wrapper jar`);
  }
}

if (jarsOnDisk.length) {
  try {
    const tracked = new Set(execFileSync('git', ['-C', ROOT, 'ls-files', '--', ...jarsOnDisk],
      { encoding: 'utf8' }).trim().split('\n').filter(Boolean).map((p) => p.replace(/\\/g, '/')));
    for (const jarRel of jarsOnDisk) {
      if (!tracked.has(jarRel)) failures.push(`${jarRel}: not tracked by git (a clone would lack it)`);
    }
    let ignored = '';
    try {
      ignored = execFileSync('git', ['-C', ROOT, 'check-ignore', '--stdin'],
        { input: jarsOnDisk.join('\n'), encoding: 'utf8' });
    } catch { /* exit 1 = nothing ignored */ }
    for (const p of ignored.trim().split('\n').filter(Boolean)) {
      failures.push(`${p.replace(/\\/g, '/')}: wrapper jar is in a gitignored state`);
    }
  } catch (e) {
    if (String(e.message).includes('not a git repository')) {
      infos.push('git 不可用（fixture 树）→ 跳过 VCS 状态两项检查');
    } else {
      throw e;
    }
  }
}

// ── 可选的上游校验（`MC_SKILL_WRAPPER_UPSTREAM=1`）──────────────────────────────
//
// 本 gate 默认**不主张**「jar 出自 props 版发行版」——理由写在文件头（wrapper jar 内嵌无版本
// 标记、`gradle wrapper` 写的字节也不同于发行包 lib/ 下的同名件）。但这条路是能走通的，
// 只是要外网：`mcp-server/data/wrapper-jars.json` 的 `method.officialCheck` 已写明做法 ——
// 取 `https://services.gradle.org/distributions/gradle-<v>-bin.zip.sha256`（**需跟随 307**）。
//
// 比对对象是台账登记的 `zipSha256`（该版本**发行包本体**的官方 sha256），配合该档
// `jarByteCompareWithZipEntry: true` + `jarEntry`（本仓 jar 与那个 zip 的内层条目逐字节相同），
// 两条合起来才支撑那条主张。所以本支路绿 ≠ 「jar 字节被上游公证」，而是
// 「台账登记的发行包 sha256 == 上游今日发布值 ⇒ 登记没写错/没腐坏」。
//
// 三条纪律：
//   ① opt-in —— 离线 CI 不能因此变红；
//   ② 「主机不可达」与「校验值不一致」**必须分开报**：前者是环境，后者才是缺陷
//      （2026-09-15 实测本机 services.gradle.org 307 → github.com 不可达）；
//   ③ 台账没登记 zipSha256 的档（现为 9.5.1）报 `未登记`，不算通过也不算失败。
/** 跨平台取上游 sha256：win 用 curl.exe，unix 用 curl（GitHub 的 ubuntu runner 只有 curl）。 */
function fetchUpstreamSha256(version) {
  const url = `https://services.gradle.org/distributions/gradle-${version}-bin.zip.sha256`;
  const candidates = process.platform === 'win32' ? ['curl.exe', 'curl'] : ['curl'];
  let why = '';
  for (const exe of candidates) {
    try {
      const got = execFileSync(exe, ['-sSL', '--max-time', '25', url], { encoding: 'utf8', windowsHide: true });
      const m = String(got).match(/\b([0-9a-f]{64})\b/i);
      if (m) return { sha: m[1], via: exe };
      why = `响应里没有 64 位十六进制（${String(got).trim().slice(0, 60)}）`;
    } catch (e) {
      why = String(e.message).split('\n')[0].slice(0, 120);
    }
  }
  return { sha: null, why };
}

if (process.env.MC_SKILL_WRAPPER_UPSTREAM === '1') {
  const wrPath = path.join(ROOT, 'mcp-server', 'data', 'wrapper-jars.json');
  let wr = null;
  try {
    wr = JSON.parse(readFileSync(wrPath, 'utf8'));
  } catch (e) {
    infos.push(`上游校验跳过：读不到 ${wrPath}（${String(e.message).slice(0, 80)}）`);
  }
  if (wr) {
    const versions = [...verToPacks.keys()].sort();
    let ok = 0;
    let unreachable = 0;
    let unregistered = 0;
    for (const v of versions) {
      const rec = wr.jars?.[v];
      const packs = verToPacks.get(v).join(', ');
      if (!rec) {
        infos.push(`上游校验：gradle ${v}（${packs}）在 wrapper-jars.json 里没有条目 ⇒ 未登记`);
        unregistered++;
        continue;
      }
      if (!rec.zipSha256) {
        infos.push(`上游校验：gradle ${v}（${packs}）未登记 zipSha256 ⇒ 无法与上游比对（不算通过）`);
        unregistered++;
        continue;
      }
      const { sha, why } = fetchUpstreamSha256(v);
      if (!sha) {
        // 环境（不可达 / curl 缺失 / 上游没给 64 位十六进制）—— 报事实，不判红
        infos.push(`上游校验：gradle ${v}（${packs}）取不到官方 sha256 ⇒ 主机不可达或响应异常${why ? `（${why}）` : ''}`);
        unreachable++;
        continue;
      }
      if (sha.toLowerCase() !== String(rec.zipSha256).toLowerCase()) {
        failures.push(
          `gradle ${v}（${packs}）: wrapper-jars.json 登记的发行包 zipSha256 ${rec.zipSha256} ≠ 上游 ${sha}` +
            ` ⇒ 登记值写错或上游已改版；该档 jar 的出处主张随之失效，必须重新取证而不是改这个数字`,
        );
        continue;
      }
      ok++;
    }
    infos.push(
      `上游校验（opt-in）：${ok} 档 sha256 与上游一致 / ${unreachable} 档主机不可达 / ${unregistered} 档未登记（共 ${versions.length} 个版本）`,
    );
  }
}

if (process.env.SCAFFOLD_WRAPPER_GATE_INFO === '1' || process.env.MC_SKILL_WRAPPER_UPSTREAM === '1') {
  infos.push(`checked ${gradlePacks} gradle-mode packs / ${jarsOnDisk.length} wrapper jars`);
  for (const i of infos) console.log(`  info: ${i}`);
}

if (failures.length) {
  console.error(`assert-scaffold-wrappers: ${failures.length} mismatch(es)`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `assert-scaffold-wrappers: ok (${gradlePacks} gradle-mode packs, 文件齐 / props⇄meta 同版 / jar 为可用 wrapper 且已跟踪未被忽略)「jar 出自 props 版发行版」默认不主张（需上游校验和=外网）；` +
    `加 MC_SKILL_WRAPPER_UPSTREAM=1 可把 wrapper-jars.json 登记的发行包 zipSha256 与上游逐版本比对（不一致=红，主机不可达=只报 info）`,
);
