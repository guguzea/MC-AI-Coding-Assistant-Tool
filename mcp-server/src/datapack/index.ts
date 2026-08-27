import { versionRequiredAction, missingMcVersion } from "../utils/actionable.js";
import { parseJsonUtf8 } from "../utils/json-utf8.js";

export interface ValidateDatapackInput {
  jsonContent: string;
  kind: "recipe" | "loot_table" | "advancement" | "tag";
  version?: string;
}

export interface ValidateDatapackResult {
  valid: boolean;
  version: string;
  kind: string;
  errors: string[];
  warnings: string[];
  action?: ReturnType<typeof versionRequiredAction>;
}

function recipeRequiresResult(type: unknown): boolean {
  const t = String(type ?? "");
  if (t.startsWith("minecraft:crafting_special_")) return false;
  if (t === "minecraft:smithing_trim" || t === "minecraft:smithing_transform") return false;
  return true;
}

function requireKeys(obj: Record<string, unknown>, keys: string[], errors: string[]): void {
  for (const k of keys) {
    if (!(k in obj)) errors.push(`缺少必需字段: ${k}`);
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
  const errors: string[] = [];
  const warnings: string[] = [];

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
      if (recipeRequiresResult(data.type) && !("result" in data)) {
        errors.push("缺少必需字段: result");
      }
      // result 可为字符串或对象（1.21+ id/count）；有键即过，不因类型 fail
      if (data.type === "minecraft:crafting_shaped" || data.type === "minecraft:crafting_shapeless") {
        if (!("ingredients" in data) && !("key" in data)) {
          errors.push("合成配方需要 key/ingredients");
        }
      }
      break;
    case "loot_table":
      // vanilla loot table 顶层 type 是可选字段（手写表普遍省略，空表也合法，F-E205）
      if (Object.keys(data).length === 0) {
        warnings.push("空 loot_table {} 视为合法（F-E205）");
        break;
      }
      requireKeys(data, ["pools"], errors);
      if (!Array.isArray(data.pools)) errors.push("pools 必须为数组");
      if ("type" in data && typeof data.type === "string" && !/^[a-z0-9_.:-]+$/i.test(data.type)) {
        errors.push(`type 看起来不是合法资源 id: ${String(data.type)}`);
      } else if (!("type" in data)) {
        warnings.push("loot table 未声明顶层 type（可选；如需 random_sequence 语义请显式声明）");
      }
      break;
    case "advancement":
      requireKeys(data, ["criteria"], errors);
      if (version.startsWith("1.21") && !("rewards" in data)) {
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

  return {
    valid: errors.length === 0,
    version,
    kind: input.kind,
    errors,
    warnings,
  };
}
