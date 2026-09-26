#!/usr/bin/env node
/**
 * assert-rule-java-shapes.mjs —— 规则树 ```java 示例的「形状」门（W3-2，2026-09-21）。
 *
 * 背景（2026-09-21 复现）：`forge/{1.17.1,1.18.2,1.19.4,1.20.1,1.20.4}/.cursor/rules/10-gui.mdc`
 * 的示例写 `super(MY_MENU_TYPE.get(), windowId)`，而**同一文件**声明的是 `MY_MENU`
 * （`MY_MENU_TYPE` 全档不存在）⇒ 5 档 × 7 宿主镜像 = 35 个位点照抄编译不过；
 * `forge/1.15.2` 的 `super(null, windowId)` 把 null 当 MenuType 传。这几种「Java 形状」
 * 此前没有任何门能判红（assert-rule-internal-refs 只查文档锚点，不解析 Java）。
 *
 * 扫描范围 = **源稿两腿**（5 宿主/7 宿主镜像由 assert-skill-mirrors 保证与源稿同态，故此处只扫一份，
 * 避免 7 倍重复告警）：
 *   腿 1 `各平台/<版本>/.cursor/rules/*.mdc` —— Java 档（forge / fabric / neoforge / quilt /
 *        liteloader / rift / modloader）
 *   腿 2 `各平台/.cursor/rules/*.mdc` —— **平台根档**。bedrock 没有版本号层，它的 11 条规则只住
 *        在 `bedrock/.cursor/rules/`（实测 2026-09-23：腿 1 采 bedrock = 0 件）。
 *        本门 2026-09-21 建时只写腿 1，于是 `PLATFORMS` 里声明的 `bedrock` 是**假覆盖**
 *        （注释自称扫它、采集面采不到）⇒ 腿 2 于 2026-09-23 补上，并由 `evaluateFloor()` 的
 *        「声明平台采 0 ⇒ [FLOOR-COLLECTOR] 红」反向钉住，不让它再退化成注释假话。
 *   skills 面（`.cursor/skills/**`）仍**不在**本门采集面，由别的门/人工核（见 scout 报告 B5）。
 *
 * 判据：
 *   A. 围栏内禁止 `super(null, ...)` —— MenuType/Container 构造实参不得为 null。
 *   B. 围栏内 `<X>.get()` / `<Qual>.<X>.get()` 的**末段标识符**若形如仓库自有的示例常量
 *      （`^MY_[A-Z0-9_]+$`，如 MY_MENU / MY_MENU_TYPE / MY_CONTAINER），则必须在**同文件**有声明
 *      （`X =` 或 `class X`）—— 否则视为「引用了未声明标识符」。
 *      只认 `MY_*` 前缀是为了零误报：`BuiltInRegistries.BLOCK.get(...)` 这类原版注册表调用不在此列。
 *   C. 围栏内 `new <Cls>(...)` 的实参个数，若同文件定义了 `<Cls>(...)` 构造，必须相等
 *      （覆盖 `forge/1.16.5` 的 4 参 `new MyContainer(id, inv, world, pos)` vs 3 参定义）。
 *
 * 采集面地板（R47，2026-09-23 补；形状照抄同仓 `assert-forge-blockshape-family.mjs` 的
 * `[FLOOR-COLLECTOR]` / `[FLOOR-LOW]` + 无条件汇总行）：
 *   - 采到 0 份 ⇒ `[FLOOR-COLLECTOR]`（**采集器失效**，不是「代码干净」）
 *   - 声明的 8 个平台里任一处 0 件 ⇒ `[FLOOR-COLLECTOR]`（假覆盖复发即红）
 *   - 实扫 < `FLOOR_SCANNED` ⇒ `[FLOOR-LOW]`。地板是**下界 `<`，不是等式 `===`** ⇒ 正常新增规则
 *     只会抬高计数、不会假红；只有删档 / 收窄过滤器才会红。
 *   - 汇总行**无条件**打印「扫文件 / 判行 / 拒 / 采集面 / 地板」，绿路径也打。
 *
 * 退出码：有任何一条 ⇒ 1；`--selftest` 用内存样例 + 真根采集器自证（畸形必红 + 真实输入正对照）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

/** 声明采集面。**每一项都必须真采到 > 0**，否则 `evaluateFloor()` 报假覆盖（bedrock 曾是此形）。 */
const PLATFORMS = ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"];

