/**
 * convert_mapping 主逻辑：统一走 mapping SQLite，禁止假成功。
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../utils/path.js";
import { readableSignature, returnType as descriptorReturnType } from "../utils/descriptor.js";
import { ActionCodes, actionable, type ActionEnvelope } from "../utils/actionable.js";
import {
  convertYarnMember,
  getMappingEra,
  getSchemaVersion,
  lookupField,
  lookupMethod,
  resolveCsvMappingDbPath,
  resolveMappingDbPath,
} from "./yarn-sqlite.js";
import { suggestSimilarMethods } from "./suggest.js";

const DEFAULT_VERSION = "1.20.1";

export interface MappingQuery {
  from: "mojang" | "mcp" | "yarn" | "parchment";
  to: "mojang" | "mcp" | "yarn" | "parchment";
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
  to: MappingQuery["to"],
): string {
  if (to === "mojang") return row.name_official;
  if (to === "yarn") return row.name_named;
  return row.name_named;
}

function outputFromFieldRow(
  row: {
    name_named: string;
    name_official: string;
    name_intermediary: string | null;
  },
  to: MappingQuery["to"],
): string {
  if (to === "mojang") return row.name_official;
  if (to === "yarn") return row.name_named;
  return row.name_named;
}

export function convertMapping(query: MappingQuery): MappingResult {
  const version = query.version ?? DEFAULT_VERSION;
  const { from, to, memberName, ownerClass, descriptor } = query;
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

  if (kind === "field") {
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
        notes: looked.notes,
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
        notes: looked.notes,
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
      const cls = apiIndex[toSlash(ownerClass)];
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
        notes: yarn.notes,
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
}

export function getMethodParams(query: ParamQuery): ParamResult {
  const version = query.version ?? DEFAULT_VERSION;
  const { apiIndex, classNames } = loadParchment(version);
  const { className, methodName, descriptor } = query;
  const slash = toSlash(className);
  const cls = apiIndex[slash];

  if (!cls) {
    return {
      found: false,
      className,
      methodName,
      parameters: [],
      descriptor: "",
      returnType: "void",
      note: `类 ${className} 不在 ${version} 索引中（共 ${classNames.length} 个 Vanilla 类）`,
      action: actionable(
        ActionCodes.NOT_FOUND,
        `类不在索引中: ${className}`,
        ["检查完整包名", "换 version（Parchment 约 1.16.5–1.20.4）", "Forge 特有类请用 search_forge_docs"],
        ["query_api", "search_forge_docs"],
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
