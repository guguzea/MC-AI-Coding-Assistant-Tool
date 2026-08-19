/**
 * lookup_obfuscated：崩溃日志反混淆（单 token 全局反查，无需 ownerClass）。
 *
 * 输入可为：method_6032（intermediary）/ er（obfuscated 短名）/ func_110143_aJ（SRG）/
 * field_100013_f / m_46859_（mojang-hashed，yarn sqlite 中不存在 → NOT_FOUND）。
 * 方法优先 → 字段其次 → 类最后；多命中返回 AMBIGUOUS。
 *
 * `resolveObfuscatedThreeWay` 供 convert_mapping 与本工具共用，避免两套逻辑分叉。
 */
import { detectNamingStyle } from "../mixin/method-string.js";
import { readableSignature } from "../utils/descriptor.js";
import { ActionCodes, actionable, missingMcVersion, versionRequiredAction, type ActionEnvelope } from "../utils/actionable.js";
import {
  getMappingEra,
  getSchemaVersion,
  lookupByObfuscated,
  lookupYarnClass,
  type LookupByObfuscatedResult,
} from "./yarn-sqlite.js";
import { isUnobfuscatedMcVersion, UNOBFUSCATED_MAPPING_HINT } from "./unobfuscated.js";

export interface LookupObfuscatedQuery {
  name: string;
  version?: string;
}

export interface LookupObfuscatedResult {
  found: boolean;
  original: string;
  kind?: "method" | "field" | "class";
  obfuscated?: string;
  intermediary?: string;
  yarn?: string;
  mojang?: string;
  ownerClass?: string;
  descriptor?: string;
  readableSignature?: string;
  mappingEra?: string | null;
  schemaVersion?: string | null;
  resultKind?: string;
  notes?: string[];
  action?: ActionEnvelope;
}

/** 三路回退命中行（method/field） */
export type ObfuscatedMemberRow = NonNullable<LookupByObfuscatedResult["rows"]>[number];

export type ObfuscatedThreeWayHit =
  | {
      found: true;
      kind: "method" | "field";
      row: ObfuscatedMemberRow;
      mappingEra?: string | null;
      notes?: string[];
    }
  | {
      found: true;
      kind: "class";
      official: string | null;
      intermediary: string | null;
      named: string;
      mappingEra?: string | null;
      notes?: string[];
    }
  | {
      found: false;
      ambiguous: true;
      kind: "method" | "field";
      rows: ObfuscatedMemberRow[];
      mappingEra?: string | null;
      notes?: string[];
    }
  | { found: false; ambiguous?: false; mappingEra?: string | null; notes?: string[] };