/**
 * 地板（下界）= 2026-09-23 两腿实扫 = 腿 1 的 506 份 + 腿 2 的 bedrock 根 11 份 = 517 份
 * （逐档：forge 125 / fabric 154 / neoforge 110 / quilt 40 / liteloader 33 / rift 11 /
 *   modloader 33 / bedrock 11；判行 51540）。口径 = `collectRuleFiles()` 实采的
 * `<平台>[/<版本>]/.cursor/rules/*.mdc` 文件数，不含 skills、不含 7 宿主投影、不含 scaffold。
 */
const FLOOR_SCANNED = 517;

/** 抽出围栏块（``` 成对）内容。 */
export function fencedBlocks(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let inFence = false;
  let buf = [];
  for (const l of lines) {
    if (/^\s*```/.test(l)) {
      if (inFence) {
        out.push(buf.join("\n"));
        buf = [];
        inFence = false;
      } else {
        inFence = true;
      }
      continue;
    }
    if (inFence) buf.push(l);
  }
  return out;
}

/** 数实参个数（顶层逗号分割；`<`/`>` 只在与括号配对时按泛型深度处理）。 */
function argCount(inner) {
  let paren = 0;
  let angle = 0;
  let n = 0;
  let hasAny = false;
  for (const ch of inner) {
    if (ch === "(") paren++;
    else if (ch === ")") paren--;
    else if (ch === "<") angle++;
    else if (ch === ">") angle = Math.max(0, angle - 1);
    else if (ch === "," && paren === 0 && angle === 0) n++;
    if (!/\s/.test(ch)) hasAny = true;
  }
  return hasAny ? n + 1 : 0;
}

/** 取从头开始的配对括号内容（`i` 指向 `(`）。返回 { inner, end } 或 null。 */
function balanced(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "(") depth++;
    else if (s[j] === ")") {
      depth--;
      if (depth === 0) return { inner: s.slice(i + 1, j), end: j };
    }
  }
  return null;
}

export function checkRuleText(rel, text) {
  const errs = [];
  const blocks = fencedBlocks(text);

  // 判据 A + B
  blocks.forEach((b, i) => {
    if (/super\(\s*null\s*,/.test(b)) {
      errs.push(`${rel}: 围栏块#${i + 1} 出现 super(null, ...) —— 构造实参不得为 null（应传本档注册对象）`);
    }
  });

  // 判据 B（收紧版，2026-09-21）：只报「**近似名不一致**」——W3-2 的真形态是同一文件里
  // 声明 `MY_MENU`、却写 `MY_MENU_TYPE.get()`。占位符（`MY_ITEM.get()` 指代用户自己的注册对象、
  // 本文件不声明）**不报**，否则规则树的片段式示例会全面误红。
  const decls = [...new Set([...text.matchAll(/\b(MY_[A-Z0-9_]+)\s*=/g)].map((m) => m[1]))];
  // 只认**裸名** `MY_X.get()`：`Qual.MY_X.get()` 是跨类/跨文件限定引用（声明不在本文件，合法），
  // 例如 `ModBlockEntities.MY_BLOCK_ENTITY.get()`。W3-2 的真身 `MY_MENU_TYPE.get()` 正是裸名。
  const used = [
    ...new Set([...blocks.join("\n").matchAll(/(?<![.\w])(MY_[A-Z0-9_]+)\.get\(\)/g)].map((m) => m[1])),
  ];
  for (const u of used) {
    if (decls.includes(u)) continue;
    const near = decls.find((d) => u.startsWith(d + "_") || d.startsWith(u + "_"));
    if (near) {
      errs.push(
        `${rel}: 使用了 \`${u}.get()\`，但本文件声明的是 \`${near}\` —— 标识符写错（近似名不一致，照抄编译不过）`,
      );
    }
  }

  // 判据 C：new <Cls>(...) 与同文件 <Cls>(...) 定义的形参个数比对（**支持重载**：
  // 同一类可有多个构造，实参个数命中任一重载即绿）。
  const full = blocks.join("\n");
  const defs = new Map();
  for (const m of full.matchAll(/public\s+([A-Z][A-Za-z0-9_]*)\s*\(/g)) {
    const name = m[1];
    const p = full.indexOf("(", m.index + `public ${name}`.length);
    const bal = balanced(full, p);
    if (!bal) continue;
    if (!defs.has(name)) defs.set(name, new Set());
    defs.get(name).add(argCount(bal.inner));
  }
  for (const m of full.matchAll(/new\s+([A-Z][A-Za-z0-9_]*)\s*\(/g)) {
    const name = m[1];
    if (!defs.has(name)) continue;
    const p = full.indexOf("(", m.index + `new ${name}`.length);
    const bal = balanced(full, p);
    if (!bal) continue;
    const got = argCount(bal.inner);
    const want = defs.get(name);
    if (!want.has(got)) {
      errs.push(
        `${rel}: \`new ${name}(...)\` 传 ${got} 参，但同文件 \`${name}(...)\` 的重载形参个数为 [${[...want].join(", ")}] —— 构造调用与定义不匹配`,
      );
    }
  }

  // 判据 D：`<Factory>.create(<Cls>::new)` 的方法引用必须与工厂的函数式接口契约相容 ——
  // `IForgeContainerType.create` / `IForgeMenuType.create` 的第三参是 **PacketBuffer / FriendlyByteBuf**，
  // 不是 `IInteractionObject` 之类。W3-2 最初只修了 `super(...)`，1.15.2 的构造第三参仍是
  // `IInteractionObject` ⇒ 方法引用编译不过，而旧三类形状都抓不到。
  for (const m of full.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*\.\s*create\s*\(\s*([A-Z][A-Za-z0-9_]*)\s*::\s*new\s*\)/g)) {
    const factory = m[1];
    const cls = m[2];
    if (!/^(?:I[A-Za-z]*Type|I[A-Za-z]*Factory)$/.test(factory)) continue;
    const ctor = new RegExp(`public\\s+${cls}\\s*\\(([^)]*)\\)`).exec(full);
    if (!ctor) continue;
    const params = ctor[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (params.length < 3) continue; // 2 参工厂（无 buf 的代）不在本判据内
    const third = params[2].split(/\s+/)[0].replace(/<.*$/, "");
    if (!/^(?:PacketBuffer|FriendlyByteBuf|RegistryFriendlyByteBuf)$/.test(third)) {
      errs.push(
        `${rel}: \`${factory}.create(${cls}::new)\` 的工厂契约第三参是 PacketBuffer/FriendlyByteBuf，` +
          `但 \`${cls}\` 构造第三参是 \`${third}\` —— 方法引用与函数式接口签名不符（编译不过）`,
      );
    }
  }

  return errs;
}

/**
 * 采集面两腿（见头注）：腿 1 = `<平台>/<版本>/.cursor/rules`，腿 2 = `<平台>/.cursor/rules`。
 * 返回 `{ files, perPlatform }`，`perPlatform` 按 `PLATFORMS` 逐平台计**实采文件数**
 * （= 汇总行「采集面」，也是 `evaluateFloor()` 的假覆盖判据）。
 */
export function collectRuleFiles(root = REPO) {
  const files = [];
  const perPlatform = {};
  for (const plat of PLATFORMS) {
    const base = path.join(root, plat);
    if (!fs.existsSync(base)) continue;
    const dirs = [path.join(base, ".cursor", "rules")]; // 腿 2：平台根档（bedrock 的唯一入口）
    for (const ver of fs.readdirSync(base)) dirs.push(path.join(base, ver, ".cursor", "rules")); // 腿 1
    const seen = new Set();
    for (const d of dirs) {
      if (!fs.existsSync(d)) continue;
      if (!fs.statSync(d).isDirectory()) continue;
      for (const f of fs.readdirSync(d)) {
        if (!f.endsWith(".mdc")) continue;
        const p = path.join(d, f);
        if (seen.has(p)) continue;
        seen.add(p);
        files.push(p);
        perPlatform[plat] = (perPlatform[plat] || 0) + 1;
      }
    }
  }
  return { files, perPlatform };
}

/** 采集面地板（R47）。纯函数：`{ scanned, perPlatform, floor }` ⇒ 红码数组（空 = 绿）。 */
export function evaluateFloor({ scanned, perPlatform, floor }) {
  const errs = [];
  const faceSum = PLATFORMS.reduce((s, p) => s + (perPlatform[p] || 0), 0);
  const stray = Object.keys(perPlatform).filter((k) => !PLATFORMS.includes(k));
  if (stray.length) errs.push(`[FLOOR-COLLECTOR] 采集面出现未声明平台 ${stray.join(", ")} —— 计数桶与 PLATFORMS 不自洽`);
  if (faceSum !== scanned) {
    errs.push(`[FLOOR-COLLECTOR] 分母不自洽：采集面合计 ${faceSum} ≠ 实扫 ${scanned} —— 有文件采到却没记账，计数器不可信`);
  }
  if (scanned === 0) {
    errs.push(
      `[FLOOR-COLLECTOR] 采到 0 份 —— 这是**采集器失效**（路径形状改坏 / 平台树被搬走 / 后缀过滤器收窄），` +
        `**不是**代码干净（地板 ${floor}；两腿 = <平台>/<版本>/.cursor/rules/*.mdc + <平台>/.cursor/rules/*.mdc）`,
    );
    return errs;
  }
  if (scanned < floor) {
    errs.push(
      `[FLOOR-LOW] 实扫 ${scanned} 份 < 地板 ${floor} —— 扫描面缩水（删档 / 挪档 / 过滤器收窄）。` +
        `地板是下界不是等式 ⇒ 正常新增不会红，红了就真是少了一批`,
    );
  }
  const missing = PLATFORMS.filter((p) => (perPlatform[p] || 0) === 0);
  if (missing.length) {
    errs.push(
      `[FLOOR-COLLECTOR] PLATFORMS 声明了 ${PLATFORMS.length} 个平台，但 ${missing.join(", ")} 采到 0 件 —— ` +
        `注释自称覆盖它、采集面没有它 = **假覆盖**（2026-09-23 前的 bedrock 正是此形；要么补采集腿，要么把它从 PLATFORMS 删掉并说明由谁 policing）`,
    );
  }
  return errs;
}

/** R47 汇总行（绿/红两条路径都打）。 */
function summaryLine({ scanned, judged, rejected, perPlatform, floor }) {
  const face = PLATFORMS.map((p) => `${p}=${perPlatform[p] || 0}`).join(" ");
  return `扫文件 ${scanned} / 判行 ${judged} / 拒 ${rejected} / 采集面[${face}] / 地板 ${floor}（下界 <）`;
}

// ── selftest：内存样例（畸形必红 + 正对照） ────────────────────────────────
const SELFTEST_CASES = [
  ["未声明标识符（W3-2 原形）", "```java\nclass A { A(int w){ super(MY_MENU_TYPE.get(), w); } }\n```\nclass X { static final RegistryObject<MenuType<A>> MY_MENU = null; }", 1],
  ["super(null)", "```java\nclass A extends Container { A(int w){ super(null, w); } }\n```\n", 1],
  ["构造实参个数不匹配（1.16.5 原形）", "```java\npublic class MyContainer extends Container { public MyContainer(int w, Inventory i, Buf b) {} }\n```\n```java\nrun(() -> new MyContainer(id, inv, world, pos));\n```\n", 1],
  ["正对照：声明存在 ⇒ 绿", "```java\nclass A { A(int w){ super(MyMenuTypes.MY_MENU.get(), w); } }\n```\npublic static final RegistryObject<MenuType<A>> MY_MENU = MENUS.register(\"x\", () -> null);", 0],
  ["正对照：原版注册表 API 不误报", "```java\nvar b = BuiltInRegistries.BLOCK.get(id);\nvar g = Registry.get(Registries.ITEM, id);\n```\n", 0],
  ["正对照：占位符（本文件不声明）不误报", "```java\nvar x = MY_ITEM.get();\nvar y = MY_BLOCK.get();\nvar z = MY_TILE_ENTITY.get();\n```\n", 0],
  [
    "工厂契约第三参不符（1.15.2 原形）",
    "```java\npublic class C extends Container { public C(int w, PlayerInventory i, IInteractionObject t) { super(null, w); } }\n```\n```java\nvar x = IForgeContainerType.create(C::new);\n```\n",
    1,
  ],
  [
    "正对照：工厂第三参 PacketBuffer ⇒ 绿",
    "```java\npublic class C extends Container { public C(int w, PlayerInventory i, PacketBuffer b) {} }\n```\n```java\nvar x = IForgeContainerType.create(C::new);\n```\n",
    0,
  ],
];

function runSelftest() {
  let ok = true;
  for (const [name, text, want] of SELFTEST_CASES) {
    const got = checkRuleText("selftest", text).length;
    const pass = want === 0 ? got === 0 : got > 0;
    if (!pass) ok = false;
    console.log(`${pass ? "OK  " : "FAIL"} ${name}：期望${want === 0 ? "绿" : "红"}，实得 ${got} 条`);
  }

  // ── 地板（R47）夹具：合成采集面（各平台均 > 0，且合计 == scanned，免得撞「分母不自洽」） ──
  const face = (total) => {
    const per = Math.floor(total / PLATFORMS.length);
    const o = {};
    PLATFORMS.forEach((p, i) => (o[p] = i === 0 ? total - per * (PLATFORMS.length - 1) : per));
    return o;
  };
  const FLOOR_CASES = [
    ["地板投毒：采集面塌成 0（改坏路径形状 / 平台树被搬走）⇒ 必红", { scanned: 0, perPlatform: {}, floor: FLOOR_SCANNED }, 1, "[FLOOR-COLLECTOR]"],
    ["地板投毒：实扫 100 < 地板 ⇒ 必红且是 [FLOOR-LOW]", { scanned: 100, perPlatform: face(100), floor: FLOOR_SCANNED }, 1, "[FLOOR-LOW]"],
    ["地板正对照：实扫 = 地板 + 50 ⇒ 仍绿（证下界非等式，新增不假红）", { scanned: FLOOR_SCANNED + 50, perPlatform: face(FLOOR_SCANNED + 50), floor: FLOOR_SCANNED }, 0, null],
    ["假覆盖投毒：bedrock 腿被删（其余 7 台补足份数）⇒ 必红", { scanned: FLOOR_SCANNED, perPlatform: (() => { const o = face(FLOOR_SCANNED); o.forge += o.bedrock; delete o.bedrock; return o; })(), floor: FLOOR_SCANNED }, 1, "[FLOOR-COLLECTOR]"],
    ["分母不自洽投毒：采集面合计 ≠ 实扫 ⇒ 必红", { scanned: FLOOR_SCANNED, perPlatform: face(FLOOR_SCANNED - 1), floor: FLOOR_SCANNED }, 1, "[FLOOR-COLLECTOR]"],
  ];
  for (const [name, input, want, code] of FLOOR_CASES) {
    const got = evaluateFloor(input);
    const pass = want === 0 ? got.length === 0 : got.some((m) => m.includes(code));
    if (!pass) ok = false;
    console.log(`${pass ? "OK  " : "FAIL"} ${name}：实得 ${got.length} 条${got.length ? "（首条 " + got[0].split("——")[0].trim() + "…）" : ""}`);
  }

  // ── 采集器活性自证（真磁盘、只读）：头注说的两腿必须真的在采 ──
  const real = collectRuleFiles(REPO);
  const bedrock = real.perPlatform.bedrock || 0;
  const live = real.files.length >= FLOOR_SCANNED && bedrock > 0;
  if (!live) ok = false;
  console.log(
    `${live ? "OK  " : "FAIL"} 采集器活性：真根实采 ${real.files.length} 份 ≥ 地板 ${FLOOR_SCANNED} · ` +
      `bedrock 根腿（腿 2）${bedrock} 份 > 0（塌成 0 = 采集器失效，不是代码干净）`,
  );

  const total = SELFTEST_CASES.length + FLOOR_CASES.length + 1;
  if (!ok) {
    console.error(`assert-rule-java-shapes: SELFTEST RED`);
    process.exit(1);
  }
  console.log(`assert-rule-java-shapes: selftest OK（${total} 例 = 形状 ${SELFTEST_CASES.length} + 地板 ${FLOOR_CASES.length} + 采集器活性 1）`);
}

if (process.argv.includes("--selftest")) {
  runSelftest();
} else {
  const { files, perPlatform } = collectRuleFiles(REPO);
  const shape = [];
  let scanned = 0;
  let judged = 0;
  for (const f of files) {
    let text;
    try {
      text = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    scanned++;
    judged += text.split(/\r?\n/).length;
    const rel = path.relative(REPO, f).split(path.sep).join("/");
    shape.push(...checkRuleText(rel, text));
  }
  // 地板红码与形状红码同屏，但「拒」只计形状违规（地板是采集器健康度，不是代码缺陷）
  const failures = shape.concat(evaluateFloor({ scanned, perPlatform, floor: FLOOR_SCANNED }));
  const sum = summaryLine({ scanned, judged, rejected: shape.length, perPlatform, floor: FLOOR_SCANNED });
  if (failures.length) {
    console.error(`assert-rule-java-shapes: ${failures.length} 条不通过（${sum}）`);
    for (const m of failures) console.error(`  ${m}`);
    process.exit(1);
  }
  console.log(
    `assert-rule-java-shapes: ok（${sum} · 源稿 rules 无 super(null,) · 无未声明 MY_*.get() · new/定义实参一致 · create(Cls::new) 第三参合契约）`,
  );
}
