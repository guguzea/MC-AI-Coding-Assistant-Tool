#!/usr/bin/env node
/**
 * assert-javadoc-build-provenance — `data/forge_javadoc/**` 的「出处可核 + 落盘形状」门（C2 收口，2026-09-22）。
 *
 * 存在理由（两条都是实测出来的缺陷类，不是假想）：
 *  1. 目录名只有 MC 版本，页面上历史上**没有**构建号 ⇒ 「这份 1.12.2 正文出自 14.23.5.2859 还是别的 build」
 *     只能靠抓取器源码里的钉表反推，语料自身不可证。C2 溯源时逐档核出的正是这条不可核。
 *  2. 旧抓取器把 `package-summary.html` 里的**成员锚点链接**当成类页落盘（`GuiScreen.html#height.md`），
 *     又按 summary 的包而不是 URL 的包建目录 ⇒ 1.12.2 等档里长出 `client/renderer/entity/Entity.md`
 *     这种**索引里有、游戏里没有**的 FQCN，而且它的正文其实是 `entity/Entity.md`。
 *     这两类都通过了当时所有门 —— 因为 `assert-javadoc-index-parity` 只比「盘上 ↔ 索引」双向差，
 *     而期望值与实有值出自同一个生产者，自证。
 *
 * 判据（逐档）：
 *   ① 每页 frontmatter 有 `source:`，且形状为 `<base>/<mc>-<build>/<pkgPath>/<Class>.html`（禁锚点、禁查询串）；
 *   ② 同档内 build 唯一，且等于 `fetch-forge-javadoc.js` 的 `JAVADOC_VERSIONS` 钉值（语料 ↔ 代码双向钉）；
 *   ③ 页的目录 == URL 的包路径（错档即红）；文件名不含 `.html#`（锚点垃圾即红）；
 *   ④ `forgeBuild:` 若出现必须等于该档唯一 build；`fetchedWith:` 若出现必须等于抓取器当前 PRODUCER_REV
 *      —— 历史页可以两个字段都没有（早于 C1/C2），但**不许出现第二个值**（防混 build）；
 *   ⑤ `raw/` 下不得有非 `.md` 文件（写盘抖动留下的 `*.tmp-<pid>` 是整页正文副本，而 `data/` 不 gitignore）。
 *
 * 用法：
 *   node scripts/assert-javadoc-build-provenance.mjs              # 真跑
 *   node scripts/assert-javadoc-build-provenance.mjs --selftest   # 夹具：每种畸形必红 / 干净必绿 / 空档必红
 *   node scripts/assert-javadoc-build-provenance.mjs --list 20    # 附带前 N 条问题样本
 *   node scripts/assert-javadoc-build-provenance.mjs --max-problems=321
 *                                                                  # 存量脏页未清期间的天花板口径：
 *                                                                  # 只许减不许增；清完后去掉本参数恢复严判
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");
/**
 * 判据⑥的比率阈值。分母 = 本档通过形状检查的页数。
 * 实测基线（HEAD 语料，2026-09-22）：六档无正文页 22–27 页 / 档，占 0.74%–1.17%，
 * 全是合法薄页（`ReobfuscationMarker` 标记接口、`CapabilityInject` 注解、`Config` 壳类…）。
 * 2% 留了近一倍的余量。只比率判，不设绝对数阈：本族最大一档 3653 页，
 * 「绝对数超阈但比率没超」要 200 只占 <2% 就得有一万页，不存在这种形状。
 */
export const SHELL_RATIO_MAX = 0.02;

/** 一页有没有正文：既无 ```java 签名块、也无成员列表行、也无 Methods/Fields/Constructors/Elements 小节 ⇒ 空壳。 */
export function isShellPage(text) {
  return !/```java/.test(text) && !/^\s*-\s+`/m.test(text) && !/##\s+(Methods|Fields|Constructors|Elements)/.test(text);
}
const LIST_N = Number(process.argv.find((a) => a.startsWith("--list="))?.split("=")[1] ?? (process.argv.includes("--list") ? 10 : 0));
/**
 * 天花板口径（存量脏页未清期间的半开门）：
 * `--max-problems=N` 覆盖 `DEFAULT_CEILING`；≤ N 时按 0 退出，但**照旧打印实测条数与分档/分类**。
 * 用途不是放行，而是让这道门能在脏页删完之前就先接进默认门链：条数再多一条就当场红。
 */
