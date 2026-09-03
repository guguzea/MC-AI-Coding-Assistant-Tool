import { versionRequiredAction, missingMcVersion, actionable, ActionCodes } from "../utils/actionable.js";
import { isExactMcVersionToken } from "../utils/minecraft-version.js";
import { parseJsonUtf8 } from "../utils/json-utf8.js";
import { ownGet } from "../utils/own-record.js";

export interface ValidateDatapackInput {
  jsonContent: string;
  kind: "recipe" | "loot_table" | "advancement" | "tag";
  version?: string;
  /**
   * 可选：数据包 pack.mcmeta 的 pack_format。
   * 仅做**形态校验**（正整数 / 1.21.9+ 的 [主版本, 次版本] 数组）。
   *
   * ⚠️ 不做「版本 → 数值」比对：数据包的 pack_format 与资源包是**两套不同的表**
   * （例：1.20.4 资源包=22，数据包=26）。`localize/pack-format.ts` 的 `resolvePackFormat`
   * 是**资源包**表，切勿直接拿来校验数据包，否则会成片误报。
   * 若将来要加版本比对，必须先取得已核实的数据包 pack_format 表再补。
   */
  packFormat?: number | [number, number];
}

export interface ValidateDatapackResult {
  valid: boolean;
  version: string;
  kind: string;
  errors: string[];
  warnings: string[];
  action?: ReturnType<typeof versionRequiredAction>;
}

/**
 * smithing 系列配方的字段要求（vanilla 事实，2026-08-29 经 Datapack Codex / Minecraft Wiki 核对）。
 *
 * - `smithing_transform`：`base` + `result` **必填**；`template` 与 `addition` 为**可选**。
 * - `smithing_trim`：`template` + `base` + `addition` 必填；**无 `result` 属正常**
 *   （Codex 原话：There is no result — the base item is modified in place.）。
 *
 * ⚠️ 两个反模式都不要犯：
 * 1. 不要要求 `smithing_transform`「四字段齐全」——`template`/`addition` 可选，
 *    强求会把合法省略它们的配方误判为 error。
 * 2. 不要做版本分叉（`1.20+` / `1.19.4 及更早`）——1.19.4 之前这两个配方类型根本不存在。
 */
const SMITHING_REQUIRED_KEYS: Record<string, string[]> = {
  "minecraft:smithing_transform": ["base", "result"],
  "minecraft:smithing_trim": ["template", "base", "addition"],
};

function recipeRequiresResult(type: unknown): boolean {
  const t = String(type ?? "");
  if (t.startsWith("minecraft:crafting_special_")) return false;
  // 仅 smithing_trim 无 result。smithing_transform 必须有 result——
  // 原实现把两者一并 return false，正是「缺 result 也假通过」的来源。
  if (t === "minecraft:smithing_trim") return false;
  return true;
}

function requireKeys(obj: Record<string, unknown>, keys: string[], errors: string[]): void {
  for (const k of keys) {
    if (!(k in obj)) errors.push(`缺少必需字段: ${k}`);
  }
}

// ── 递归校验：深度与节点数双重上限，防大 JSON 卡死 ──────────────────────────
const MAX_DEPTH = 8;
const MAX_NODES = 5000;

/**
 * 在 vanilla 数据包 JSON 中恒为资源 id 的键名。
 * 刻意**排除** `name`：loot function `set_name` 的 `name` 是文本组件，
 * 写成 "Legendary Sword" 这种带大写空格的字面量完全合法，纳入会误报。
 */
const ID_LIKE_KEYS = new Set(["id", "item", "tag", "type", "block"]);
const RESOURCE_ID_RE = /^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/;

interface WalkState {
  nodes: number;
  truncated: boolean;
}

