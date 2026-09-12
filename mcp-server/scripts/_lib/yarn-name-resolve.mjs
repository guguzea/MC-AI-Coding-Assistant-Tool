/**
 * intermediary → Yarn 可读名还原（S7 / F120）
 *
 * DokuWiki 源里的 `<yarn class_1792>` 装的是**混淆 intermediary 名**，而上游渲染页给出的是 Yarn 可读名。
 * 处理器的旧写法只做 `<yarn X>` → `` `X` `` 的形状转换，等于把混淆名原样交给模型
 * （实测 processed 正文 263 处：224 `class_` / 26 `method_` / 13 `field_`）。
 *
 * 三条硬规则 —— 静默降级正是这个缺陷能活到今天的原因：
 *  1. 该档没有 yarn-mappings.sqlite ⇒ 抛错，不出页；
 *  2. intermediary 反查不到 ⇒ 抛错；
 *  3. 成员名（method_/field_）在同一 intermediary 下对应多个可读名 ⇒ **不猜**：保留原样并计入
 *     `stats.ambiguous`，由调用方/门按歧义逐条登记（给模型一个可能是错的成员名，比留一处可见的歧义更坏）。
 */
import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const INTERMEDIARY_RE = /^(class|field|method)_\d+$/;

export function loadYarnNameMap(dbPath, version) {
  if (!existsSync(dbPath)) {
    throw new Error(
      `缺映射库 ${dbPath} —— ${version} 的 fabric-wiki 正文含 <yarn intermediary> 标记，` +
        `没有 yarn-mappings.sqlite 就不能还原成可读名（宁可不出页，也不静默落混淆名）`,
    );
  }
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const map = new Map();
  const put = (key, value) => {
    if (!key || !value) return;
    // 库里 intermediary 是全限定形态（`net/minecraft/class_2168`），正文写的是裸名（`class_2168`）
    // ⇒ 两种拼法都建索引；嵌套类尾缀（class_1792$1）不会被当成外层 class_1792。
    const keys = new Set([key]);
    const tail = String(key).split(/[/.]/).pop();
    if (tail && tail !== key) keys.add(tail);
    // 嵌套类：正文写裸内层 id（`class_1793`），库里只有 `net/minecraft/class_1792$class_1793`。
    // 只在该 id 尚未被任何条目占用时才登记，避免内层名盖掉真正的同名顶层类。
    const inner = String(tail ?? key).split("$").pop();
    if (inner && inner !== tail) keys.add(inner);
    for (const k of keys) {
      if (k !== key && k !== tail && map.has(k)) continue;
      if (!map.has(k)) map.set(k, new Set());
      map.get(k).add(value);
    }
  };
  const rows = (sql) => {
    try {
      return db.prepare(sql).all();
    } catch {
      return [];
    }
  };
  for (const r of rows("SELECT intermediary, named FROM classes")) {
    put(r?.intermediary, String(r?.named ?? "").split(".").pop());
  }
  for (const t of ["methods", "fields"]) {
    for (const r of rows(`SELECT name_intermediary AS i, name_named AS n FROM ${t}`)) {
      put(r?.i, r?.n);
    }
  }
  db.close();
  return map;
}

/**
 * 就地把 `<yarn X>` 换成可读名并加行内码。返回 null 表示这一处无法安全还原（歧义成员），
 * 由调用方保留原文并计数 —— 不返回猜测值。
 */
export function makeYarnTagResolver(map, stats) {
  return function resolve(innerRaw) {
    const inner = String(innerRaw).trim();
    if (!INTERMEDIARY_RE.test(inner)) return { text: `\`${inner}\`` };
    const set = map.get(inner);
    if (!set || set.size === 0) {
      stats.missing.push(inner);
      return null; // 调用方决定怎么记账：绝不返回猜测值，也不静默当成功
    }
    if (set.size > 1 && !inner.startsWith("class_")) {
      stats.ambiguous.push(`${inner}→${[...set].sort().join("|")}`);
      return { text: `\`${inner}\``, ambiguous: true };
    }
    const named = [...set][0];
    if (inner.startsWith("class_")) stats.classResolved++;
    else stats.memberResolved++;
    return { text: `\`${named}\`` };
  };
}

export function emptyYarnStats() {
  return { classResolved: 0, memberResolved: 0, ambiguous: [], missing: [], unresolved: [] };
}

/** 围栏内是代码示例，按语料忠实原则一个字都不动；只扫围栏外的残留标记。 */
export function replaceYarnTagsOutsideFences(md, resolveTag) {
  const out = [];
  let fence = false;
  let hits = 0;
  for (const line of md.split("\n")) {
    if (/^ {0,3}(```|~~~)/.test(line)) fence = !fence;
    if (fence || !/<yarn [^>]+>/.test(line)) {
      out.push(line);
      continue;
    }
    out.push(
      line.replace(/<yarn ([^>]+)>/g, (_whole, inner) => {
        const got = resolveTag(inner);
        if (!got) throw new Error(`反查不到 ${String(inner).trim()} —— 不得把中介名当可读名落盘`);
        hits++;
        return got.text;
      }),
    );
  }
  return { content: out.join("\n"), hits };
}
