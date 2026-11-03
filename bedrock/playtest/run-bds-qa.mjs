#!/usr/bin/env node
/**
 * 基岩版（BDS）真机自测 harness。
 *
 * 作用：把指定行为包装进一份官方 Bedrock Dedicated Server，起服、抓控制台、按 done token
 * 判绿/红，并按仓库统一的证据契约写 `exit-code.txt` / `qa.log` / `state.json` / `console.txt`。
 *
 * 为什么需要它：`generate_playtest_driver` 的覆盖表不含基岩，Java 的 driver/桥也进不去 BDS；
 * BDS 是基岩唯一可无头自动化的官方运行时，没有这套脚本就只能每次手搓。
 *
 * 安全边界（fail-closed）：
 *   - 必须显式授权：`MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`
 *   - BDS 目录与证据目录的 realpath 必须落在授权根内（Windows Junction 由 native realpath 解开）
 *   - 缺 manifest / 缺 script 模块声明的 entry 文件 ⇒ exit 2，**不起服**
 *
 * 不代做：不下载 BDS（EULA 由使用者接受）、不登录客户端、不安装客户端、不上传发布。
 *
 * 用法与证据口径见同目录 README.md。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PACK = path.join(HERE, 'qa-pack');
const ERROR_PATTERNS = [
  /does not contain main file/i,
  /\bERROR\]\s*\[Scripting\]/i,
  /\[ERROR\]\s*\[Scripting\]/i,
  /was not found and was ignored/i,
  /\[QA\]\s*(FAIL|ERROR)/i,
  /LocationInUnloadedChunkError/,
  /Failed to load/i,
];

function abort(code, errorCode, message, extra = {}) {
  console.error(JSON.stringify({ ok: false, code: errorCode, message, ...extra }, null, 2));
  process.exit(code);
}

function parseArgs(argv) {
  const opts = {
    pack: DEFAULT_PACK,
    evidence: null,
    world: 'qa_world',
    doneToken: '[QA] DONE',
    timeoutMs: 120000,
    startupTimeoutMs: 300000,
    port: 29132,
    installName: 'playtest_pack',
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) abort(2, 'INVALID_INPUT', `${arg} 缺少取值`);
      i += 1;
      return value;
    };
    switch (arg) {
      case '--pack': opts.pack = next(); break;
      case '--evidence': opts.evidence = next(); break;
      case '--world': opts.world = next(); break;
      case '--done-token': opts.doneToken = next(); break;
      case '--timeout-ms': opts.timeoutMs = Number(next()); break;
      case '--startup-timeout-ms': opts.startupTimeoutMs = Number(next()); break;
      case '--port': opts.port = Number(next()); break;
      case '--install-name': opts.installName = next(); break;
      case '--help':
      case '-h': opts.help = true; break;
      default: abort(2, 'INVALID_INPUT', `未知参数 ${arg}`);
    }
  }
  if (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs <= 0) abort(2, 'INVALID_INPUT', '--timeout-ms 必须是正数');
  if (!Number.isFinite(opts.startupTimeoutMs) || opts.startupTimeoutMs <= 0) abort(2, 'INVALID_INPUT', '--startup-timeout-ms 必须是正数');
  if (!Number.isInteger(opts.port) || opts.port <= 0 || opts.port > 65534) abort(2, 'INVALID_INPUT', '--port 必须 1–65534');
  for (const [label, value] of [['--world', opts.world], ['--install-name', opts.installName]]) {
    if (!/^[A-Za-z0-9_-]+$/.test(value)) abort(2, 'INVALID_INPUT', `${label} 只允许字母数字下划线连字符`);
  }
  return opts;
}

function realpathOrAbort(target, errorCode, extra = {}) {
  try {
    return fs.realpathSync.native(target);
  } catch (error) {
    abort(2, errorCode, `路径不存在或不可解析：${target}`, { ...extra, cause: String(error) });
  }
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help) {
  console.log(`用法: node bedrock/playtest/run-bds-qa.mjs [options]

  --pack <dir>         行为包目录（含 manifest.json），默认同目录 qa-pack/
  --evidence <dir>     证据目录，默认 <ROOT>/bedrock-playtest/evidence/<runId>/
  --world <name>       BDS 世界名，默认 qa_world（不存在时会新建）
  --done-token <str>   判绿标记，默认 "[QA] DONE"；scaffold 冒烟可传 "[scaffold] world loaded"
  --timeout-ms <n>     起服后等标记的超时，默认 120000
  --startup-timeout-ms <n>  从进程启动到 "Server started" 的超时，默认 300000
  --port <n>           server-port，默认 29132（server-portv6 自动 +1）
  --install-name <s>   装进 behavior_packs 的目录名，默认 playtest_pack

环境变量（必填）:
  MC_SKILL_PLAYTEST_ALLOW=1
  MC_SKILL_PLAYTEST_ROOT=<绝对路径，BDS 与证据都必须在其内>
  MC_SKILL_BDS_DIR=<官方 BDS 解包目录，含 bedrock_server.exe>
`);
  process.exit(0);
}

if (process.env.MC_SKILL_PLAYTEST_ALLOW !== '1') {
  abort(2, 'PLAYTEST_DISABLED', '未授权：设置 MC_SKILL_PLAYTEST_ALLOW=1 后再运行');
}
const rootEnv = process.env.MC_SKILL_PLAYTEST_ROOT;
if (!rootEnv) abort(2, 'PLAYTEST_ROOT_MISSING', '缺少 MC_SKILL_PLAYTEST_ROOT');
const bdsEnv = process.env.MC_SKILL_BDS_DIR;
if (!bdsEnv) abort(2, 'BDS_DIR_MISSING', '缺少 MC_SKILL_BDS_DIR');

const root = realpathOrAbort(path.resolve(rootEnv), 'PLAYTEST_ROOT_NOT_FOUND');
if (!fs.statSync(root).isDirectory()) abort(2, 'PLAYTEST_ROOT_NOT_DIR', `授权根不是目录：${root}`);

function ensureInside(target, errorCode, label) {
  const abs = path.resolve(target);
  const rel = path.relative(root, abs);
  if (rel && (rel.startsWith('..') || path.isAbsolute(rel))) {
    abort(2, errorCode, `${label} 越出授权根`, { target: abs, root });
  }
  let probe = abs;
  while (!fs.existsSync(probe) && path.dirname(probe) !== probe) probe = path.dirname(probe);
  const real = realpathOrAbort(probe, errorCode, { target: abs, root, label });
  const relReal = path.relative(root, real);
  if (relReal && (relReal.startsWith('..') || path.isAbsolute(relReal))) {
    abort(2, errorCode, `${label} 的 realpath 越出授权根`, { target: abs, real, root });
  }
  return abs;
}

const bdsDir = ensureInside(bdsEnv, 'PATH_OUTSIDE_ALLOWLIST', 'MC_SKILL_BDS_DIR');
if (!fs.statSync(bdsDir).isDirectory()) abort(2, 'BDS_DIR_NOT_DIR', `BDS 目录不存在：${bdsDir}`);
const exeCandidates = ['bedrock_server.exe', 'bedrock_server'].map((name) => path.join(bdsDir, name));
const bdsExe = exeCandidates.find((candidate) => fs.existsSync(candidate));
if (!bdsExe) abort(2, 'BDS_EXE_MISSING', `BDS 目录里找不到 bedrock_server.exe：${bdsDir}`);

const packDir = realpathOrAbort(path.resolve(opts.pack), 'PACK_NOT_FOUND');
if (!fs.statSync(packDir).isDirectory()) abort(2, 'PACK_NOT_DIR', `行为包不是目录：${packDir}`);
const manifestPath = path.join(packDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) abort(2, 'MANIFEST_MISSING', `行为包缺 manifest.json：${packDir}`);
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (error) {
  abort(2, 'MANIFEST_INVALID_JSON', `manifest.json 解析失败：${manifestPath}`, { cause: String(error) });
}
const header = manifest && manifest.header;
if (!header || typeof header.uuid !== 'string' || !Array.isArray(header.version)) {
  abort(2, 'MANIFEST_HEADER_INVALID', 'manifest.header 缺少 uuid 或 version 数组');
}
// validate_addon_manifest 只吃 manifest 全文，不检查 entry 文件是否存在；这里补上，避免 BDS 起服后才报错。
const scriptModule = (Array.isArray(manifest.modules) ? manifest.modules : []).find((m) => m && m.type === 'script');
if (scriptModule) {
  if (typeof scriptModule.entry !== 'string' || !scriptModule.entry) {
    abort(2, 'SCRIPT_ENTRY_MISSING', 'script 模块存在但没有 entry');
  }
  const entryPath = path.join(packDir, scriptModule.entry);
  if (!fs.existsSync(entryPath)) {
    abort(2, 'SCRIPT_ENTRY_FILE_MISSING', `script 模块声明的入口文件不存在：${scriptModule.entry}`, {
      packDir,
      entry: scriptModule.entry,
    });
  }
}

const runId = new Date().toISOString().replace(/[:.]/g, '-');
const evidenceDir = ensureInside(
  opts.evidence ? path.resolve(opts.evidence) : path.join(root, 'bedrock-playtest', 'evidence', runId),
  'EVIDENCE_OUTSIDE_ALLOWLIST',
  '证据目录'
);
const worldDir = ensureInside(path.join(bdsDir, 'worlds', opts.world), 'WORLD_OUTSIDE_ALLOWLIST', '世界目录');
const installDir = ensureInside(path.join(bdsDir, 'behavior_packs', opts.installName), 'PACK_INSTALL_OUTSIDE_ALLOWLIST', '行为包安装目录');

// BDS 按 UUID 解析包；同 UUID 装了两份时它会任选一份，证据就指不清对象。
const packsRoot = path.join(bdsDir, 'behavior_packs');
if (fs.existsSync(packsRoot)) {
  const conflicts = [];
  for (const name of fs.readdirSync(packsRoot)) {
    if (name === opts.installName) continue;
    const candidate = path.join(packsRoot, name, 'manifest.json');
    if (!fs.existsSync(candidate)) continue;
    try {
      const other = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (other && other.header && other.header.uuid === header.uuid) conflicts.push(path.join(packsRoot, name));
    } catch {}
  }
  if (conflicts.length) {
    abort(2, 'PACK_UUID_CONFLICT', '同一 UUID 的行为包已装在别的目录，BDS 载入对象不确定；先移除或改名其中一份', {
      uuid: header.uuid,
      conflicts,
    });
  }
}

fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(worldDir, { recursive: true });

const consolePath = path.join(evidenceDir, 'console.txt');
const startedAt = new Date().toISOString();
fs.writeFileSync(consolePath, '', 'utf8');

function copyTree(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) copyTree(path.join(src, name), path.join(dst, name));
    return;
  }
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

function mergeProperties(before, values) {
  const lines = (before ?? '').split(/\r?\n/);
  const seen = new Set();
  const merged = lines.map((line) => {
    const match = /^([^#=]+)=(.*)$/.exec(line);
    if (!match) return line;
    const key = match[1].trim();
    if (!(key in values)) return line;
    seen.add(key);
    return `${key}=${values[key]}`;
  });
  for (const [key, value] of Object.entries(values)) {
    if (!seen.has(key)) merged.push(`${key}=${value}`);
  }
  return `${merged.join('\n').replace(/\n+$/, '')}\n`;
}

const propertiesPath = path.join(bdsDir, 'server.properties');
const packsPath = path.join(worldDir, 'world_behavior_packs.json');
const propertiesBefore = readIfExists(propertiesPath);
const packsBefore = readIfExists(packsPath);

fs.writeFileSync(propertiesPath, mergeProperties(propertiesBefore, {
  'server-name': 'MC Skill Bedrock Playtest',
  'gamemode': 'creative',
  'force-gamemode': 'true',
  'difficulty': 'peaceful',
  'allow-cheats': 'true',
  'max-players': '1',
  'online-mode': 'false',
  'allow-list': 'false',
  'server-port': String(opts.port),
  'server-portv6': String(opts.port + 1),
  'enable-lan-visibility': 'false',
  'level-name': opts.world,
  'content-log-file-enabled': 'false',
}), 'utf8');

fs.rmSync(installDir, { recursive: true, force: true });
copyTree(packDir, installDir);
if (!fs.existsSync(path.join(installDir, 'manifest.json'))) {
  abort(2, 'PACK_COPY_FAILED', `行为包拷贝后缺 manifest.json：${installDir}`);
}
if (scriptModule && !fs.existsSync(path.join(installDir, scriptModule.entry))) {
  abort(2, 'PACK_COPY_FAILED', `行为包拷贝后缺入口文件：${scriptModule.entry}`, { installDir });
}
fs.writeFileSync(
  packsPath,
  JSON.stringify([{ pack_id: header.uuid, version: header.version }], null, 2),
  'utf8'
);

const lines = [];
const errorLines = [];
let buffer = '';
let sawServerStarted = false;
let done = false;
let stopped = false;
let timedOut = false;
let startupTimer = null;
let startTimer = null;
let child = null;
let finished = false;

function stripAnsi(value) {
  return value.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/\r$/, '');
}

function requestStop() {
  if (stopped || !child) return;
  stopped = true;
  try {
    child.stdin.write('stop\n');
  } catch {}
  setTimeout(() => {
    try {
      if (child && child.exitCode === null) child.kill();
    } catch {}
  }, 20000).unref();
}

function onLine(line) {
  lines.push(line);
  fs.appendFileSync(consolePath, `${line}\n`, 'utf8');
  if (line.includes('Server started')) {
    sawServerStarted = true;
    if (startupTimer) clearTimeout(startupTimer);
    if (startTimer) clearTimeout(startTimer);
    startTimer = setTimeout(() => {
      timedOut = true;
      requestStop();
    }, opts.timeoutMs);
    startTimer.unref();
  }
  if (line.includes(opts.doneToken)) {
    done = true;
    if (startTimer) clearTimeout(startTimer);
    setTimeout(requestStop, 300).unref();
  }
  if (ERROR_PATTERNS.some((pattern) => pattern.test(line))) {
    errorLines.push(line);
    if (!done) setTimeout(requestStop, 300).unref();
  }
}

function feed(chunk) {
  buffer += chunk.toString('utf8');
  const parts = buffer.split(/\r?\n/);
  buffer = parts.pop() ?? '';
  for (const part of parts) onLine(stripAnsi(part));
}

function restore() {
  try {
    if (propertiesBefore === null) fs.rmSync(propertiesPath, { force: true });
    else fs.writeFileSync(propertiesPath, propertiesBefore, 'utf8');
  } catch {}
  try {
    if (packsBefore === null) fs.rmSync(packsPath, { force: true });
    else fs.writeFileSync(packsPath, packsBefore, 'utf8');
  } catch {}
}

function finish(exitCode, detail = {}) {
  if (finished) return;
  finished = true;
  if (startupTimer) clearTimeout(startupTimer);
  if (startTimer) clearTimeout(startTimer);
  restore();
  const endedAt = new Date().toISOString();
  const verdict = exitCode === 0 ? 'PASS' : 'FAIL';
  const markers = lines.filter((line) => line.includes(opts.doneToken)
    || /\[QA\]|\[scaffold\]/i.test(line)
    || ERROR_PATTERNS.some((p) => p.test(line)));
  const qaLogPath = path.join(evidenceDir, 'qa.log');
  fs.writeFileSync(qaLogPath, markers.length ? `${markers.join('\n')}\n` : '', 'utf8');
  fs.writeFileSync(path.join(evidenceDir, 'exit-code.txt'), `${exitCode}\n`, 'utf8');
  fs.writeFileSync(path.join(evidenceDir, 'state.json'), JSON.stringify({
    schema: 'mcskill.bedrock.playtest/v1',
    runId,
    verdict,
    exitCode,
    startedAt,
    endedAt,
    doneToken: opts.doneToken,
    sawServerStarted,
    done,
    timedOut,
    errors: errorLines,
    bds: { dir: bdsDir, exe: bdsExe },
    pack: { source: packDir, installedAt: installDir, uuid: header.uuid, version: header.version },
    world: { name: opts.world, dir: worldDir },
    evidenceDir,
    console: consolePath,
    qaLog: qaLogPath,
    ...detail,
  }, null, 2), 'utf8');
  console.log(JSON.stringify({
    ok: exitCode === 0,
    verdict,
    evidenceDir,
    done,
    sawServerStarted,
    timedOut,
    errorCount: errorLines.length,
  }, null, 2));
  process.exit(exitCode);
}

process.on('SIGINT', () => {
  requestStop();
  setTimeout(() => finish(1, { interrupted: true }), 500).unref();
});

child = spawn(bdsExe, [], { cwd: bdsDir, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
child.stdout.on('data', feed);
child.stderr.on('data', feed);
child.on('error', (error) => finish(2, { spawnError: String(error) }));
child.on('exit', (code) => {
  const verdict = done && errorLines.length === 0 ? 0 : 1;
  finish(verdict, { serverExitCode: code ?? null });
});

// BDS 起服可能因 signaling 等待长达数分钟；启动超时与「已起服后等标记」分开计时。
startupTimer = setTimeout(() => {
  timedOut = true;
  requestStop();
}, opts.startupTimeoutMs);
startupTimer.unref();
