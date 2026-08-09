import { convertMapping } from "../mappings/index.js";
import { queryApi } from "../api/index.js";
import { lookupMethod } from "../mappings/yarn-sqlite.js";
import { actionable, ActionCodes } from "../utils/actionable.js";
import type { ParsedMethodRef } from "./method-string.js";
import { detectNamingStyle } from "./method-string.js";

export interface MethodResolution {
  ref: ParsedMethodRef;
  found: boolean;
  mappingLayer?: string;
  resolvedName?: string;
  notes?: string[];
  action?: ReturnType<typeof actionable>;
}

function mappingFromForStyle(style: ParsedMethodRef["style"]): "mcp" | "yarn" | "mojang" {
  switch (style) {
    case "srg":
      return "mcp";
    case "yarn_intermediary":
      return "yarn";
    case "mojang_hashed":
      return "mojang";
    case "readable":
      return "mcp";
    default:
      return "mcp";
  }
}

export async function resolveMixinMethodTarget(
  ownerClass: string | undefined,
  ref: ParsedMethodRef,
  version: string,
): Promise<MethodResolution> {
  const style = ref.style === "descriptor_combined" ? detectNamingStyle(ref.methodName) : ref.style;
  const from = mappingFromForStyle(style);

  if (!ref.methodName) {
    return {
      ref,
      found: false,
      action: actionable(ActionCodes.TARGET_METHOD_MISSING, "缺少 method 名", [
        "在 @Inject 上补充 method 或合并 descriptor",
      ]),
    };
  }

  if (style === "readable" && ownerClass) {
    const api = await queryApi({
      className: ownerClass,
      methodName: ref.methodName,
      version,
    });
    if (api.found && api.methods?.length) {
      const filtered = ref.descriptor
        ? api.methods.filter((m) => m.descriptor === ref.descriptor)
        : api.methods;
      if (filtered.length === 1) {
        return { ref, found: true, mappingLayer: "mcp/parchment", resolvedName: ref.methodName };
      }
      if (filtered.length > 1) {
        return {
          ref,
          found: false,
          mappingLayer: "mcp/parchment",
          notes: ["存在多个重载，请补充 desc/descriptor"],
          action: actionable(ActionCodes.AMBIGUOUS, "方法重载歧义", [
            "为 @Inject 添加 desc= 完整 JNI 描述符",
            "或使用 convert_mapping 并传入 descriptor",
          ], ["convert_mapping", "get_method_params"]),
        };
      }
    }
  }

  if (ownerClass && (from === "mcp" || from === "yarn" || from === "mojang")) {
    const map = convertMapping({
      from,
      to: "mcp",
      memberName: ref.methodName,
      ownerClass,
      descriptor: ref.descriptor,
      version,
    });
    if (map.found) {
      const lookup = lookupMethod(version, {
        ownerClass,
        memberName: map.converted ?? ref.methodName,
        descriptor: ref.descriptor,
        from: "mcp",
      });
      if (!lookup.found) {
        return {
          ref,
          found: false,
          mappingLayer: `${from}→mcp`,
          action: actionable(
            ActionCodes.TARGET_METHOD_MISSING,
            `映射层存在但 methods 表无此成员「${ref.methodName}」`,
            [
              "确认 owner 类与 MC 版本",
              "补充 descriptor",
              "尝试 convert_mapping 从 yarn/mojang 层查询",
            ],
            ["convert_mapping", "query_api"],
          ),
        };
      }
      return {
        ref,
        found: true,
        mappingLayer: `${from}→mcp`,
        resolvedName: map.converted ?? ref.methodName,
      };
    }
    if (map.ambiguous) {
      return {
        ref,
        found: false,
        mappingLayer: from,
        notes: map.suggestions,
        action: actionable(ActionCodes.AMBIGUOUS, "映射歧义", [
          "传入 descriptor 消歧",
          "确认 ownerClass 为目标类全限定名",
        ], ["convert_mapping"]),
      };
    }
  }

  return {
    ref,
    found: false,
    mappingLayer: style,
    action: actionable(
      ActionCodes.TARGET_METHOD_MISSING,
      `无法在映射/API 索引中确认方法「${ref.methodName}」`,
      [
        "确认 @Mixin target 类与 owner 一致",
        "补充 desc / descriptor",
        "若使用混淆名，尝试 convert_mapping（from=yarn|mojang|mcp）",
        "检查方法名拼写与 MC 版本",
      ],
      ["convert_mapping", "query_api"],
    ),
  };
}