function toDot(name: string): string {
  return name.replace(/\//g, ".");
}

function yarnOwnerNote(ownerClass: string | undefined): string | undefined {
  if (!ownerClass) return undefined;
  const yarn = ownerClass.replace(/\//g, ".");
  if (/^net\.minecraft\.entity(\.|$)/.test(yarn)) {
    return `Yarn owner 为 ${yarn}；Parchment/Mojang 多为 net.minecraft.world.entity.*（query_api / convert_mapping 请用 Mojang 包名）。`;
  }
  return undefined;
}

function singleHit(
  hits: LookupByObfuscatedResult | null,
): ObfuscatedMemberRow | null {
  if (!hits || !hits.found || !hits.rows || hits.rows.length !== 1) return null;
  return hits.rows[0];
}

/**
 * method → field → class 三路回退（与 lookup_obfuscated 语义一致）。
 * 字段风格 token（field_）跳过方法表；方法风格（method_/func_/m_）跳过字段表。
 */
export function resolveObfuscatedThreeWay(version: string, token: string): ObfuscatedThreeWayHit {
  const style = detectNamingStyle(token);
  const isFieldToken = /^field_/.test(token);
  const isMethodToken =
    style === "yarn_intermediary" ||
    style === "mojang_hashed" ||
    style === "srg" ||
    /^func_/.test(token);

  const methodHits = isFieldToken ? null : lookupByObfuscated(version, token, "method");
  const fieldHits = isMethodToken ? null : lookupByObfuscated(version, token, "field");

  const methodRow = singleHit(methodHits);
  if (methodRow) {
    return {
      found: true,
      kind: "method",
      row: methodRow,
      mappingEra: methodHits?.mappingEra,
      notes: methodHits?.notes,
    };
  }
  if (methodHits?.found && methodHits.rows && methodHits.rows.length > 1) {
    return {
      found: false,
      ambiguous: true,
      kind: "method",
      rows: methodHits.rows,
      mappingEra: methodHits.mappingEra,
      notes: methodHits.notes,
    };
  }

  const fieldRow = singleHit(fieldHits);
  if (fieldRow) {
    return {
      found: true,
      kind: "field",
      row: fieldRow,
      mappingEra: fieldHits?.mappingEra,
      notes: fieldHits?.notes,
    };
  }
  if (fieldHits?.found && fieldHits.rows && fieldHits.rows.length > 1) {
    return {
      found: false,
      ambiguous: true,
      kind: "field",
      rows: fieldHits.rows,
      mappingEra: fieldHits.mappingEra,
      notes: fieldHits.notes,
    };
  }

  const cls = lookupYarnClass(version, token, "obfuscated");
  if (cls) {
    return {
      found: true,
      kind: "class",
      official: cls.official ?? null,
      intermediary: cls.intermediary,
      named: cls.named,
      mappingEra: getMappingEra(version),
      notes: [`类级命中（${version}）`],
    };
  }

  return {
    found: false,
    mappingEra: getMappingEra(version),
    notes: [`未找到 ${token} 的映射（version=${version}）`],
  };
}

export function lookupObfuscated(query: LookupObfuscatedQuery): LookupObfuscatedResult {
  const token = query.name.trim();
  if (missingMcVersion(query.version)) {
    return {
      found: false,
      original: token,
      action: versionRequiredAction(),
    };
  }
  const version = query.version!.trim();

  if (isUnobfuscatedMcVersion(version)) {
    return {
      found: false,
      original: token,
      resultKind: "UNOBFUSCATED_NO_YARN",
      notes: [UNOBFUSCATED_MAPPING_HINT, `26.1+ 无混淆层（version=${version}），无需反混淆。`],
      action: actionable(
        ActionCodes.DATA_UNAVAILABLE,
        `26.1+ 无 Yarn/混淆映射（version=${version}）`,
        [
          "符号直接使用 Mojang 名（mojmap）",
          "查 search_neoforge_docs（默认 26.1）/ search_fabric_docs（如 26.1.2）",
        ],
        ["search_neoforge_docs", "search_fabric_docs", "query_api"],
      ),
    };
  }

  if (!token) {
    return {
      found: false,
      original: token,
      mappingEra: getMappingEra(version),
      schemaVersion: getSchemaVersion(version),
      action: actionable(
        ActionCodes.NOT_FOUND,
        "空 token",
        ["传入崩溃日志中的方法/字段/类名"],
        ["lookup_obfuscated"],
      ),
    };
  }

  const hit = resolveObfuscatedThreeWay(version, token);
  const schemaVersion = getSchemaVersion(version);

  if (hit.found && hit.kind === "method") {
    const r = hit.row;
    const owner = toDot(r.ownerClass);
    const extra = yarnOwnerNote(owner);
    return {
      found: true,
      original: token,
      kind: "method",
      obfuscated: r.official,
      intermediary: r.intermediary,
      yarn: r.yarn,
      mojang: r.official,
      ownerClass: owner,
      descriptor: r.descriptor,
      readableSignature: r.descriptor ? readableSignature(r.yarn, r.descriptor) : undefined,
      mappingEra: hit.mappingEra,
      schemaVersion,
      notes: [...(hit.notes ?? []), ...(extra ? [extra] : [])],
    };
  }
  if (hit.found && hit.kind === "field") {
    const r = hit.row;
    const owner = toDot(r.ownerClass);
    const extra = yarnOwnerNote(owner);
    return {
      found: true,
      original: token,
      kind: "field",
      obfuscated: r.official,
      intermediary: r.intermediary,
      yarn: r.yarn,
      mojang: r.official,
      ownerClass: owner,
      descriptor: r.descriptor,
      mappingEra: hit.mappingEra,
      schemaVersion,
      notes: [...(hit.notes ?? []), ...(extra ? [extra] : [])],
    };
  }
  if (hit.found && hit.kind === "class") {
    return {
      found: true,
      original: token,
      kind: "class",
      obfuscated: hit.official ?? undefined,
      intermediary: hit.intermediary ?? undefined,
      yarn: toDot(hit.named),
      mojang: hit.official ?? undefined,
      mappingEra: hit.mappingEra,
      schemaVersion,
      notes: hit.notes,
    };
  }
  if (!hit.found && hit.ambiguous) {
    return {
      found: false,
      original: token,
      kind: hit.kind,
      mappingEra: hit.mappingEra,
      schemaVersion,
      notes: [`多个${hit.kind === "method" ? "方法" : "字段"}命中，请用 convert_mapping + ownerClass 精确定位`],
      action: actionable(
        ActionCodes.AMBIGUOUS,
        `多个${hit.kind === "method" ? "方法" : "字段"}命中`,
        ["用 convert_mapping 传 ownerClass/descriptor 消歧"],
        ["convert_mapping"],
      ),
    };
  }

  return {
    found: false,
    original: token,
    mappingEra: hit.mappingEra ?? getMappingEra(version),
    schemaVersion,
    notes: hit.notes ?? [`未找到 ${token} 的映射（version=${version}）`],
    action: actionable(
      ActionCodes.NOT_FOUND,
      `未找到映射: ${token}`,
      [
        "确认 version / token 拼写",
        "mojang-hashed（m_/f_）名不在 yarn sqlite 中",
        "用 convert_mapping 传 ownerClass 再试",
      ],
      ["convert_mapping", "query_api"],
    ),
  };
}
