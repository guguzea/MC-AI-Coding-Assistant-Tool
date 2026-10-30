/**
 * 共用 javac 定位器（2026-10-30 R2 审计 WP8）。
 *
 * 为什么单开一件：两道 playtest 编译门此前各抄了一份 JDK 发现逻辑 ——
 *   · `assert-playtest-driver-compiles.mjs` 只认死写的 `G:\…` 三条路径（换机器恒 SKIP，
 *     而 SKIP 的打印长得像「没毛病」）；
 *   · `assert-playtest-server-driver-compiles.mjs` 自己扫 `G:\` / Program Files，但**漏了
 *     `JAVA_HOME` 与 `PATH`**，且 `javacMajor` 对 JDK 8 的 `1.8.0_xxx` 只取到 `1`。
 * 合并后两条腿同源：**JAVA_HOME → PATH → 已知安装根递归扫**；主版本解析兼容 `1.8` 老形。
 *
 * 边界：只读本机文件系统、只 spawn `javac -version`；不写盘、不联网、不装 JDK。
 * 找不到就返回空数组 —— 由调用方降级并吼（或带 `--require` 判红），本件不替调用方决定口径。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const EXE = process.platform === "win32" ? "javac.exe" : "javac";

/** 已知安装根（递归找 `<root>/**\/bin/javac`）。只在盘上存在时才扫，扫不到不算错。 */
export const DEFAULT_ROOTS =
  process.platform === "win32"
    ? ["G:\\", "C:\\Program Files\\Java", "C:\\Program Files\\Eclipse Adoptium", "C:\\Program Files\\Microsoft", "D:\\Java"]
    : ["/usr/lib/jvm", "/opt/java", "/opt"];

/** `javac -version` 的主版本。JDK 8 及更早印 `1.8.0_504` ⇒ 8；JDK 9+ 印 `21.0.1` ⇒ 21。 */
export function javacMajor(javac) {
  const r = spawnSync(javac, ["-version"], { encoding: "utf8", windowsHide: true });
  const text = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const m = /javac (\d+)(?:\.(\d+))?/.exec(text);
  if (!m) return 0;
  return m[1] === "1" ? Number(m[2] ?? 0) : Number(m[1]);
}

/**
 * 本机全部 javac，按主版本降序（同 major 保持发现顺序）⇒ `[{ path, major }]`。
 * 发现顺序 = JAVA_HOME → PATH → DEFAULT_ROOTS 递归；同一真实路径去重（Windows 不区分大小写）。
 */
export function findJavacs({ roots = DEFAULT_ROOTS, maxDepth = 4 } = {}) {
  const found = [];
  const seen = new Set();
  const add = (p) => {
    let key;
    try {
      key = fs.realpathSync.native(p);
    } catch {
      key = p;
    }
    if (process.platform === "win32") key = key.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    found.push(p);
  };
  if (process.env.JAVA_HOME) {
    const p = path.join(process.env.JAVA_HOME, "bin", EXE);
    if (fs.existsSync(p)) add(p);
  }
  for (const dir of String(process.env.PATH || "").split(path.delimiter)) {
    if (!dir) continue;
    const p = path.join(dir, EXE);
    if (fs.existsSync(p)) add(p);
  }
  const probe = (dir, depth) => {
    if (depth > maxDepth) return;
    let ents;
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    if (ents.some((e) => e.isFile() && e.name.toLowerCase() === EXE)) {
      add(path.join(dir, EXE));
      return; // 找 javac.exe 的目录就是 JDK 的 bin，不再往下钻
    }
    for (const e of ents) if (e.isDirectory()) probe(path.join(dir, e.name), depth + 1);
  };
  for (const r of roots) if (fs.existsSync(r)) probe(r, 0);
  return found
    .map((p) => ({ path: p, major: javacMajor(p) }))
    .filter((j) => j.major > 0)
    .sort((a, b) => b.major - a.major);
}

/**
 * 为「该档运行期 JDK 主版本」挑一个 javac：优先**精确 major**；否则取满足底线的**最小** major
 * （`--release` 允许更高 JDK 交叉编译，取最小最接近目标）。无候选返回 null。
 */
export function pickJavac(major, { list } = {}) {
  const all = list ?? findJavacs();
  const exact = all.find((j) => j.major === major);
  if (exact) return exact;
  return all.filter((j) => j.major >= major).sort((a, b) => a.major - b.major)[0] ?? null;
}
