/**
 * convert_mapping 主逻辑：统一走 mapping SQLite，禁止假成功。
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../utils/path.js";
import { readableSignature, returnType as descriptorReturnType } from "../utils/descriptor.js";
import { ActionCodes, actionable, versionRequiredAction, missingMcVersion, type ActionEnvelope } from "../utils/actionable.js";
import {
  convertYarnMember,
  getMappingEra,
  getSchemaVersion,
  lookupByObfuscated,
  lookupField,
  lookupMethod,
  resolveCsvMappingDbPath,
  resolveMappingDbPath,
  type MappingLayer,
} from "./yarn-sqlite.js";
import { resolveObfuscatedThreeWay } from "./lookup-obfuscated.js";
import { suggestSimilarMethods } from "./suggest.js";
import { isUnobfuscatedMcVersion, UNOBFUSCATED_MAPPING_HINT } from "./unobfuscated.js";
import { ownGet } from "../utils/own-record.js";

const DEFAULT_VERSION = "1.20.1";

export interface MappingQuery {
  from: MappingLayer;
  to: MappingLayer;
  memberName: string;
  ownerClass?: string;
  descriptor?: string;
  version?: string;
  allow_fallback?: boolean;
  /** class | method | field；缺省时按启发式推断 */
  memberKind?: "class" | "method" | "field" | "auto";
}

export interface MappingResult {
  found: boolean;
  original: string;
  converted: string | null;
  direction: string;
  confidence: "high" | "medium" | "low";
  mappingType: "class" | "method" | "parameter" | "field";
  memberKind?: "class" | "method" | "field";
  notes?: string[];
  usage?: string;
  official?: string;
  named?: string;
  intermediary?: string;
  suggestions?: string[];
  ambiguous?: boolean;
  candidates?: Array<{
    name: string;
    descriptor: string;
    official: string;
    intermediary?: string | null;
    owner?: string;
  }>;
  mappingEra?: string | null;
  resultKind?: string;
  fallbackUsed?: boolean;
  deprecation?: string;
  readableSignature?: string;
  returnType?: string;
  schemaVersion?: string | null;
  action?: ActionEnvelope;
}

type ParchmentParam = { index: number; name: string };
type ParchmentMethod = {
  name: string;
  descriptor: string;
  parameters: ParchmentParam[];
  javadoc: string | null;
};
type ParchmentClass = {
  javadoc: string | null;
  methods: ParchmentMethod[];
  fields: unknown[];
};

const _dataCache = new Map<string, { apiIndex: Record<string, ParchmentClass>; classNames: string[] }>();

function resolveVersionDataDir(version: string): string {
  return resolveDataDir(`forge_${version}`, "extracted");
}

function loadParchment(version: string): {
  apiIndex: Record<string, ParchmentClass>;
  classNames: string[];
} {
  const cached = _dataCache.get(version);
  if (cached) return cached;
  const dataDir = resolveVersionDataDir(version);
  const apiIndexPath = join(dataDir, "api-index.json");
  const classNamesPath = join(dataDir, "class-names.json");
  let apiIndex: Record<string, ParchmentClass> = {};
  let classNames: string[] = [];
  if (existsSync(apiIndexPath)) {
    apiIndex = JSON.parse(readFileSync(apiIndexPath, "utf-8"));
  }
  if (existsSync(classNamesPath)) {
    classNames = JSON.parse(readFileSync(classNamesPath, "utf-8"));
  }
  const data = { apiIndex, classNames };
  _dataCache.set(version, data);
  return data;
}

function toSlash(name: string): string {
  return name.replace(/\./g, "/");
}

function inferMemberKind(query: MappingQuery, era: string | null): "class" | "method" | "field" {
  if (query.memberKind && query.memberKind !== "auto") return query.memberKind;
  const name = query.memberName;
  if (/^field_/.test(name) || /^f_/.test(name)) return "field";
  if (
    query.ownerClass ||
    query.descriptor ||
    /^func_/.test(name) ||
    /^method_/.test(name) ||
    /^m_/.test(name)
  ) {
    return "method";
  }
  // 纯 CSV（1.14–1.15）无类表：裸名默认按方法/字段全局表查
  if (era === "mcp-csv" && !name.includes("/") && !/\.[A-Z]/.test(name)) {
    return "method";
  }
  // bare name + no owner → class
  if (!query.ownerClass) return "class";
  return "method";
}

