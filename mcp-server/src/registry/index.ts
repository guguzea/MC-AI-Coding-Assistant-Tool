import { actionable, ActionCodes, withAction, versionRequiredAction, missingMcVersion } from "../utils/actionable.js";
import { isSafeVersionSegment } from "../utils/minecraft-version.js";
import { searchRegistryEntries, listRegistryNames, registryDataAvailable, registryOpenError } from "./store.js";

export { buildRegistryIndex, vanillaRegistryDir, vanillaRegistrySqlitePath } from "./builder.js";
export {
  searchRegistryEntries,
  listRegistryNames,
  registryDataAvailable,
  registryOpenError,
  closeRegistryDbs,
} from "./store.js";

export interface QueryRegistryInput {
  registry?: string;
  query: string;
  version?: string;
  limit?: number;
}

export interface QueryRegistryResult {
  found: boolean;
  matches: Array<{ registry: string; id: string; translationKey?: string | null }>;
  nameLayer: "registry_id";
  version: string;
  availableRegistries?: string[];
  relatedTools: string[];
  notes: string[];
  action?: ReturnType<typeof actionable>;
  /** 查询串像 Java 类/成员名（`registry` 工具仍按 registry id 匹配了一次）。 */
  looksLikeJavaIdentifier?: boolean;
}

function looksLikeJavaIdentifier(q: string): boolean {
  const t = q.trim();
  if (t.includes(":")) return false;
  if (/^func_\d+/.test(t) || /^method_\d+/.test(t) || /^m_\d+_/.test(t)) return false;
  return t.includes(".") || /^[A-Z]/.test(t);
}

/**
 * C-3（2026-09-22 S9/T2）：`version` 必须是**纯数字点分形状**的 allowlist token。
 * 此前这里只做 `trim()`，于是 `--version=../forge_1.20.1` 会被接受，并被原样回显进
 * `notes[]` / `action.message`（实测出货 `未找到 data/vanilla_../forge_1.20.1/registries/ 索引`）
 * —— 那是一条「文件系统布局 + 目录存在性探测」的泄漏面（**不是**任意写 / RCE：本工具只读）。
 * 用黑名单替换（strip `..` / `/`）不算修：漏一个字符就复活。这里改用仓库既有白名单
 * `isSafeVersionSegment`（`VERSION_SEGMENT_RE`，src/utils/minecraft-version.ts:105）——
 * 与 `src/api/index.ts:293` / `src/mappings/convert.ts:89` / `yarn-sqlite.ts:33` 同源，不再自带一份正则。
 * 前导 `v` 先按 `vanillaRegistryDir()` 的 `replace(/^v/i, "")` 同一规则剥掉，免得把该写法判成非法。
 * 允许 `9.9.9` 这类**不存在但形状合法**的档位（那是「索引没建」路径的既有测试夹具，
 * 见 test-wave-bcd.mjs 的 9.9.8 / 9.9.9），allowlist 只拦穿越、不代替版本存在性判定。
 */
function safeRegistryVersion(version: string): string | null {
  const v = version.trim().replace(/^v/i, "");
  return isSafeVersionSegment(v) ? v : null;
}