const MAX_PROBLEMS = process.argv.find((a) => a.startsWith("--max-problems="))?.split("=")[1];
/**
 * 天花板：**0 = 严判**（2026-09-22 c4 重抓 + `--prune-orphans --confirm` 删掉 319 对孤儿后实测）。
 * 历史：本值曾是 319（错档 189 + 锚点垃圾 130），与六档 `_orphan-report.json` 的孤儿数**逐档相等**
 * （9/30/41/73/67/99），两套独立判据互证；那 319 条只能删（新解析器不再产出这些形状）。
 * 留 `--max-problems=` 这条半开门的理由不是存量，而是**未来**：新出现的形状问题必须先归因再改本值，
 * 且 `ceilingVerdict` 的三条自证（超阈红 / 非整数红 / 缺省按本值）保证它不会退化成恒绿。
 */
const DEFAULT_CEILING = 0;

/**
 * 天花板裁决单独成函数，好让自检能投毒它 —— 半开门最坏的失效方式是「静默恒绿」，
 * 所以 `>天花板` / `参数不是整数` / `没给参数` 三条都必须能被判成红。
 * @param {number} count @param {string|undefined} spec @returns {{rc:number,line:string}}
 */
export function ceilingVerdict(count, spec) {
  if (spec === undefined) return { rc: 1, line: "" };
  const ceiling = Number(spec);
  if (!Number.isInteger(ceiling) || ceiling < 0) {
    return { rc: 1, line: `FAIL: --max-problems="${spec}" 不是非负整数 ⇒ 拒绝按天花板放行` };
  }
  if (count > ceiling) return { rc: 1, line: `FAIL(超天花板): ${count} > ${ceiling} ⇒ 存量脏页只许减不许增` };
  return { rc: 0, line: `CEILING: 实测 ${count} ≤ 天花板 ${ceiling}（存量脏页未清，见 ①B；再增即红）` };
}

/** 与 fetch-forge-javadoc.js 同源：钉表从这里读，不再各写一份。 */
async function loadPinned() {
  const src = await import("../scripts/fetch-forge-javadoc.js");
  return { pinnedBuilds: src.JAVADOC_VERSIONS ?? null, producerRev: src.PRODUCER_REV ?? null };
}

/**
 * 文件名 ↔ URL 类名的容许形状。
 *
 * 抓取器在大小写不敏感卷上遇到同包同名抢一个文件名时，后来者拿 `~<shortHash(absUrl)>` 后缀
 * （`fetch-forge-javadoc.js` 的 `planClassWrites`，后缀 1–6 位 36 进制）；类名过长时前缀会被
 * 截到 `MAX_BASENAME`。所以合法形状有三种：原名、`原名~hash`、`原名前缀~hash`。
 * 前缀那条只有 **≥60 字符** 才认 —— 短名一律不许靠"可能是截断"蒙过去，否则 `Entity~x`
 * 就能顶替 `EntityLivingBase`，判据③被自己掏空。
 *
 * @param {string} base 文件名去 `.md` @param {string} urlClass URL 里的类名 @returns {boolean}
 */
export function nameMatchesClass(base, urlClass) {
  if (base === urlClass) return true;
  const at = base.lastIndexOf("~");
  if (at < 0) return false;
  const stem = base.slice(0, at), hash = base.slice(at + 1);
  if (!/^[0-9a-z]{1,6}$/.test(hash)) return false;
  return stem === urlClass || (urlClass.startsWith(stem) && stem.length >= 60);
}

/** 只解析 frontmatter（前若干行 `---` 到 `---`），不整文件扫。 */
export function readFmHead(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return m ? m[1] : "";
}

export function fmValue(fm, key) {
  const m = new RegExp(`^${key}:\\s*"([^"]*)"`, "m").exec(fm);
  return m ? m[1] : null;
}

/**
 * @param {{mcVer:string, expectedBuild:string|null, producerRev:string|null, hasDir?:Function, walk?:Function, read?:Function}} opt
 * @returns {{problems:string[], samples:{file:string,why:string}[], pages:number, builds:string[]}}
 */