function fail(query: MappingQuery, extras: Partial<MappingResult> = {}): MappingResult {
  const allow = query.allow_fallback === true;
  const { notes, action, ...rest } = extras;
  const kind = extras.mappingType ?? (query.ownerClass ? "method" : "class");
  let resolvedAction = action;
  if (!resolvedAction) {
    if (extras.resultKind === "csv-no-owner") {
      resolvedAction = actionable(
        ActionCodes.CSV_NO_OWNER,
        "纯 CSV 版本不支持 ownerClass",
        ["去掉 ownerClass，用 searge（func_/field_）或 MCP named 全局查询", "或改用 1.16+ Yarn 版本"],
        ["convert_mapping"],
      );
    } else if (extras.ambiguous) {
      resolvedAction = actionable(
        ActionCodes.AMBIGUOUS,
        "存在多个候选映射",
        ["传入 descriptor 消歧", "确认 ownerClass 完整包名", "查看 candidates"],
        ["convert_mapping", "query_api"],
      );
    } else if (extras.resultKind === "SCHEMA_FIELDS_UNAVAILABLE") {
      resolvedAction = actionable(
        ActionCodes.SCHEMA_FIELDS_UNAVAILABLE,
        "当前 sqlite 为 schema v2，无 fields 表",
        ["运行 npm run build:yarn-sqlite --all 重建为 schema v3", "或改查 method/class"],
        ["get_server_status"],
      );
    } else {
      resolvedAction = actionable(
        allow ? ActionCodes.FALLBACK_IDENTITY : ActionCodes.NOT_FOUND,
        allow ? "未命中映射，已按 allow_fallback 回传原名" : "未找到映射",
        [
          "确认 version / from / to / ownerClass",
          "方法重载请传 descriptor",
          "字段查询需 schema v3（memberKind=field）",
          "运行 build:yarn-sqlite 确保数据存在",
        ],
        ["convert_mapping", "query_api", "get_server_status"],
      );
    }
  }
  return {
    found: false,
    original: query.memberName,
    converted: allow ? query.memberName : null,
    direction: `${query.from}→${query.to}`,
    confidence: "low",
    mappingType: kind,
    memberKind: kind === "parameter" ? "method" : kind,
    fallbackUsed: allow,
    resultKind: allow ? "fallback-identity" : extras.resultKind,
    deprecation: allow ? "allow_fallback will be removed" : undefined,
    schemaVersion: getSchemaVersion(query.version ?? DEFAULT_VERSION),
    ...rest,
    notes,
    action: resolvedAction,
  };
}

function outputFromMethodRow(
  row: {
    name_named: string;
    name_official: string;
    name_intermediary: string | null;
    descriptor_named?: string;
  },
  to: MappingLayer,
): string {
  if (to === "mojang" || to === "obfuscated") return row.name_official;
  if (to === "intermediary") return row.name_intermediary ?? row.name_named;
  if (to === "yarn") return row.name_named;
  return row.name_named;
}

function outputFromFieldRow(
  row: {
    name_named: string;
    name_official: string;
    name_intermediary: string | null;
  },
  to: MappingLayer,
): string {
  if (to === "mojang" || to === "obfuscated") return row.name_official;
  if (to === "intermediary") return row.name_intermediary ?? row.name_named;
  if (to === "yarn") return row.name_named;
  return row.name_named;
}