export function queryRegistry(input: QueryRegistryInput): QueryRegistryResult {
  if (missingMcVersion(input.version)) {
    return {
      found: false,
      matches: [],
      nameLayer: "registry_id",
      version: "",
      relatedTools: ["convert_mapping", "query_api"],
      notes: ["请指定 version，禁止默认 1.20.1"],
      action: versionRequiredAction(),
    };
  }
  const safeVersion = safeRegistryVersion(input.version!);
  if (safeVersion === null) {
    // 拒绝且**不回显**该 token（回显就是把穿越串再送出货一次）；不落到 registryDataAvailable。
    return {
      found: false,
      matches: [],
      nameLayer: "registry_id",
      version: "",
      relatedTools: ["convert_mapping", "query_api"],
      notes: [
        "version 形状非法：只接受点分数字版本 token（可选前导 v），如 1.20.1 / 1.21.11 / 26.1。",
        "本工具不回显被拒绝的入参；请先 list_doc_versions 取本仓已入库档位。",
      ],
      action: actionable(
        ActionCodes.INVALID_INPUT,
        "version 形状非法（疑似路径片段），已拒绝；registry 只接受点分数字 MC 版本 token",
        ["改传 1.20.1 / 1.21.11 / 26.1 这类点分数字版本", "先 list_doc_versions 看已入库档位"],
        ["list_doc_versions"],
      ),
    };
  }
  const version = safeVersion;
  const query = input.query.trim();
  const relatedTools = ["convert_mapping", "query_api"];
  const notes = [
    "注册表 id 为 Mojang 资源 ID（namespace:path），与 MCP/Yarn 类名不是同一层。",
    "如需类/方法映射名，请用 convert_mapping 或 query_api。",
  ];

  if (!registryDataAvailable(version)) {
    // Y-1（sweep81 结构化信封）：区分「索引没建」与「建了但 sqlite 损坏」——两者对用户的
    // 下一步完全不同（重建 vs 重装/报环境），此前都塌缩成同一句「数据不可用」。
    const openErr = registryOpenError(version);
    if (openErr) {
      return withAction(
        {
          found: false,
          matches: [],
          nameLayer: "registry_id",
          version,
          relatedTools,
          notes: [
            ...notes,
            `registry sqlite 打开失败（损坏或格式不兼容）：${openErr}`,
          ],
        },
        actionable(
          ActionCodes.DATA_UNAVAILABLE,
          `Vanilla registry 索引损坏（${version}）：registry-index.sqlite 无法打开`,
          [
            `删除或重建 data/vanilla_${version}/registries/registry-index.sqlite（在 mcp-server 目录执行: npm run build:vanilla-registries -- --version ${version} --force）`,
            "若反复损坏，先检查磁盘/同步盘对该文件的占用（OneDrive 等在线占位会导致读取失败）",
          ],
          ["diagnose_data_paths"],
        ),
      );
    }
    return withAction(
      {
        found: false,
        matches: [],
        nameLayer: "registry_id",
        version,
        relatedTools,
        notes: [
          ...notes,
          `未找到 data/vanilla_${version}/registries/ 索引；请先运行 npm run build:vanilla-registries -- --version ${version}`,
        ],
      },
      actionable(
        ActionCodes.DATA_UNAVAILABLE,
        `Vanilla registry 数据不可用（${version}）`,
        [
          `在 mcp-server 目录执行: npm run build:vanilla-registries -- --version ${version}`,
          "确认 data/vanilla_<ver>/registries/*.json 存在",
        ],
        ["diagnose_data_paths"],
      ),
    );
  }

  if (!query) {
    return {
      found: false,
      matches: [],
      nameLayer: "registry_id",
      version,
      availableRegistries: listRegistryNames(version),
      relatedTools,
      notes,
      action: actionable(ActionCodes.INVALID_INPUT, "query 不能为空", ["传入 namespace:path 或部分路径，如 stone"]),
    };
  }

  if (looksLikeJavaIdentifier(query)) {
    const matches = searchRegistryEntries(version, input.registry, query, input.limit ?? 25);
    const hint = actionable(
      ActionCodes.INVALID_INPUT,
      "查询看起来像 Java 类/成员名，而非 registry id",
      [
        "注册表查询请使用 minecraft:stone 等形式",
        "类/方法映射请改用 convert_mapping",
        "API 签名请改用 query_api",
      ],
      relatedTools,
    );
    const payload: QueryRegistryResult = {
      found: matches.length > 0,
      matches,
      nameLayer: "registry_id",
      version,
      relatedTools,
      notes,
    };
    // 命中了就是一次正常查询：带内 INVALID_INPUT 与 found:true 互相矛盾，只会让消费方误判失败。
    if (matches.length > 0) {
      return { ...payload, looksLikeJavaIdentifier: true };
    }
    return withAction(payload, hint);
  }

  const matches = searchRegistryEntries(version, input.registry, query, input.limit ?? 25);
  return {
    found: matches.length > 0,
    matches,
    nameLayer: "registry_id",
    version,
    relatedTools,
    notes,
    ...(matches.length === 0
      ? {
          action: actionable(
            ActionCodes.NOT_FOUND,
            `未找到匹配「${query}」的注册表条目`,
            ["检查 namespace:path 拼写", "query_registry 仅含 vanilla 索引，模组物品不会出现", "用 listRegistryNames 或省略 registry 做模糊搜索"],
            relatedTools,
          ),
        }
      : {}),
  };
}
