import { actionable, ActionCodes, withAction, versionRequiredAction, missingMcVersion } from "../utils/actionable.js";
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
  const version = input.version!.trim();
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
