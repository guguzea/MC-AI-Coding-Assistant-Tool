/**
 * Import an MCPConfig **`tsrg2 left right`** stream into the mapping sqlite.
 *
 * 这份料就是「Forge 1.17+ 的 AT 成员行为什么以前只能出 `<TODO:SRG名>`」的答案：1.17 起
 * ForgeGradle 换用 Mojang 官方映射作 named 层，SRG 位置上变成哈希形状 `m_<数字>_` / `f_<数字>_`，
 * 而「可读名 ↔ 该形状」的表**只存在于 MCPConfig 产物里**（本仓既没有它，也没有能推出它的算法）。
 * 形状一手实测自 `~/.gradle/caches/forge_gradle/minecraft_user_repo/de/oceanlabs/mcp/mcp_config/`：
 *
 *   tsrg2 left right
 *   com/mojang/blaze3d/Blaze3D com/mojang/blaze3d/Blaze3D
 *     m_166118_ (Lcom/mojang/blaze3d/pipeline/RenderPipeline;F)V process
 *       static                          ← 修饰行：不含成员名 ⇒ 丢
 *       0 p_166119_ pPipeline           ← 参数行：MCPConfig 的参数层 ⇒ 丢
 *
 * 落法（与 `import-mcp-csv.mjs` 同一层观）：**named 列 = SRG**（AT 成员行要的就是它，
 * `access-lines.ts` 读 `row.name_named` 并核 `SRG_SHAPE_RE`），**official 列 = mojmap 可读名**，
 * `intermediary` 留空（Forge 侧没有 intermediary 层）。`mappingEra` 记 `mcp-config-srg`。
 *
 * SRG 位置上有**两种年代形状**，本 importer 都收（`access-lines.ts` 的 `SRG_SHAPE_RE` 本来就两套都认）：
 *   · 1.17+ = 哈希形 `m_<数字>_` / `f_<数字>_`；
 *   · ≤1.16.5 = 老形 `func_<数字>_x` / `field_<数字>_x`（实测 1.16.5 的 `srg_to_official_1.16.5.tsrg`
 *     全是这形状：`func_` 35,525 行 + `field_` 19,841 行）⇒ 该档此前**没有任何成员库**，AT 成员行只能
 *     `<TODO:SRG名>`，现在同一条路径覆盖。
 *
 * 刻意不做的事：`<init>` / `<clinit>` 不进表（与 tiny/tsrg 两条既有 importer 同口径，
 * MCP csv 通道本来也没有构造器行）；`classes` 里 1.17+ 两侧类名逐字相同，仍按 left/right 各写一列，
 * 不去猜「是不是可以只写一列」。
 */
import readline from "node:readline";

const MEMBER_RE =
  /^(func_\d+_[A-Za-z0-9_$]+|field_\d+_[A-Za-z0-9_$]+|[mf]_\d+_)\s+(\S+)(?:\s+(\S+))?$/;

/** SRG 形状的两种年代：1.17+ 的哈希形 `m_`/`f_`，与 ≤1.16.5 的 `func_`/`field_`（实测 1.16.5 的 srg_to_official 全用后者）。 */
const METHOD_PREFIX_RE = /^(?:m_|func_)/;

/**
 * 一行成员 → `{srg, descriptor, readable}`，不认则 null。
 * 两种形状都要能吃（实测 2026-09-26）：
 *   削减件（本仓入库的那份）`\tm_166118_\t(L…)V\tprocess` / `\tf_167842_\t\twireframe`
 *     —— 字段的描述符位**是空串**，只能按制表符切，不能按「非空 token 数」判；
 *   上游件（直接喂 MCPConfig 原文件时）`\tf_167842_ wireframe`（字段根本没有描述符）。
 * 方法/字段只按名字前缀分（`m_` / `f_`）——上游字段行偶尔带描述符，用括号形状判会把字段当方法。
 */