export function convertMapping(query: MappingQuery): MappingResult {
  const { from, to, memberName, ownerClass, descriptor } = query;
  const direction = `${from}→${to}`;
  if (missingMcVersion(query.version)) {
    return {
      found: false,
      original: memberName,
      converted: null,
      direction,
      confidence: "low",
      mappingType: "class",
      notes: ["请指定 version，禁止默认 1.20.1"],
      action: versionRequiredAction(),
    };
  }
  const version = query.version!.trim();

  // 5.5 兼容：to=mojang 保持旧行为（混淆短名），notes 提示改用 obfuscated 层
  const mojangHint =
    to === "mojang"
      ? ["to=mojang 返回混淆短名（obfuscated 层）；如需可读名请用 to=yarn / query_api"]
      : [];

  if (isUnobfuscatedMcVersion(version)) {
    const legacyLayers: MappingLayer[] = ["yarn", "mcp", "obfuscated", "intermediary"];
    const usesLegacyLayer = legacyLayers.includes(from) || legacyLayers.includes(to);
    const identityReadable =
      (from === "mojang" || from === "parchment") && (to === "mojang" || to === "parchment");
    if (usesLegacyLayer || !identityReadable) {
      return {
        found: false,
        original: memberName,
        converted: null,
        direction,
        confidence: "low",
        mappingType: "class",
        notes: [UNOBFUSCATED_MAPPING_HINT, `拒绝在 version=${version} 上做 Yarn/MCP/跨混淆层 remap。`],
        resultKind: "UNOBFUSCATED_NO_YARN",
        action: actionable(
          ActionCodes.DATA_UNAVAILABLE,
          `26.1+ 无 Yarn/混淆映射（version=${version}）`,
          [
            "符号直接使用 Mojang 名（mojmap）",
            "查 search_neoforge_docs（默认 26.1）/ search_fabric_docs（如 26.1.2）",
            "勿对 26.x 运行 build:yarn-sqlite",
          ],
          ["search_neoforge_docs", "search_fabric_docs", "query_api"],
        ),
      };
    }
    return {
      found: true,
      original: memberName,
      converted: memberName,
      direction,
      confidence: "high",
      mappingType: "class",
      notes: [UNOBFUSCATED_MAPPING_HINT, "mojang/parchment 在去混淆版本上视为同一可读名（恒等）。"],
      resultKind: "UNOBFUSCATED_IDENTITY",
    };
  }

  const era = getMappingEra(version);
  const dbPath = resolveMappingDbPath(version);
  const schemaVersion = getSchemaVersion(version);
  const kind = inferMemberKind(query, era);

  if (from === to) {
    return {
      found: true,
      original: memberName,
      converted: memberName,
      direction: `${from}→${to}`,
      confidence: "high",
      mappingType: kind,
      memberKind: kind,
      resultKind: "identity",
      fallbackUsed: false,
      mappingEra: era,
      schemaVersion,
    };
  }

  if ((from === "mcp" || from === "parchment") && (to === "mcp" || to === "parchment")) {
    return {
      found: true,
      original: memberName,
      converted: memberName,
      direction: `${from}↔${to}`,
      confidence: "high",
      mappingType: kind,
      memberKind: kind,
      resultKind: "identity",
      fallbackUsed: false,
      mappingEra: era,
      schemaVersion,
      notes: [
        "Parchment = MCP 层 + 人类可读参数名，类名/方法名完全一致",
        "参数名请使用 get_method_params",
      ],
    };
  }

  // yarn-tiny 库（fabric 1.14.4–1.21.x）的 named 层是 Yarn 名，不存在 MCP/Parchment 可读层。
  // 把 Yarn 名当 MCP/Parchment 名返回属于假成功（禁止假成功），直接拒绝并指路。
  // 例外：1.14.4 / 1.15.2 存在 mcp-csv searge 层，成员级 SRG↔named 走 CSV 路径照常可答。
  if (era === "yarn-tiny" && (to === "mcp" || to === "parchment") && !resolveCsvMappingDbPath(version)) {
    return {
      found: false,
      original: memberName,
      converted: null,
      direction,
      confidence: "low",
      mappingType: kind,
      memberKind: kind,
      resultKind: "YARN_TINY_NO_MCP_LAYER",
      fallbackUsed: false,
      mappingEra: era,
      schemaVersion,
      notes: [
        `version=${version} 只有 yarn-tiny 数据（named 列为 Yarn 名），没有 MCP/Parchment 可读层，拒绝把 Yarn 名冒充 ${to} 名返回。`,
        "需要 Mojang/Parchment 可读名请用 query_api / get_method_params（Parchment 索引约 1.16.5–1.20.4）。",
        "或改 to=yarn 获取 Yarn 名。",
      ],
      action: actionable(
        ActionCodes.DATA_UNAVAILABLE,
        `yarn-tiny 数据无 ${to} 可读层（version=${version}）`,
        [
          "Mojang/Parchment 可读名改用 query_api / get_method_params",
          "或改 to=yarn",
        ],
        ["query_api", "get_method_params"],
      ),
    };
  }

  // 无 owner + obfuscated/intermediary + auto：method→field→class 三路（与 lookup_obfuscated 同语义）
  // 禁止仅判 class 后假 NOT_FOUND（短名 er 既可能是方法也可能是类）
  const autoKind = !query.memberKind || query.memberKind === "auto";
  if (
    !ownerClass &&
    autoKind &&
    (from === "obfuscated" || from === "intermediary") &&
    dbPath
  ) {
    const hit = resolveObfuscatedThreeWay(version, memberName);
    if (hit.found && hit.kind === "method") {
      const r = hit.row;
      const converted = outputFromMethodRow(
        {
          name_named: r.yarn,
          name_official: r.official,
          name_intermediary: r.intermediary,
          descriptor_named: r.descriptor,
        },
        to,
      );
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "method",
        memberKind: "method",
        fallbackUsed: false,
        mappingEra: hit.mappingEra ?? era,
        official: r.official,
        named: r.yarn,
        intermediary: r.intermediary || undefined,
        notes: mojangHint.length ? [...(hit.notes ?? []), ...mojangHint] : hit.notes,
        schemaVersion,
        ...(r.descriptor
          ? {
              readableSignature: readableSignature(converted, r.descriptor),
              returnType: descriptorReturnType(r.descriptor),
            }
          : {}),
      };
    }
    if (hit.found && hit.kind === "field") {
      const r = hit.row;
      const converted = outputFromFieldRow(
        {
          name_named: r.yarn,
          name_official: r.official,
          name_intermediary: r.intermediary,
        },
        to,
      );
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "field",
        memberKind: "field",
        fallbackUsed: false,
        mappingEra: hit.mappingEra ?? era,
        official: r.official,
        named: r.yarn,
        intermediary: r.intermediary || undefined,
        notes: mojangHint.length ? [...(hit.notes ?? []), ...mojangHint] : hit.notes,
        schemaVersion,
      };
    }
    if (hit.found && hit.kind === "class") {
      let converted: string;
      if (to === "mojang" || to === "obfuscated") converted = hit.official ?? memberName;
      else if (to === "intermediary") converted = hit.intermediary ?? hit.named;
      else converted = hit.named.replace(/\//g, ".");
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "class",
        memberKind: "class",
        fallbackUsed: false,
        mappingEra: hit.mappingEra ?? era,
        official: hit.official ?? undefined,
        named: hit.named.replace(/\//g, "."),
        intermediary: hit.intermediary ?? undefined,
        notes: mojangHint.length ? [...(hit.notes ?? []), ...mojangHint] : hit.notes,
        schemaVersion,
      };
    }
    if (!hit.found && hit.ambiguous) {
      return fail(query, {
        ambiguous: true,
        candidates: hit.rows.map((r) => ({
          name: r.yarn,
          descriptor: r.descriptor,
          official: r.official,
          intermediary: r.intermediary,
          owner: r.ownerClass,
        })),
        mappingEra: hit.mappingEra ?? era,
        mappingType: hit.kind,
        notes: hit.notes,
        schemaVersion,
      });
    }
    return fail(query, {
      mappingType: kind,
      mappingEra: hit.mappingEra ?? era,
      notes: hit.notes ?? [`未找到映射: ${memberName}`],
      schemaVersion,
    });
  }

  if (kind === "field") {
    // obfuscated/intermediary 层支持无 owner 全局反查（崩溃日志单 token）
    if (!ownerClass && (from === "obfuscated" || from === "intermediary")) {
      const hit = lookupByObfuscated(version, memberName, "field");
      if (hit.found && hit.rows && hit.rows.length === 1) {
        const r = hit.rows[0];
        const converted = outputFromFieldRow(
          { name_named: r.yarn, name_official: r.official, name_intermediary: r.intermediary },
          to,
        );
        return {
          found: true,
          original: memberName,
          converted,
          direction: `${from}→${to}`,
          confidence: "high",
          mappingType: "field",
          memberKind: "field",
          fallbackUsed: false,
          mappingEra: hit.mappingEra ?? era,
          official: r.official,
          named: r.yarn,
          intermediary: r.intermediary || undefined,
          notes: mojangHint.length ? [...(hit.notes ?? []), ...mojangHint] : hit.notes,
          schemaVersion,
        };
      }
      if (hit.found && hit.rows && hit.rows.length > 1) {
        return fail(query, {
          ambiguous: true,
          candidates: hit.rows.map((r) => ({
            name: r.yarn,
            descriptor: r.descriptor,
            official: r.official,
            intermediary: r.intermediary,
            owner: r.ownerClass,
          })),
          mappingEra: hit.mappingEra ?? era,
          mappingType: "field",
          notes: hit.notes,
          schemaVersion,
        });
      }
    }
    const looked = lookupField(version, {
      ownerClass,
      memberName,
      descriptor,
      from,
    });
    if (looked.resultKind === "SCHEMA_FIELDS_UNAVAILABLE") {
      return fail(query, {
        mappingType: "field",
        mappingEra: looked.mappingEra ?? era,
        resultKind: "SCHEMA_FIELDS_UNAVAILABLE",
        notes: looked.notes,
        schemaVersion,
      });
    }
    if (looked.ambiguous) {
      return fail(query, {
        ambiguous: true,
        candidates: looked.candidates,
        mappingEra: looked.mappingEra ?? era,
        mappingType: "field",
        notes: looked.notes,
        schemaVersion,
      });
    }
    if (looked.found && looked.row) {
      const converted = outputFromFieldRow(looked.row, to);
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "field",
        memberKind: "field",
        fallbackUsed: false,
        mappingEra: looked.mappingEra ?? era,
        official: looked.row.name_official,
        named: looked.row.name_named,
        intermediary: looked.row.name_intermediary ?? undefined,
        notes: mojangHint.length ? [...(looked.notes ?? []), ...mojangHint] : looked.notes,
        schemaVersion,
      };
    }
    return fail(query, {
      mappingType: "field",
      mappingEra: era,
      notes: looked.notes ?? [`未找到字段映射: ${memberName}`],
      schemaVersion,
    });
  }

  const wantMethod =
    kind === "method" ||
    Boolean(ownerClass) ||
    era === "mcp-csv" ||
    Boolean(resolveCsvMappingDbPath(version) && !ownerClass) ||
    /^func_/.test(memberName) ||
    Boolean(descriptor);

  // 有全局 CSV（1.14–1.15 Forge）时，即使启发式判成 class 也要走方法表（getHealth 等裸名）
  const allowCsvMethodPath = Boolean(resolveCsvMappingDbPath(version) && !ownerClass);
  if (wantMethod && dbPath && (kind !== "class" || allowCsvMethodPath)) {
    // obfuscated/intermediary 层支持无 owner 全局反查（崩溃日志单 token）
    if (!ownerClass && (from === "obfuscated" || from === "intermediary")) {
      const hit = lookupByObfuscated(version, memberName, "method");
      if (hit.found && hit.rows && hit.rows.length === 1) {
        const r = hit.rows[0];
        const converted = outputFromMethodRow(
          {
            name_named: r.yarn,
            name_official: r.official,
            name_intermediary: r.intermediary,
            descriptor_named: r.descriptor,
          },
          to,
        );
        return {
          found: true,
          original: memberName,
          converted,
          direction: `${from}→${to}`,
          confidence: "high",
          mappingType: "method",
          memberKind: "method",
          fallbackUsed: false,
          mappingEra: hit.mappingEra ?? era,
          official: r.official,
          named: r.yarn,
          intermediary: r.intermediary || undefined,
          notes: mojangHint.length ? [...(hit.notes ?? []), ...mojangHint] : hit.notes,
          schemaVersion,
          ...(r.descriptor
            ? {
                readableSignature: readableSignature(converted, r.descriptor),
                returnType: descriptorReturnType(r.descriptor),
              }
            : {}),
        };
      }
      if (hit.found && hit.rows && hit.rows.length > 1) {
        return fail(query, {
          ambiguous: true,
          candidates: hit.rows.map((r) => ({
            name: r.yarn,
            descriptor: r.descriptor,
            official: r.official,
            intermediary: r.intermediary,
            owner: r.ownerClass,
          })),
          mappingEra: hit.mappingEra ?? era,
          mappingType: "method",
          notes: hit.notes,
          schemaVersion,
        });
      }
    }
    const looked = lookupMethod(version, {
      ownerClass,
      memberName,
      descriptor,
      from,
    });
    if (looked.ambiguous) {
      return fail(query, {
        ambiguous: true,
        candidates: looked.candidates,
        mappingEra: looked.mappingEra ?? era,
        mappingType: "method",
        notes: looked.notes,
        schemaVersion,
      });
    }
    if (looked.resultKind === "csv-no-owner") {
      return fail(query, {
        resultKind: "csv-no-owner",
        mappingEra: looked.mappingEra ?? era,
        mappingType: "method",
        notes: looked.notes,
        schemaVersion,
      });
    }
    if (looked.found && looked.row) {
      const converted = outputFromMethodRow(looked.row, to);
      const desc = looked.row.descriptor_named || descriptor || "";
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "method",
        memberKind: "method",
        fallbackUsed: false,
        mappingEra: looked.mappingEra ?? era,
        official: looked.row.name_official,
        named: looked.row.name_named,
        intermediary: looked.row.name_intermediary ?? undefined,
        notes: mojangHint.length ? [...(looked.notes ?? []), ...mojangHint] : looked.notes,
        schemaVersion,
        ...(desc
          ? {
              readableSignature: readableSignature(converted, desc),
              returnType: descriptorReturnType(desc),
            }
          : {}),
      };
    }

    if (ownerClass) {
      const { apiIndex } = loadParchment(version);
      const cls = ownGet(apiIndex, toSlash(ownerClass));
      if (cls) {
        const suggestions = suggestSimilarMethods(
          memberName,
          cls.methods.map((m) => m.name),
        );
        return fail(query, {
          mappingType: "method",
          mappingEra: era,
          suggestions,
          notes: [
            `mapping SQLite 未命中方法 ${memberName}`,
            ...(suggestions.length ? ["suggestions 仅为相似名猜测，非映射成功"] : []),
            ...(looked.notes ?? []),
          ],
          schemaVersion,
        });
      }
    }
    return fail(query, {
      mappingType: "method",
      mappingEra: era,
      notes: looked.notes ?? [`未找到方法映射: ${memberName}`],
      schemaVersion,
    });
  }

  if (dbPath) {
    const yarn = convertYarnMember(version, from, to, memberName);
    if (yarn.found) {
      return {
        found: true,
        original: memberName,
        converted: yarn.converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "class",
        memberKind: "class",
        fallbackUsed: false,
        mappingEra: era,
        official: yarn.row?.official ?? undefined,
        named: yarn.row?.named,
        intermediary: yarn.row?.intermediary,
        notes: mojangHint.length ? [...yarn.notes, ...mojangHint] : yarn.notes,
        schemaVersion,
      };
    }
    return fail(query, {
      mappingType: "class",
      mappingEra: era,
      notes: yarn.notes,
      schemaVersion,
    });
  }

  return fail(query, {
    mappingEra: era,
    notes: [
      `未找到 mapping sqlite：${version}`,
      "请运行 build:yarn-sqlite；Forge 1.16+ 通常需要同版本 fabric_* tiny",
    ],
    schemaVersion,
  });
}

