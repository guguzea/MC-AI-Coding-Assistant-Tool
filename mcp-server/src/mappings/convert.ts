/**
 * convert_mapping 主逻辑：统一走 mapping SQLite，禁止假成功。
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../utils/path.js";
import {
  convertYarnMember,
  getMappingEra,
  lookupMethod,
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
}

export interface MappingResult {
  found: boolean;
  original: string;
  converted: string | null;
  direction: string;
  confidence: "high" | "medium" | "low";
  mappingType: "class" | "method" | "parameter" | "field";
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

function descriptorToReturnType(desc: string): string {
  const map: Record<string, string> = {
    B: "byte",
    C: "char",
    D: "double",
    F: "float",
    I: "int",
    J: "long",
    S: "short",
    Z: "boolean",
    V: "void",
  };
  const last = desc.slice(desc.lastIndexOf(")") + 1);
  return map[last] ?? `Object(${last})`;
}

function fail(query: MappingQuery, extras: Partial<MappingResult> = {}): MappingResult {
  const allow = query.allow_fallback === true;
  const { notes, ...rest } = extras;
  return {
    found: false,
    original: query.memberName,
    converted: allow ? query.memberName : null,
    direction: `${query.from}→${query.to}`,
    confidence: "low",
    mappingType: query.ownerClass ? "method" : "class",
    fallbackUsed: allow,
    resultKind: allow ? "fallback-identity" : extras.resultKind,
    deprecation: allow ? "allow_fallback will be removed" : undefined,
    ...rest,
    notes,
  };
}

function outputFromMethodRow(
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

  if (from === to) {
    return {
      found: true,
      original: memberName,
      converted: memberName,
      direction: `${from}→${to}`,
      confidence: "high",
      mappingType: ownerClass ? "method" : "class",
      resultKind: "identity",
      fallbackUsed: false,
      mappingEra: era,
    };
  }

  if ((from === "mcp" || from === "parchment") && (to === "mcp" || to === "parchment")) {
    return {
      found: true,
      original: memberName,
      converted: memberName,
      direction: `${from}↔${to}`,
      confidence: "high",
      mappingType: ownerClass ? "method" : "class",
      resultKind: "identity",
      fallbackUsed: false,
      mappingEra: era,
      notes: [
        "Parchment = MCP 层 + 人类可读参数名，类名/方法名完全一致",
        "参数名请使用 get_method_params",
      ],
    };
  }

  const wantMethod =
    Boolean(ownerClass) ||
    era === "mcp-csv" ||
    /^func_/.test(memberName) ||
    Boolean(descriptor);

  if (wantMethod && dbPath) {
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
      });
    }
    if (looked.resultKind === "csv-no-owner") {
      return fail(query, {
        resultKind: "csv-no-owner",
        mappingEra: looked.mappingEra ?? era,
        mappingType: "method",
        notes: looked.notes,
      });
    }
    if (looked.found && looked.row) {
      const converted = outputFromMethodRow(looked.row, to);
      return {
        found: true,
        original: memberName,
        converted,
        direction: `${from}→${to}`,
        confidence: "high",
        mappingType: "method",
        fallbackUsed: false,
        mappingEra: looked.mappingEra ?? era,
        official: looked.row.name_official,
        named: looked.row.name_named,
        intermediary: looked.row.name_intermediary ?? undefined,
        notes: looked.notes,
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
        });
      }
    }
    return fail(query, {
      mappingType: "method",
      mappingEra: era,
      notes: looked.notes ?? [`未找到方法映射: ${memberName}`],
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
        fallbackUsed: false,
        mappingEra: era,
        official: yarn.row?.official ?? undefined,
        named: yarn.row?.named,
        intermediary: yarn.row?.intermediary,
        notes: yarn.notes,
      };
    }
    return fail(query, {
      mappingType: "class",
      mappingEra: era,
      notes: yarn.notes,
    });
  }

  return fail(query, {
    mappingEra: era,
    notes: [
      `未找到 mapping sqlite：${version}`,
      "请运行 build:yarn-sqlite；Forge 1.16+ 通常需要同版本 fabric_* tiny",
    ],
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
  javadoc?: string;
  note?: string;
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
    };
  }

  const m = methods[0];
  return {
    found: true,
    className,
    methodName,
    parameters: m.parameters.map((p) => ({ index: p.index, name: p.name })),
    descriptor: m.descriptor,
    returnType: descriptorToReturnType(m.descriptor),
    javadoc: m.javadoc ?? undefined,
    note:
      methods.length > 1
        ? `找到 ${methods.length} 个重载，请使用 descriptor 参数精确定位`
        : undefined,
  };
}

export { suggestSimilarMethods };