function walkForIdShape(
  node: unknown,
  path: string,
  depth: number,
  st: WalkState,
  warnings: string[],
): void {
  if (st.nodes >= MAX_NODES) {
    st.truncated = true;
    return;
  }
  st.nodes++;
  if (depth > MAX_DEPTH) {
    st.truncated = true;
    return;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      walkForIdShape(node[i], `${path}[${i}]`, depth + 1, st, warnings);
    }
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    // 资源 id 形态异常一律只 warning，不 fail——避免既有合法数据包成片报错
    if (ID_LIKE_KEYS.has(k) && typeof v === "string" && v.length > 0 && !RESOURCE_ID_RE.test(v)) {
      warnings.push(`${path}.${k} 看起来不是合法资源 id: ${v}`);
    }
    walkForIdShape(v, `${path}.${k}`, depth + 1, st, warnings);
  }
}

function checkLootPoolsShape(
  data: Record<string, unknown>,
  errors: string[],
  warnings: string[],
): void {
  const pools = data.pools;
  if (!Array.isArray(pools)) return;
  pools.forEach((pool, pi) => {
    if (!pool || typeof pool !== "object") return;
    const entries = (pool as Record<string, unknown>).entries;
    if (entries === undefined) {
      warnings.push(`pools[${pi}] 未声明 entries（合法但通常无产出）`);
      return;
    }
    if (!Array.isArray(entries)) {
      errors.push(`pools[${pi}].entries 必须为数组`);
      return;
    }
    entries.forEach((e, ei) => {
      if (!e || typeof e !== "object") return;
      const entry = e as Record<string, unknown>;
      const t = entry.type;
      if (typeof t !== "string") {
        warnings.push(`pools[${pi}].entries[${ei}] 未声明 type（1.20.2+ 为必需）`);
      } else if (t === "minecraft:item") {
        // 只在 type===item 时把 name 当物品 id 校验。
        // 通用递归刻意不校验 name——loot function `set_name` 的 name 是文本组件，
        // 写成 "Legendary Sword" 这类带大写空格的字面量完全合法，纳入通用校验会误报。
        if (!("name" in entry)) {
          warnings.push(`pools[${pi}].entries[${ei}] 为 item 类型但缺少 name`);
        } else {
          const nm = entry.name;
          if (typeof nm === "string" && nm.length > 0 && !RESOURCE_ID_RE.test(nm)) {
            warnings.push(`pools[${pi}].entries[${ei}].name 看起来不是合法物品 id: ${nm}`);
          }
        }
      }
    });
  });
}

function checkRecipeResultShape(
  data: Record<string, unknown>,
  warnings: string[],
): void {
  const r = data.result;
  if (r && typeof r === "object" && !Array.isArray(r)) {
    const obj = r as Record<string, unknown>;
    if (!("id" in obj) && !("item" in obj)) {
      warnings.push("result 为对象但未包含 id/item（无法判定产出物）");
    }
  }
}

function checkPackFormatShape(packFormat: unknown, warnings: string[]): void {
  if (packFormat === undefined || packFormat === null) return;
  // 1.21.9+ 官方允许 [主版本, 次版本] 数组写法；整数写法仍合法；
  // 写成浮点 69.0 会被游戏判 "Broken or incompatible"。
  if (Array.isArray(packFormat)) {
    const ok =
      packFormat.length === 2 &&
      packFormat.every((n) => typeof n === "number" && Number.isInteger(n) && n >= 0);
    if (!ok) {
      warnings.push(
        `pack_format 数组写法应为 [主版本, 次版本] 两个非负整数，收到: ${JSON.stringify(packFormat)}`,
      );
    }
    return;
  }
  if (typeof packFormat !== "number" || !Number.isInteger(packFormat) || packFormat <= 0) {
    warnings.push(
      `pack_format 应为正整数（或 [主版本, 次版本] 数组），收到: ${String(packFormat)}`,
    );
  }
}