function parseMember(trimmed) {
  const tabbed = trimmed.split("\t");
  let srg;
  let descriptor;
  let readable;
  if (tabbed.length >= 3 && /^(?:func_\d+_[A-Za-z0-9_$]+|field_\d+_[A-Za-z0-9_$]+|[mf]_\d+_)$/.test(tabbed[0])) {
    srg = tabbed[0];
    descriptor = tabbed[1].trim();
    readable = tabbed.slice(2).join(" ").trim();
  } else {
    const m = MEMBER_RE.exec(trimmed);
    if (!m) return null;
    srg = m[1];
    if (m[2].startsWith("(")) {
      descriptor = m[2];
      readable = m[3] ?? "";
    } else {
      descriptor = "";
      readable = m[2];
    }
  }
  if (!srg || !readable) return null;
  if (!descriptor && METHOD_PREFIX_RE.test(srg)) return null; // 方法缺描述符 = 行读不懂，交 unparsed 计数
  return { srg, descriptor, readable };
}

/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {import('node:stream').Readable} input
 * @param {{ version?: string, source?: string }} [meta]
 */
export async function importSrgToOfficialStream(db, input, meta = {}) {
  const insertClass = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  const stmtMethod = db.prepare(
    `INSERT OR REPLACE INTO methods(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, NULL)`,
  );
  const stmtField = db.prepare(
    `INSERT OR REPLACE INTO fields(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, NULL)`,
  );
  const insertSeargeMethod = db.prepare(
    "INSERT OR REPLACE INTO searge_methods(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );
  const insertSeargeField = db.prepare(
    "INSERT OR REPLACE INTO searge_fields(searge, name_named, descriptor_named) VALUES (?, ?, ?)",
  );

  let currentOwner = null;
  let classCount = 0;
  let methodCount = 0;
  let fieldCount = 0;
  let droppedParamLines = 0;
  let droppedModifierLines = 0;
  let droppedCtorLines = 0;
  let unparsedMemberLines = 0;
  let noDescriptor = 0;
  let headerSeen = false;

  db.exec("BEGIN");
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  try {
    for await (const rawLine of rl) {
      if (!rawLine.trim()) continue;
      if (!rawLine.startsWith("\t")) {
        const tokens = rawLine.trim().split(/\s+/);
        if (tokens[0] === "tsrg2") {
          headerSeen = true;
          continue;
        }
        if (tokens.length === 0) continue;
        const left = tokens[0];
        const right = tokens[1] ?? tokens[0];
        if (!left) continue;
        currentOwner = left;
        insertClass.run(left, left, right);
        classCount++;
        continue;
      }
      const t = rawLine.trim();
      if (/^(static|final|static final|public|private|protected)\b/.test(t)) {
        droppedModifierLines++;
        continue;
      }
      // 两级缩进的其余行 = MCPConfig 的参数层（`0 p_166119_ pPipeline`），本表不存参数名。
      if (/^\t\t/.test(rawLine)) {
        droppedParamLines++;
        continue;
      }
      if (t.startsWith("<")) {
        droppedCtorLines++;
        continue;
      }
      const parsed = parseMember(t);
      if (!parsed || !currentOwner) {
        unparsedMemberLines++;
        continue;
      }
      const { srg, descriptor, readable } = parsed;
      if (!descriptor) noDescriptor++; // 字段形状上游本来就没有描述符（AT 字段行也不需要）
      if (METHOD_PREFIX_RE.test(srg)) {
        stmtMethod.run(currentOwner, srg, descriptor, readable, descriptor);
        insertSeargeMethod.run(srg, readable, descriptor);
        methodCount++;
      } else {
        stmtField.run(currentOwner, srg, descriptor, readable, descriptor);
        insertSeargeField.run(srg, readable, descriptor);
        fieldCount++;
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    try {
      db.exec("ROLLBACK");
    } catch {}
    throw e;
  } finally {
    rl.close();
  }

  if (!headerSeen) {
    // 头缺失不判红：`tsrg2 left right` 只是文件自述，实测五档都带；
    // 但形状靠列数解析，头丢了也要留痕，别让下一轮以为解析器认过它。
    console.warn(`import-srg-to-official: ${meta.source ?? "(stream)"} 未见 tsrg2 头行，按位置解析`);
  }
  return {
    mappingEra: "mcp-config-srg",
    format: "mcpconfig-srg-to-official",
    classCount,
    methodCount,
    fieldCount,
    droppedParamLines,
    droppedModifierLines,
    droppedCtorLines,
    unparsedMemberLines,
    noDescriptor,
    version: meta.version ?? "",
    source: meta.source ?? "",
  };
}
