现在呢:阶段 1：验证与修复已有脚本

重要：Forge 文档站使用 MkDocs Material 模板，有特殊语法需处理。

1.1 fetch-forge-docs.js 验证清单







检查项



问题



修复方案





MkDocs admonition



Forge 用 !!! note、!!! warning 语法，脚本的 htmlToMd 无法识别



预处理阶段在 HTML 中将 <div class="admonition"> 转为 > **Note**: 格式





代码块语言标注



Forge 文档很多代码块只用缩进，缺少 ```java 标记



自动检测 public class、@Mod、build.gradle 等模式，补全语言标识





dry-run 输出



无标签预测列



输出中增加"标签预测"列（根据 URL 路径自动打标）





重定向处理



部分页面是重定向



脚本已跟随 301/302，验证是否生效





导航栏剥离



<nav> 标签已处理



验证 md-sidebar、md-header 是否完全剥离

验证命令：node scripts/fetch-forge-docs.js --dry-run，观察：





URL 列表是否完整（尤其是 ⭐ 章节）



标签预测列是否正确（/registries/ → registry）

1.2 process-forge-docs.js 验证清单







检查项



问题



修复方案





L1 截断



200 字符截断可能在句子中间



截断时回溯找最后一个句号





L2 索引



当前存完整内容会导致 JSON 过大



index-l2.json 只存元数据 { id, file, sections, keyCount }，不存正文





关键标记



正则需覆盖 Forge 实际写法



增加匹配：!!! warning、!!! important、!!! tip、!!! note、> **Warning**





⭐ 判断



当前硬编码关键词列表



改为引用配置 forge-docs/priority-urls.json，可维护



阶段 2：实际爬取 Forge 1.20.1 文档

node scripts/fetch-forge-docs.js --dry-run --version 1.20.1  # 先看 URL + 标签
# 确认无误后：
node scripts/fetch-forge-docs.js --version 1.20.1

目录结构调整（采纳 raw/ 与 processed/ 分离建议）：

data/forge-docs/1.20.1/
├── _manifest.json              # 元数据（来自 fetch 脚本）
├── raw/                         # 原始 .md（MCP 工具不读，仅调试用）
│   ├── gettingstarted.md
│   ├── concepts_registries.md
│   └── ...
├── index-l0.json                # L0 索引
├── index-l1.json                # L1 摘要
├── index-l2.json                # L2 全文索引（仅元数据）
└── processed/                   # L2+ 关键标记文件（MCP 工具读取目标）
    ├── gettingstarted.md
    ├── concepts_registries.md
    └── ...

爬取优先级（分两批）：





第一批 ⭐（约 12 个，核心章节）：registries, events, sides, capabilities, networking, datagen...



第二批 🟡🟢（约 30 个，完整覆盖）



阶段 3：预处理文档

node scripts/process-forge-docs.js --version 1.20.1

预处理产出（已在阶段 2 目录结构中体现）：





index-l0.json — L0 索引（标题 + URL + 标签 + 优先级）



index-l1.json — L1 摘要（每个 h2 标题 + 150-200 字摘要）



index-l2.json — L2 元数据（文件路径 + 章节数 + 关键段落数）



processed/*.md — L2+ 文件（含 <!-- key:🔴 --> 等关键标记）



阶段 4：ForgeDocStore 数据访问层（新增）

新增文件 mcp-server/src/forge-docs/store.ts：

class ForgeDocStore {
  // 内存缓存：避免每次工具调用都读磁盘
  private cache = new Map<string, { data: unknown; expiry: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  searchIndex(query: string, version: string, tags?: string[]): SearchResult[]
  // 加载 index-l0.json，模糊匹配 label + tags

  loadSummary(id: string, version: string): SummaryResult
  // 加载 index-l1.json

  loadFullDoc(id: string, version: string, highlightKey?: boolean): FullDocResult
  // 读取 processed/*.md，highlightKey=true 时提取 <!-- key:* --> 段落放在开头
}

好处：三个工具共享 Store，缓存复用，未来可替换为 SQLite 而不改动工具层。



阶段 5：实现 forge-docs 模块

mcp-server/src/forge-docs/index.ts（薄封装，调用 Store）：

import { ForgeDocStore } from "./store.js";

const store = new ForgeDocStore(join(__dirname, "..", "..", "data", "forge-docs"));

// 工具 1：search_forge_docs
server.registerTool("search_forge_docs", {
  description: `Forge 官方文档搜索（L0 索引）。
    1. 先调用 search_forge_docs(query) 找出相关页面。
    2. 对于可能相关的页面，调用 get_forge_doc_summary 获取摘要。
    3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_forge_doc_full。
    4. 对于注册/事件/能力/网络等核心课题，建议直接调用 get_forge_doc_full 并启用 highlight_key=true。
    5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。`,
  inputSchema: {
    query: z.string().describe("搜索关键词"),
    version: z.string().optional().describe("版本，默认 1.20.1"),
    tags: z.array(z.string()).optional().describe("标签过滤：registry, event, capability, networking, datagen, sides"),
  }
}, async ({ query, version, tags }) => {
  const result = store.searchIndex(query, version ?? "1.20.1", tags);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// 工具 2：get_forge_doc_summary
server.registerTool("get_forge_doc_summary", {
  description: "获取 Forge 文档页面的章节骨架与摘要，用于判断是否需要深入。",
  inputSchema: {
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回"),
    version: z.string().optional(),
  }
}, async ({ id, version }) => {
  return { content: [{ type: "text", text: JSON.stringify(store.loadSummary(id, version ?? "1.20.1"), null, 2) }] };
});

// 工具 3：get_forge_doc_full
server.registerTool("get_forge_doc_full", {
  description: "获取 Forge 文档页面全文。highlight_key=true 时，关键要点（🔴🟠🟢⭐）会突出显示在开头。",
  inputSchema: {
    id: z.string().describe("页面 ID"),
    version: z.string().optional(),
    highlight_key: z.boolean().optional().describe("true 时提取并突出关键段落"),
  }
}, async ({ id, version, highlight_key }) => {
  return { content: [{ type: "text", text: JSON.stringify(store.loadFullDoc(id, version ?? "1.20.1", highlight_key), null, 2) }] };
});



阶段 6：注册工具到 MCP Server

修改 mcp-server/src/index.ts：





import 来自 ./forge-docs/index.js



工具总数：8 → 11 个



阶段 7：更新文档







文件



更新内容





mcp-server/README.md



工具列表加入 3 个新工具，注明数据来源为 Forge 官方文档





README.md（根目录）



将"Phase 3 提供 8 个工具"改为"Phase 3 提供 **11 个工具，包括 Forge 官方文档分层搜索能力"



数据流图

flowchart TB
    subgraph "预处理一次性"
        direction LR
        F[fetch-forge-docs.js<br/>raw/*.md]
        --> P[process-forge-docs.js<br/>L0/L1/L2 + processed/*.md]
    end

    subgraph "本地存储 data/forge-docs/1.20.1/"
        direction TB
        L0[index-l0.json]
        L1[index-l1.json]
        L2[index-l2.json<br/>仅元数据]
        RAW[raw/ <br/>原始文件]
        PLUS[processed/ <br/>L2+ 关键标记]
        L0 & L1 & L2 --> PLUS
    end

    subgraph "ForgeDocStore 共享层"
        direction TB
        S[searchIndex]
        SS[loadSummary]
        FF[loadFullDoc]
        CF[内存缓存<br/>5min TTL]
        S & SS & FF -.使用.-> CF
    end

    subgraph "MCP 工具"
        T1[search_forge_docs<br/>L0 搜索]
        T2[get_forge_doc_summary<br/>L1 摘要]
        T3[get_forge_doc_full<br/>L2/L2+ 全文]
    end

    F -.爬取.-> RAW
    P -.产出.-> L0 & L1 & L2 & PLUS
    T1 -.调用.-> S
    T2 -.调用.-> SS
    T3 -.调用.-> FF
    S -.读取.-> L0
    SS -.读取.-> L1
    FF -.读取.-> PLUS



关键文件清单







操作



文件路径





修复



mcp-server/scripts/fetch-forge-docs.js





修复



mcp-server/scripts/process-forge-docs.js





新建



mcp-server/src/forge-docs/store.ts





新建



mcp-server/src/forge-docs/index.ts





修改



mcp-server/src/index.ts





新建



mcp-server/data/forge-docs/1.20.1/raw/*.md（爬取产出）





新建



mcp-server/data/forge-docs/1.20.1/index-l*.json（索引产出）





新建



mcp-server/data/forge-docs/1.20.1/processed/*.md（关键标记产出）





修改



mcp-server/README.md





修改



README.md（根目录）