export function checkVersionDir({ dir, mcVer, expectedBuild, producerRev, hasDir = existsSync, walk = fsWalk, read = (p) => readFileSync(p, "utf8") }) {
  const problems = [];
  const samples = [];
  const rawDir = join(dir, "raw");
  if (!hasDir(rawDir)) {
    return { problems: [`${mcVer}: 没有 raw 目录 ${rawDir}`], samples, pages: 0, builds: [] };
  }
  const files0 = walk(rawDir);
  // 不用 path.relative()：它在 win32 下按反斜杠归一，夹具喂 posix 路径时会算出垃圾相对路径。
  // 自己按"把 rawDir 前缀切掉 + 统一成正斜杠"来求相对路径，两种分隔符都得同一个结果。
  const rootNorm = rawDir.split("\\").join("/").replace(/\/+$/, "");
  const toRel = (p) => {
    const n = String(p).split("\\").join("/");
    return n.startsWith(rootNorm + "/") ? n.slice(rootNorm.length + 1) : n;
  };
  // **非 .md 残留**必须单列一条判据：`writeWithRetry` 在 rename 失败时会把 `*.tmp-<pid>` 留在 raw/ 里
  // （OneDrive `-4094` 抖动，实测 bedrock 树一轮留了 3 份整页正文副本）。旧实现只走 `.md`，
  // 于是这类文件对整道门完全隐形 —— 而 `data/` 不被 gitignore，它会被原样提交。
  for (const f of files0) {
    if (!f.endsWith(".md")) problems.push(`${mcVer}: raw 下有非 .md 残留（写盘临时件 / 抖动副本）⇒ ${toRel(f)}`);
  }
  const files = files0.filter((f) => f.endsWith(".md"));
  if (!files.length) {
    return { problems: [...problems, `${mcVer}: raw 下一页都没有 ⇒ 空转不算通过`], samples, pages: 0, builds: [] };
  }
  const buildCount = new Map();
  let pages = 0;
  let shells = 0;
  const note = (file, why) => {
    if (samples.length < 400) samples.push({ file: toRel(file), why });
  };

  for (const file of files) {
    // 一律先归一成 posix 再切分：Windows 下 walk 给的是反斜杠路径，
    // 按 "/" 取末段会取到**整个路径** ⇒ 逐页误报（第一版就是这么红的 18078 条）。
    const relToRaw = toRel(file);
    // ③ 文件名不许带锚点形状
    if (/\.html[#?]/.test(relToRaw)) {
      problems.push(`${mcVer}: 锚点垃圾页仍在盘上 ⇒ ${relToRaw}`);
      note(file, "anchor-shaped filename");
      continue;
    }
    const segments = relToRaw.split("/");
    const base = segments[segments.length - 1].replace(/\.md$/, "");
    const pkgPath = segments.slice(0, -1).join("/");
    const text = read(file);
    const fm = readFmHead(text);
    if (isShellPage(text)) shells++;
    const src = fmValue(fm, "source");
    pages++;
    if (!src) {
      problems.push(`${mcVer}: 页面无 source: ⇒ 出处不可核 ${relToRaw}`);
      note(file, "no source:");
      continue;
    }
    let url;
    try {
      url = new URL(src);
    } catch {
      problems.push(`${mcVer}: source 不是合法 URL ⇒ ${src.slice(0, 90)}（${relToRaw}）`);
      continue;
    }
    if (url.hash || !url.pathname.endsWith(".html")) {
      problems.push(`${mcVer}: source 带锚点或非类页形状 ⇒ ${src.slice(0, 90)}（${relToRaw}）`);
      note(file, "anchor/query in source");
      continue;
    }
    // ① URL 形状：.../javadoc/forge/<mc>-<build>/<pkgPath>/<Class>.html
    const m = /\/(\d[^/]*)-((?:\d+\.){2,}\d+(?:-[A-Za-z0-9.]+)?)\/(.+)\/([^/]+)\.html$/.exec(url.pathname);
    if (!m) {
      problems.push(`${mcVer}: source 形状不含 <mc>-<build>/<pkg>/<Class>.html ⇒ ${src.slice(0, 110)}（${relToRaw}）`);
      note(file, "unparsed source shape");
      continue;
    }
    const [, urlMc, build, urlPkg, urlClass] = m;
    if (urlMc !== mcVer) {
      problems.push(`${mcVer}: source 的 MC 版本是 ${urlMc} ⇒ 混档 ${relToRaw}`);
      continue;
    }
    if (!nameMatchesClass(base, urlClass)) {
      problems.push(`${mcVer}: 文件名 ${base} 与 source 的类名 ${urlClass} 不符 ⇒ ${relToRaw}`);
      continue;
    }
    // ③ 目录 == URL 包
    if (urlPkg !== pkgPath) {
      problems.push(`${mcVer}: 错档 —— 目录包 ${pkgPath || "(根)"} ≠ URL 包 ${urlPkg} ⇒ ${relToRaw}`);
      note(file, "misfiled package");
      continue;
    }
    buildCount.set(build, (buildCount.get(build) ?? 0) + 1);
    // ④ 可选字段出现即须一致
    const fb = fmValue(fm, "forgeBuild");
    if (fb && fb !== build) {
      problems.push(`${mcVer}: forgeBuild "${fb}" ≠ source URL 的 build "${build}" ⇒ ${relToRaw}`);
    }
    const fw = fmValue(fm, "fetchedWith");
    if (fw && producerRev && fw !== producerRev) {
      problems.push(`${mcVer}: fetchedWith "${fw}" 不是抓取器当前 PRODUCER_REV "${producerRev}" ⇒ ${relToRaw}`);
    }
  }

  // ⑥ 整版「无正文率」：单页薄是合法的（标记接口 / 注解 / 只挂嵌套类的壳类，实测 145 页），
  //     但**比率**超阈值只能是解析器读不懂这套 HTML ⇒ 从"静默刷空"变成当场红。
  //     事故实据：2026-09-22 一次 `--force` 把 17772/18079 页写成 288 字节空壳，全部门当时是绿的。
  const shellRatio = pages ? shells / pages : 0;
  if (shellRatio > SHELL_RATIO_MAX) {
    problems.push(`${mcVer}: 无正文页 ${shells}/${pages}（${(shellRatio * 100).toFixed(2)}%）越过比率阈 ${Math.round(SHELL_RATIO_MAX * 100)}%⇒ 抓取器解析形状失配，整版已被刷成空壳`);
  }

  const builds = [...buildCount.entries()].sort((a, b) => b[1] - a[1]);  if (builds.length > 1) {
    problems.push(`${mcVer}: 一档内出现 ${builds.length} 个构建号（混 build ⇒ 索引里的签名不再自洽）⇒ ${builds.map(([b, n]) => `${b}:${n}`).join(" ")}`);
  }
  if (expectedBuild && builds.length && builds[0][0] !== expectedBuild) {
    problems.push(`${mcVer}: 盘上构建号 ${builds[0][0]} ≠ fetch-forge-javadoc.js 钉的 ${expectedBuild}`);
  }
  // 聚合成一条：problems 过多时先给总数，避免刷屏把真信号埋掉
  const uniq = [...new Set(problems)];
  return { problems: uniq, samples: samples.slice(0, LIST_N || 5), pages, shells, builds: builds.map(([b]) => b) };
}

function fsWalk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) fsWalk(p, acc);
    else acc.push(p);          // 不按 .md 过滤：非 .md 残留本身就是本门要抓的一类
  }
  return acc;
}