export interface ParamQuery {
  className: string;
  methodName: string;
  descriptor?: string;
  version?: string;
}

export interface ParamResult {
  found: boolean;
  className: string;
  methodName: string;
  parameters: Array<{ index: number; name: string }>;
  descriptor: string;
  returnType: string;
  readableSignature?: string;
  javadoc?: string;
  note?: string;
  action?: ActionEnvelope;
  ambiguous?: boolean;
  candidates?: Array<{ descriptor: string; parameters: Array<{ index: number; name: string }> }>;
}

export function getMethodParams(query: ParamQuery): ParamResult {
  if (missingMcVersion(query.version)) {
    return {
      found: false,
      className: query.className,
      methodName: query.methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      note: "请指定 version，禁止默认 1.20.1",
      action: versionRequiredAction(),
    };
  }
  const version = query.version!.trim();
  if (isUnobfuscatedMcVersion(version) || /^1\.21(\.|$)/.test(version) || /^26\./.test(version)) {
    return {
      found: false,
      className: query.className,
      methodName: query.methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      note: `当前版本无 Vanilla API 索引，无法执行 get_method_params（found:false / DATA_UNAVAILABLE 只表示本 Parchment 索引没有该类，不代表游戏里没有）。${UNOBFUSCATED_MAPPING_HINT}`,
      action: actionable(
        ActionCodes.DATA_UNAVAILABLE,
        `API 索引未覆盖 version=${version}`,
        ["改用 search_*_docs 或 get_minecraft_source", "query_api / get_method_params 覆盖约 1.16.5–1.20.4"],
        ["search_forge_docs", "search_neoforge_docs", "search_fabric_docs", "get_minecraft_source"],
      ),
    };
  }
  const { apiIndex, classNames } = loadParchment(version);
  const { className, methodName, descriptor } = query;
  const slash = toSlash(className);
  const cls = ownGet(apiIndex, slash);

  if (!cls) {
    const empty = classNames.length === 0;
    return {
      found: false,
      className,
      methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      note: empty
        ? `version=${version} 无 extracted 方法索引（共 0 类）。found:false / DATA_UNAVAILABLE 不代表游戏里没有该类。`
        : `类 ${className} 不在 ${version} 索引中（共 ${classNames.length} 个 Vanilla 类）`,
      action: actionable(
        empty ? ActionCodes.DATA_UNAVAILABLE : ActionCodes.NOT_FOUND,
        empty ? `API 索引未覆盖 version=${version}` : `类不在索引中: ${className}`,
        empty
          ? ["改用 search_*_docs 或 get_minecraft_source"]
          : ["检查完整包名", "换 version（Parchment 约 1.16.5–1.20.4）", "Forge 特有类请用 query_loader_api / search_forge_docs"],
        ["query_api", "search_forge_docs", "search_neoforge_docs"],
      ),
    };
  }

  const methods = cls.methods.filter((m) => {
    const nameMatch = m.name === methodName;
    const descMatch = descriptor ? m.descriptor === descriptor : true;
    return nameMatch && (descriptor ? descMatch : true);
  });

  if (methods.length === 0) {
    return {
      found: false,
      className,
      methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      note: `在 ${className} 中未找到方法 ${methodName}`,
      action: actionable(
        ActionCodes.NOT_FOUND,
        `方法未找到: ${methodName}`,
        ["确认 Mojang/Parchment 方法名（非 Yarn）", "用 query_api 列出类方法"],
        ["query_api"],
      ),
    };
  }

  if (methods.length > 1 && !descriptor) {
    return {
      found: false,
      className,
      methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      ambiguous: true,
      candidates: methods.map((m) => ({
        descriptor: m.descriptor,
        parameters: m.parameters.map((p) => ({ index: p.index, name: p.name })),
      })),
      note: `方法 ${methodName} 有 ${methods.length} 个重载，请传 descriptor，不要静默取第一个`,
      action: actionable(
        ActionCodes.AMBIGUOUS,
        `多重载未指定 descriptor: ${methodName}`,
        ["从 candidates[] 选一个 descriptor 再调用 get_method_params", "或用 query_api 查看全部重载"],
        ["query_api", "get_method_params"],
      ),
    };
  }

  const m = methods[0];
  return {
    found: true,
    className,
    methodName,
    parameters: m.parameters.map((p) => ({ index: p.index, name: p.name })),
    descriptor: m.descriptor,
    returnType: descriptorReturnType(m.descriptor),
    readableSignature: readableSignature(methodName, m.descriptor),
    javadoc: m.javadoc ?? undefined,
    note:
      methods.length > 1
        ? `找到 ${methods.length} 个重载，请使用 descriptor 参数精确定位`
        : undefined,
  };
}

export { suggestSimilarMethods };