export function validateDatapackJson(input: ValidateDatapackInput): ValidateDatapackResult {
  if (missingMcVersion(input.version)) {
    const action = versionRequiredAction();
    return {
      valid: false,
      version: "",
      kind: input.kind,
      errors: [action.message],
      warnings: [],
      action,
    };
  }
  const version = input.version!.trim();
  // "unknown" = 内部调用者（validate/loaders.ts 扫描 recipe 目录时拿不到工程版本）的哨兵：
  // 允许通过，但必须声明本次不做任何版本相关判定，禁止把它当成「已按此版本校验」。
  const versionAgnostic = version === "unknown";
  if (!versionAgnostic && !isExactMcVersionToken(version)) {
    const action = actionable(
      ActionCodes.INVALID_INPUT,
      `version="${version}" 不是合法 MC 版本 token（如 1.20.4 / 1.21.11 / 26.1）`,
      [
        "传精确 MC 版本，例如 1.20.4、1.21.11、26.1",
        "先 list_*_versions / list_doc_versions 查看已索引版本",
        "快照名（23w31a）与 beta 后缀（1.21beta）本工具不接受",
      ],
      ["list_doc_versions"],
    );
    return {
      valid: false,
      version: "",
      kind: input.kind,
      errors: [action.message],
      warnings: [],
      action,
    };
  }
  const errors: string[] = [];
  const warnings: string[] = [];
  if (versionAgnostic) {
    warnings.push("version=unknown：本次未做版本相关判定（仅结构校验）");
  }

  let data: Record<string, unknown>;
  try {
    data = parseJsonUtf8(input.jsonContent) as Record<string, unknown>;
  } catch (e) {
    return {
      valid: false,
      version,
      kind: input.kind,
      errors: [`JSON 语法错误: ${(e as Error).message}`],
      warnings,
    };
  }

  switch (input.kind) {
    case "recipe":
      requireKeys(data, ["type"], errors);
      // smithing 系列按 vanilla 事实校验字段（template/addition 可选，不做版本分叉）
      const smithingRequired = ownGet(SMITHING_REQUIRED_KEYS, String(data.type ?? ""));
      if (smithingRequired) {
        requireKeys(data, smithingRequired, errors);
      } else if (recipeRequiresResult(data.type) && !("result" in data)) {
        errors.push("缺少必需字段: result");
      }
      // result 可为字符串或对象（1.21+ id/count）；有键即过，不因类型 fail
      if (data.type === "minecraft:crafting_shaped" || data.type === "minecraft:crafting_shapeless") {
        if (!("ingredients" in data) && !("key" in data)) {
          errors.push("合成配方需要 key/ingredients");
        }
      }
      checkRecipeResultShape(data, warnings);
      break;
    case "loot_table":
      // vanilla loot table 顶层 type 是可选字段（手写表普遍省略，空表也合法，F-E205）
      if (Object.keys(data).length === 0) {
        warnings.push("空 loot_table {} 视为合法（F-E205）");
        break;
      }
      requireKeys(data, ["pools"], errors);
      if (!Array.isArray(data.pools)) errors.push("pools 必须为数组");
      checkLootPoolsShape(data, errors, warnings);
      if ("type" in data && typeof data.type === "string" && !/^[a-z0-9_.:-]+$/i.test(data.type)) {
        errors.push(`type 看起来不是合法资源 id: ${String(data.type)}`);
      } else if (!("type" in data)) {
        warnings.push("loot table 未声明顶层 type（可选；如需 random_sequence 语义请显式声明）");
      }
      break;
    case "advancement":
      requireKeys(data, ["criteria"], errors);
      // 仅提示：入口已保证 version 是合法精确 token，此处不参与 valid 判定
      if (/^1\.21(\.|$)/.test(version) && !("rewards" in data)) {
        warnings.push("1.21+ advancement 建议包含 rewards 或显式空对象");
      }
      break;
    case "tag":
      requireKeys(data, ["values"], errors);
      if (!Array.isArray(data.values)) errors.push("values 必须为数组");
      break;
    default:
      errors.push(`未知 kind: ${input.kind}`);
  }

  // 递归校验嵌套结构中的资源 id 形态（受 maxDepth / 节点数上限保护，只出 warning）
  const st: WalkState = { nodes: 0, truncated: false };
  walkForIdShape(data, "$", 0, st, warnings);
  if (st.truncated) {
    warnings.push(
      `结构过大或过深（节点上限 ${MAX_NODES} / 深度上限 ${MAX_DEPTH}），嵌套校验可能不完整。`,
    );
  }

  checkPackFormatShape(input.packFormat, warnings);

  return {
    valid: errors.length === 0,
    version,
    kind: input.kind,
    errors,
    warnings,
  };
}