async function realRun() {
  const root = join(DATA_ROOT, "forge_javadoc");
  if (!existsSync(root)) {
    console.error(`FAIL: 缺 ${root}`);
    return 1;
  }
  const { pinnedBuilds, producerRev } = await loadPinned();
  if (!pinnedBuilds || !pinnedBuilds.length) {
    console.error("FAIL: 读不到 fetch-forge-javadoc.js 的 JAVADOC_VERSIONS 钉表 ⇒ 无法核 build，本门拒绝空转放行");
    return 1;
  }
  const pinned = new Map(pinnedBuilds.map((v) => [v.mcVersion, v.forgeVersion]));
  const dirs = readdirSync(root).filter((d) => /^\d/.test(d) && existsSync(join(root, d, "raw")));
  const problems = [];
  const samples = [];
  let totalPages = 0, totalShells = 0;
  for (const mcVer of dirs) {
    const r = checkVersionDir({ dir: join(root, mcVer), mcVer, expectedBuild: pinned.get(mcVer) ?? null, producerRev });
    totalPages += r.pages;
    totalShells += r.shells;
    if (!r.problems.length) {
      console.log(`  ok ${mcVer}: ${r.pages} 页（无正文 ${r.shells}，${((r.shells / (r.pages || 1)) * 100).toFixed(2)}%）· build ${r.builds.join(",")}${pinned.has(mcVer) ? "" : "（钉表无此档）"}`);
    } else {
      problems.push(...r.problems);
      if (LIST_N) r.samples.forEach((s) => samples.push(`      ${s.file} ← ${s.why}`));
    }
  }
  const KINDS = [
    ["错档（目录包 ≠ URL 包）", /错档/],
    ["锚点垃圾页", /锚点垃圾/],
    ["无正文率超阈（解析失配）", /无正文页/],
    ["raw 下非 .md 残留", /非 \.md 残留/],
    ["文件名与类名不符", /文件名 .* 与 source 的类名/],
    ["页面无 source", /页面无 source/],
    ["source 非法/形状不对", /source 不是合法 URL|source 带锚点|source 形状不含/],
    ["source 混档（URL 里是别版）", /source 的 MC 版本是/],
    ["forgeBuild ≠ source", /forgeBuild .* ≠ source/],
    ["fetchedWith 过期", /fetchedWith .* 不是抓取器/],
    ["一档混 build", /混 build/],
    ["build ≠ 钉表", /≠ fetch-forge-javadoc\.js 钉的/],
  ];
  const byKind = new Map(), byVer = new Map();
  for (const line of problems) {
    const ver = line.split(":")[0];
    byVer.set(ver, (byVer.get(ver) ?? 0) + 1);
    const hit = KINDS.find(([, re]) => re.test(line));
    const k = hit ? hit[0] : "其他";
    byKind.set(k, (byKind.get(k) ?? 0) + 1);
  }
  const unpin = [...pinned.keys()].filter((v) => !dirs.includes(v));
  if (unpin.length) console.log(`  注：钉表里的 ${unpin.join(", ")} 在盘上没有对应目录（未抓 / 已删）`);
  if (problems.length) {
    console.error(`FAIL: ${problems.length} 条`);
    // 先给形状再给明细：几百条平铺会把「哪一档、哪一类」这两条主信号埋掉。
    console.error(`  分档：${[...byVer].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}=${n}`).join(" · ")}`);
    console.error(`  分类：${[...byKind].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}=${n}`).join(" · ")}`);
    const show = Math.max(60, LIST_N);
    problems.slice(0, show).forEach((p) => console.error(`  - ${p}`));
    if (problems.length > show) console.error(`  …另 ${problems.length - show} 条（加 --list=200 看更多）`);
    samples.forEach((s) => console.error(s));
    const v = ceilingVerdict(problems.length, MAX_PROBLEMS ?? String(DEFAULT_CEILING));
    if (v.line) console.error(v.line);
    return v.rc;
  }
  console.log(`PASS: ${dirs.length} 档 forge_javadoc · 共 ${totalPages} 页（无正文 ${totalShells}，${((totalShells / (totalPages || 1)) * 100).toFixed(2)}%），出处可核、构建号唯一、落盘形状与 URL 一致`);
  return 0;
}

