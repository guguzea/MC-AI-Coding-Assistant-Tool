// assert-scaffold-wrappers.mjs — W5-4 stage ② gate.
//
// Every version pack whose pack.meta.json declares scaffold.mode === "gradle" must ship a
// self-consistent Gradle wrapper. Checks that can actually fail:
//   1. the four wrapper files + build.gradle + settings.gradle exist and are non-empty
//   2. gradle-wrapper.properties' distributionUrl version === pack.meta scaffold.gradle
//   3. the jar is a ZIP holding org/gradle/wrapper/GradleWrapperMain.class
//   4. the jar is tracked by git and NOT in a gitignored state
// Deliberately NOT checked: "the jar was produced by the props-named distribution".
// A wrapper jar embeds no version marker (measured: no Implementation-Version in
// META-INF/MANIFEST.MF, no org/gradle/util/GradleVersion.class in its 31 entries) and the
// bytes `gradle wrapper` writes differ from the dist's own lib/plugins/gradle-wrapper-<v>.jar
// (measured: 0 of 11 distinct repo hashes match any locally available distribution), so that
// claim is only checkable against upstream published checksums, i.e. with network access.
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

if (process.env.SCAFFOLD_WRAPPER_GATE_INFO === '1') {
  infos.push(`checked ${gradlePacks} gradle-mode packs / ${jarsOnDisk.length} wrapper jars`);
  for (const i of infos) console.log(`  info: ${i}`);
}

if (failures.length) {
  console.error(`assert-scaffold-wrappers: ${failures.length} mismatch(es)`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`assert-scaffold-wrappers: ok (${gradlePacks} gradle-mode packs, 文件齐 / props⇄meta 同版 / jar 为可用 wrapper 且已跟踪未被忽略)「jar 出自 props 版发行版」需上游校验和=外网，本 gate 不主张`);