/**
 * 夹具全部走注入（hasDir / walk / read），一处真文件系统都不碰。
 * 每个红例还须**红在该当的原因**上：只判"变红了"的自检是假门 —— 第一版就是这样，
 * 11 例里 10 例都红在 `没有 raw 目录` 这条无关判据上，全绿却什么都没核。
 */
function selfTest() {
  const pin = "14.23.5.2859";
  const pkg = "net/minecraft/entity";
  const good = (name, pkgPath = pkg, build = pin, mc = "1.12.2", extra = "") =>
    `---\ntitle: "${name}"\npackage: "${pkgPath}"\nversion: "${mc}"\nsource: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/${mc}-${build}/${pkgPath}/${name}.html"${extra}\nsourceType: javadoc\n---\n\n# ${name}\n\n## Methods\n\n- \`void ${name}doThing()\`\n`;
  /** 只有 frontmatter + 标题 = 判据⑥眼里的空壳（抓取器解析失败的落盘形状）。 */
  const shell = (name, pkgPath = pkg) =>
    `---\ntitle: "${name}"\npackage: "${pkgPath}"\nsource: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-${pin}/${pkgPath}/${name}.html"\n---\n\n# ${name}\n`;
  const files = {
    [`${pkg}/Entity.md`]: good("Entity"),
    [`${pkg}/EntityLiving.md`]: good("EntityLiving", pkg, pin, "1.12.2", "\nforgeBuild: \"" + pin + "\"\nfetchedWith: \"c2-2026-09-21\""),
  };
  const run = (map, opt = {}) =>
    checkVersionDir({
      dir: "/v",
      mcVer: "1.12.2",
      expectedBuild: pin,
      producerRev: "c2-2026-09-21",
      hasDir: () => true,
      walk: () => Object.keys(map).map((k) => "/v/raw/" + k),
      // 夹具自己的读法也要分隔符无关，否则反斜杠用例会被夹具误判成"无 source"
      read: (p) => map[String(p).split("\\").join("/").replace(/^.*?\/raw\//, "")],
      ...opt,
    });
  const cases = [
    ["干净集合应放行", files, null],
    ["缺 source 必红", { [`${pkg}/A.md`]: "---\ntitle: \"A\"\n---\n\n# A\n" }, /无 source/],
    ["锚点文件名必红", { [`${pkg}/GuiScreen.html#height.md`]: good("GuiScreen.html#height") }, /锚点垃圾页/],
    ["source 带锚点必红", { [`${pkg}/GuiScreen.md`]: `---\nsource: "https://x/javadoc/forge/1.12.2-${pin}/${pkg}/GuiScreen.html#height"\n---\n` }, /带锚点/],
    ["错档（目录包 ≠ URL 包）必红", { ["net/minecraft/client/renderer/entity/Entity.md"]: good("Entity") }, /错档/],
    ["混 build 必红", { [`${pkg}/A.md`]: good("A", pkg, pin), [`${pkg}/B.md`]: good("B", pkg, "14.23.5.2860") }, /个构建号/],
    ["build 与钉表不符必红", files, /≠ fetch-forge-javadoc.js 钉的/, { expectedBuild: "14.23.5.9999" }],
    ["文件名与 URL 类名不符必红", { [`${pkg}/Other.md`]: good("Entity") }, /与 source 的类名/],
    ["fetchedWith 出现但不是当前值必红", { [`${pkg}/A.md`]: good("A", pkg, pin, "1.12.2", "\nfetchedWith: \"c0-旧生产者\"") }, /fetchedWith/],
    ["forgeBuild 与 URL build 不符必红", { [`${pkg}/A.md`]: good("A", pkg, pin, "1.12.2", "\nforgeBuild: \"9.9.9.9\"") }, /forgeBuild/],
    ["跨 MC 版本的 source 必红（混档）", { [`${pkg}/A.md`]: `---\nsource: "https://x/javadoc/forge/1.7.10-10.13.4.1614/${pkg}/A.html"\n---\n` }, /MC 版本是 1.7.10/],
    ["source 缺构建号段时不得放行", { [`${pkg}/A.md`]: "---\nsource: \"https://x/javadoc/forge/1.12.2/net/minecraft/entity/A.html\"\n---\n" }, /形状不含/],
    ["source 非 .html 结尾必红", { [`${pkg}/A.md`]: "---\nsource: \"https://x/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/A\"\n---\n" }, /非类页形状/],
    ["零页不得空转放行", {}, /一页都没有/],
    // 判据⑥：比率腿。整版空壳必红；零星薄页（标记接口 / 注解）不得判红。
    ["整版空壳必红（解析器失配形状）", Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`${pkg}/C${i}.md`, shell("C" + i)])), /无正文页/],
    ["60 页里 1 页薄不得判红", Object.fromEntries([...Array.from({ length: 60 }, (_, i) => [`${pkg}/G${i}.md`, good("G" + i)]), [`${pkg}/Thin.md`, shell("Thin")]]), null],
    // 写盘抖动的 `.tmp-<pid>` 副本整页正文留在 raw/ 里；旧实现的 walk 只收 .md ⇒ 这类文件全门隐形。
    ["raw 下的非 .md 残留必红", { ...files, [`${pkg}/Entity.md.tmp-12345`]: "半截正文" }, /非 \.md 残留/],
    ["只有残留没有正文 ⇒ 两条都报", { [`${pkg}/A.md.tmp`]: "x" }, /一页都没有/],
    // 生产在 win32 上走的是 path.join ⇒ 反斜杠路径；夹具只喂正斜杠就会放过一整类分隔符缺陷
    ["反斜杠路径与正斜杠同判", files, null, {
      walk: () => Object.keys(files).map((k) => join(join("/v", "raw"), ...k.split("/"))),
    }],
    ["注入失效（拿不到 raw）必红", files, /没有 raw 目录/, { hasDir: () => false }],
  ];
  let failed = 0;
  for (const [name, map, wantRe, opt] of cases) {
    const r = run(map, opt || {});
    let ok;
    if (wantRe === null) ok = r.problems.length === 0;
    else ok = r.problems.some((p) => wantRe.test(p));
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${name}（期望 ${wantRe === null ? "绿" : "红于 " + wantRe}，实得 ${r.problems.length ? r.problems[0].slice(0, 96) : "绿"}）`);
  }
  if (failed) {
    console.error(`SELFTEST FAIL: ${failed}/${cases.length}`);
    return 1;
  }
  // 天花板裁决自己的投毒例：半开门的失效不会体现在上面那 16 组夹具里。
  const vcases = [
    ["没给 --max-problems ⇒ 非零即红", ceilingVerdict(3, undefined), 1],
    ["条数超天花板必红", ceilingVerdict(322, "321"), 1],
    ["条数等于天花板放行", ceilingVerdict(321, "321"), 0],
    ["条数低于天花板放行（只减不增）", ceilingVerdict(100, "321"), 0],
    ["参数是 0 时非零必红（清完就恢复严判）", ceilingVerdict(1, "0"), 1],
    ["参数不是整数 ⇒ 拒绝放行", ceilingVerdict(1, "abc"), 1],
    ["参数是负数 ⇒ 拒绝放行", ceilingVerdict(0, "-5"), 1],
  ];
  for (const [name, got, want] of vcases) {
    const ok = got.rc === want;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${name}（期望 rc=${want}，实得 rc=${got.rc}）`);
  }
  if (failed) {
    console.error(`SELFTEST FAIL(天花板腿): ${failed}/${cases.length + vcases.length}`);
    return 1;
  }
  // 判据③自己的形状表：碰撞后缀是合法产物，但"前缀算截断"这条不许被滥用。
  const LONG60 = "A".repeat(61);
  const shapes = [
    ["Entity", "Entity", true],
    ["Entity~ab12cd", "Entity", true],
    ["Entity~ABCDEF", "Entity", false],          // 后缀是 36 进制小写，大写即非本抓取器产物
    ["Entity~toolonghash", "Entity", false],
    ["EntityLiving~ab12cd", "EntityLivingBase", false],  // 短名不许靠"可能截断"顶替
    [`${LONG60}~ab12cd`, LONG60 + "Rest", true],         // 只有 ≥60 的前缀才认截断
    ["Other~ab12cd", "Entity", false],
    ["Entity", "Entity~ab12cd", false],
  ];
  for (const [base, cls, want] of shapes) {
    const got = nameMatchesClass(base, cls);
    if (got !== want) {
      failed++;
      console.log(`FAIL 文件名形状 ${base} vs ${cls}（期望 ${want}，实得 ${got}）`);
    }
  }
  if (failed) {
    console.error(`SELFTEST FAIL: ${failed} 例（夹具 / 天花板 / 形状三腿合计）`);
    return 1;
  }
  console.log(
    `SELFTEST PASS: ${cases.length} 组夹具 + ${vcases.length} 例天花板投毒 + ${shapes.length} 例文件名形状（含碰撞后缀合法 / 截断不许滥用）`,
  );
  return 0;
}

if (SELFTEST) process.exitCode = selfTest();
else process.exitCode = await realRun();
