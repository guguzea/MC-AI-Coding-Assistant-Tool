---
name: Build fabric_1.20.1 data collection pipeline
overview: 为 fabric_1.20.1 建立完整的数据收集管道，从 4 个数据源（Fabric Docs + Fabric Wiki + Meta API）抓取数据并清洗，参照 forge_1.20.1 格式产出 L0/L1/L2 索引和 processed/ 目录，同时将现有 fabric-docs 脚本从硬编码 1.21.1 改造为通用版本参数化。
todos:
  - id: fetch-mappings
    content: 阶段0：新建 fetch-fabric-mappings.js，下载 Yarn + Parchment mappings 到 mappings/
    status: completed
  - id: fix-fabric-docs-scripts
    content: 阶段1：修复 fetch-fabric-docs.js + process-fabric-docs.js，添加 --version 参数
    status: completed
  - id: build-meta-script
    content: 阶段2：新建 fetch-fabric-meta.js，从 Meta API 构建 meta.json
    status: completed
  - id: build-wiki-scripts
    content: 阶段3：新建 fetch-fabric-wiki.js + process-fabric-wiki.js，处理 DokuWiki HTML
    status: completed
  - id: update-store
    content: 阶段4：更新 FabricDocStore 支持 fabric-wiki 子目录路由
    status: completed
  - id: run-all
    content: 阶段5：运行全部脚本 + 验证数据完整性
    status: completed
isProject: false
---

## 关键发现

### 1. FabricMC/fabric-docs 没有版本标签
- `api.github.com/repos/FabricMC/fabric-docs/tags` → `[]`
- `api.github.com/repos/FabricMC/fabric-docs/branches` → 仅 `main`
- **结论**：Fabric Docs 是版本无关文档，所有 MC 版本共用一份内容，页面内通过代码注释标注版本差异

### 2. Mixin Wiki 没有独立仓库
- `SpongePowered/Mixin.wiki` 仓库不存在
- Mixin Wiki 只能从 GitHub Web 页面抓取（HTML），无法用 Raw 方式
- **已决定跳过 Mixin Wiki**

### 3. 已验证可用的官方网址

| 数据源 | URL | 状态 |
|--------|-----|------|
| Fabric Wiki 首页 | `https://fabricmc.net/wiki/doku.php?id=start` | ✅ |
| Fabric Wiki 教程 | `https://fabricmc.net/wiki/doku.php?id=tutorial:items` | ✅ |
| Fabric Wiki 教程 | `https://fabricmc.net/wiki/doku.php?id=tutorial:blocks` | ✅ |
| Fabric Wiki 教程 | `https://fabricmc.net/wiki/doku.php?id=tutorial:kotlin` | ✅ |
| Fabric Wiki 教程 | `https://fabricmc.net/wiki/doku.php?id=tutorial:dev_environment` | ❌ 页面不存在 |
| Fabric Wiki 教程 | `https://fabricmc.net/wiki/doku.php?id=tutorial:mixin` | ❌ 页面不存在 |
| Fabric Meta API | `https://meta.fabricmc.net/v2/versions/game` | ✅ |
| Fabric Meta API | `https://meta.fabricmc.net/v2/versions/loader` | ✅ |
| Fabric Meta API | `https://meta.fabricmc.net/v2/versions/yarn` | ✅ |
| Fabric Meta API | `https://meta.fabricmc.net/v2/versions/installer` | ✅ |
| Fabric Docs | `https://raw.githubusercontent.com/FabricMC/fabric-docs/main/` | ✅ |

---

## 目标目录结构

```
data/fabric_1.20.1/
├── meta.json                     # Fabric Meta API（MC 1.20.1, Loader 0.15.x）
├── mappings/                      # Yarn + Parchment mappings（阶段0产出）
│   ├── .gitkeep
│   ├── yarn-1.20.1+build.10.jar
│   ├── yarn-1.20.1+build.10-tiny.gz
│   ├── yarn-1.20.1+build.10-sources.jar
│   ├── parchment-1.20.1-2023.09.03.zip
│   ├── yarn-mappings.json         # 可选：双向索引
│   └── parchment-params.json     # 可选：参数名+Javadoc
├── fabric-docs/                  # Fabric Docs GitHub main（24 页，版本无关）
│   └── 1.20.1/
│       ├── raw/
│       ├── processed/
│       ├── index-l0.json
│       ├── index-l1.json
│       └── index-l2.json
└── fabric-wiki/                 # Fabric Wiki DokuWiki HTML（教程页）
    └── 1.20.1/
        ├── raw/
        ├── processed/
        ├── index-l0.json
        ├── index-l1.json
        └── index-l2.json
```

---

## 阶段 0：抓取 mappings 文件（对应 forge_1.20.1/mappings/）

参考 `data/forge_1.20.1/mappings/` 的结构，Fabric 1.20.1 同样需要下载 Yarn + Parchment mappings，存放于 `data/fabric_1.20.1/mappings/`。

### 0.1 下载清单

| 文件 | 来源 URL | 大小 |
|------|---------|------|
| `yarn-1.20.1+build.10.jar` | `https://maven.fabricmc.net/net/fabricmc/yarn/1.20.1+build.10/yarn-1.20.1+build.10.jar` | ~951KB |
| `yarn-1.20.1+build.10-tiny.gz` | `https://maven.fabricmc.net/net/fabricmc/yarn/1.20.1+build.10/yarn-1.20.1+build.10-tiny.gz` | ~951KB |
| `yarn-1.20.1+build.10-sources.jar` | `https://maven.fabricmc.net/net/fabricmc/yarn/1.20.1+build.10/yarn-1.20.1+build.10-sources.jar` | ~2.7MB |
| `parchment-1.20.1-2023.09.03.zip` | `https://maven.parchmentmc.org/org/parchmentmc/data/parchment-1.20.1/2023.09.03/parchment-1.20.1-2023.09.03.zip` | 待确认 |

> Maven 目录 `maven.fabricmc.net/net/fabricmc/yarn/1.20.1+build.10/` 已验证存在 ✅  
> Parchment Maven `maven.parchmentmc.org` 需进一步验证

### 0.2 `fetch-fabric-mappings.js` 新建

从 Fabric Maven 下载 Yarn JAR/tiny/sources，从 Parchment Maven 下载 Parchment ZIP。

**Yarn JAR 解析（可选，用于生成 `yarn-mappings.json`）：**
Yarn JAR 内部是 `.mapping` 文件，格式为：
```
 CLASS net/minecraft/client/Minecraft
  METHOD a (JLnet/minecraft/client/Minecraft;II)V setMouseX # 方法签名
   PARAMS
    PARAM 2 mouseX
    PARAM 3 mouseY
```
解析后提取双向索引（类名 ↔ 混淆名 / 方法名 ↔ 混淆签名），写入 `yarn-mappings.json`。

**Parchment ZIP 解析（可选，用于生成 `parchment-params.json`）：**
ZIP 内含 `data/parchment-minecraft/` 目录，包含每个包的 javadoc.json 和参数名。

### 0.3 目标目录结构

```
data/fabric_1.20.1/mappings/
├── .gitkeep                              # 与 forge 保持一致
├── yarn-1.20.1+build.10.jar             # Yarn 官方 JAR
├── yarn-1.20.1+build.10-tiny.gz         # Yarn Tiny 格式
├── yarn-1.20.1+build.10-sources.jar     # Yarn 源码 JAR
├── parchment-1.20.1-2023.09.03.zip       # Parchment 官方 ZIP
├── yarn-mappings.json                    # 可选：解析后的双向索引
└── parchment-params.json                # 可选：解析后的参数名+Javadoc
```

### 0.4 用法
```bash
node scripts/fetch-fabric-mappings.js --version 1.20.1          # 下载所有 mappings
node scripts/fetch-fabric-mappings.js --version 1.20.1 --dry-run  # 预览
node scripts/fetch-fabric-mappings.js --version 1.20.1 --extract  # 下载 + 解析生成 JSON
```

---

## 阶段 1：修复现有 fabric-docs 脚本

### 1.1 `fetch-fabric-docs.js` 修改

**硬编码问题：**

```js
// 现状（硬编码）
const FABRIC_DIR = join(DATA_ROOT, "fabric_1.21.1", "fabric-docs", "1.21.1", "raw");
const META_PATH  = join(DATA_ROOT, "fabric_1.21.1", "meta.json");

// 修复后
const VERSION = process.argv.find(a => a.startsWith("--version="))?.split("=")[1] ?? "1.21.1";
const FABRIC_DIR = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION, "raw");
const META_PATH  = join(DATA_ROOT, `fabric_${VERSION}`, "meta.json");
```

**新增 `--dry-run` 支持：**
```js
if (dryRun) {
  console.log(`[DRY] ${entry.priority} ${id} -> ${githubRawUrl}`);
  continue;
}
```

**修复 `FABRIC_GH.commit` 引用（变量不存在）：** 删除 `meta.meta.githubCommit = FABRIC_GH.commit;` 一行。

### 1.2 `process-fabric-docs.js` 修改

**DATA_DIR 参数化：**
```js
// 现状
const DATA_DIR = join(MC_SKILL_ROOT, "data", "fabric_1.21.1", "fabric-docs");

// 修复后
const VERSION = process.argv.find(a => a.startsWith("--version="))?.split("=")[1] ?? "1.21.1";
const DATA_DIR = join(MC_SKILL_ROOT, "data", `fabric_${VERSION}`, "fabric-docs");
```

**新增 L0 priority 排序（与 forge 脚本对齐）：**
```js
// 在 l0.push(l0Entry) 后、writeFileSync 前添加：
l0.sort((a, b) => {
  const order = { "⭐": 0, "🟡": 1, "🟢": 2 };
  return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
});
```

---

## 阶段 2：新建 `fetch-fabric-meta.js`

### 数据源

| 端点 | 用途 | 筛选 |
|------|------|------|
| `meta.fabricmc.net/v2/versions/game` | Minecraft 版本 | `version === "1.20.1"` |
| `meta.fabricmc.net/v2/versions/loader` | Fabric Loader | `0.15.x` 系列，稳定版 |
| `meta.fabricmc.net/v2/versions/yarn` | Yarn 映射 | 含 `1.20.1` 前缀 |
| `meta.fabricmc.net/v2/versions/installer` | Fabric Installer | 最新 stable 版本 |

### 输出

```json
// data/fabric_1.20.1/meta.json
{
  "version": "1.20.1",
  "fetchedAt": "2026-05-30T...",
  "game": { "version": "1.20.1", "stable": true },
  "loader": { "version": "0.15.11", "stable": true, "separator": ".", "build": 6 },
  "yarn": { "version": "1.20.1+build.x", "stable": true },
  "installer": { "version": "1.1.1", "stable": true }
}
```

### 用法
```bash
node scripts/fetch-fabric-meta.js --version 1.20.1
```

---

## 阶段 3：新建 `fetch-fabric-wiki.js` + `process-fabric-wiki.js`

### 3.1 Wiki 页面清单（已验证）

**第一批 ⭐（核心教程）：**
- `tutorial:start` — 教程首页
- `tutorial:items` — 添加物品 ✅（实测完整）
- `tutorial:blocks` — 添加方块 ✅（实测完整，含 1.14–1.21.2 版本差异）

**第二批 🟡🟢（扩展教程，已确认可访问）：**
- `tutorial:kotlin` — Kotlin 语言支持 ✅
- `start` — Wiki 首页 ✅
- `documentation:start` — 文档首页（需验证）
- `documentation:entities` — 实体教程（需验证）
- `documentation:worldgen` — 世界生成（需验证）
- `tutorial:datagen` — 数据生成（需验证）
- `tutorial:commands` — 命令（需验证）
- `tutorial:configuration` — 配置（需验证）

**已知不存在（跳过）：**
- `tutorial:dev_environment` ❌
- `tutorial:mixin` ❌
- `documentation:specifications` ❌

### 3.2 `fetch-fabric-wiki.js`

**URL 模式：** `https://fabricmc.net/wiki/doku.php?id={namespace}:{page}`

**DokuWiki HTML 解析策略：**
```js
// 提取正文
const pageMatch = html.match(/<div\s+class="page"[^>]*>([\s\S]*)<!-- \/wikipage -->/i);

// DokuWiki 内部链接
text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "[$2]($1)");  // [[url|text]] -> [text](url)
text.replace(/\[\[([^\]]+)\]\]/g, "[$1]($1)");              // [[url]] -> [url](url)

// 命名空间链接
text.replace(/wiki>:/g, "fabricmc.net/wiki/doku.php?id=");

// 代码块（DokuWiki 用 <code> 或 <file> 标签）
text.replace(/<file>([\s\S]*?)<\/file>/gi, "`$1`");
```

**CLI 参数：** `--version`, `--dry-run`, `--force`

### 3.3 `process-fabric-wiki.js`

格式清洗规则（与 forge 脚本完全一致）：
- `🔴` 新手必读：`**Note**` / `**Warning**` / `**Important**` / `~~deleted~~` 段落
- `🟠` 常见错误：`don't` / `never` / `avoid` / `do not`
- `🟢` 示例代码：代码块（```java 等）

CLI 参数：`--version`

### 3.4 用法
```bash
node scripts/fetch-fabric-wiki.js --version 1.20.1 --dry-run  # 预览
node scripts/fetch-fabric-wiki.js --version 1.20.1             # 抓取
node scripts/process-fabric-wiki.js --version 1.20.1            # 处理
```

---

## 阶段 4：更新 `FabricDocStore` 支持多子目录

### 4.1 当前状态
`FabricDocStore` 硬编码 `dataDir`，只能搜索 `fabric-docs` 子目录。

### 4.2 修改方案

```typescript
// 新增 source 参数路由
interface DocSource {
  "fabric-docs": "fabric-docs";
  "fabric-wiki": "fabric-wiki";
}

searchIndex(
  query: string,
  version: string,
  tags?: string[],
  source?: keyof DocSource | "all"  // 新增
): SearchResult[]
```

当 `source === "all"` 时，合并 `fabric-docs` 和 `fabric-wiki` 的 index-l0.json 结果，并附加 `source` 字段标注来源。

### 4.3 工具层修改（`index.ts`）

```typescript
inputSchema: {
  query: z.string(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.enum(["fabric-docs", "fabric-wiki", "all"]).optional().default("fabric-docs"),
}
```

---

## 阶段 5：运行 + 验证

### 运行命令
```bash
# 阶段1：修复后的脚本（Fabric Docs）
node scripts/fetch-fabric-docs.js --version 1.20.1 --dry-run
node scripts/fetch-fabric-docs.js --version 1.20.1 --force
node scripts/process-fabric-docs.js --version 1.20.1

# 阶段2：Meta API
node scripts/fetch-fabric-meta.js --version 1.20.1

# 阶段3：Fabric Wiki
node scripts/fetch-fabric-wiki.js --version 1.20.1 --dry-run
node scripts/fetch-fabric-wiki.js --version 1.20.1
node scripts/process-fabric-wiki.js --version 1.20.1
```

### 验证清单
- [ ] `fabric_1.20.1/mappings/` 目录存在，含 `.gitkeep`
- [ ] `yarn-1.20.1+build.10.jar` 下载成功（~951KB）
- [ ] `parchment-1.20.1-2023.09.03.zip` 下载成功
- [ ] `fabric_1.20.1/meta.json` 含 `game.version: "1.20.1"` + `loader.version: "0.15.x"`
- [ ] `fabric-docs/1.20.1/index-l0.json` ≥ 24 条
- [ ] `fabric-wiki/1.20.1/index-l0.json` ≥ 8 条（实际可访问页面）
- [ ] 每个 `index-l0.json` 每条含 `version: "1.20.1"`
- [ ] 每个 `processed/` 目录有对应 .md 文件
- [ ] `search_fabric_docs(source="all")` 查询 "items" 返回 fabric-docs 和 fabric-wiki 结果

---

## 关键文件清单

| 操作 | 文件路径 |
|------|----------|
| 新建 | `mcp-server/scripts/fetch-fabric-mappings.js` |
| 修改 | `mcp-server/scripts/fetch-fabric-docs.js` |
| 修改 | `mcp-server/scripts/process-fabric-docs.js` |
| 新建 | `mcp-server/scripts/fetch-fabric-meta.js` |
| 新建 | `mcp-server/scripts/fetch-fabric-wiki.js` |
| 新建 | `mcp-server/scripts/process-fabric-wiki.js` |
| 修改 | `mcp-server/src/docs-platform/fabric/store.ts` |
| 修改 | `mcp-server/src/docs-platform/fabric/index.ts` |
| 新建 | `data/fabric_1.20.1/`（由脚本自动创建） |
---
name: Build Fabric 1.20.1 Agent Ruleset + Fabric-Unique Skills
overview: 在已完成阶段0-5（数据收集管道）的基础上，扩展阶段6-11来创建 fabric/1.20.1/ 的完整 agent ruleset 结构。参考 forge/1.20.1/ 格式，但加入 Fabric 独有的内容：Yarn mappings + Mixin 一体化、Fabric API 模块系统、Kotlin 语言支持、Cloth Config、渲染优化生态（Sodium/Indium/Continuity）、跨平台移植等。
todos:
  - id: stage-6-agents
    content: 阶段6：创建 fabric/1.20.1/ 目录骨架 + AGENTS.md 总纲
    status: completed
  - id: stage-7-cursor-rules
    content: 阶段7：创建 .cursor/rules/（11个mdc）+ .cursor/skills/（17个skill）
    status: completed
  - id: stage-8-other-ai
    content: 阶段8：创建 .claude/ + .continue/ + .trae/ 目录
    status: completed
  - id: stage-9-knowledge
    content: 阶段9：创建 knowledge/ 和 code-patterns/ 目录
    status: completed
  - id: stage-10-scaffold
    content: 阶段10：创建 scaffold/ Fabric 项目模板
    status: completed
  - id: stage-11-root-agents
    content: 阶段11：更新根目录 AGENTS.md 支持 Fabric 路由
    status: completed
isProject: false
---

## 阶段 6：创建 fabric/1.20.1/ 目录骨架 + AGENTS.md 总纲

**输出目录：**
```
H:\MC_skill\fabric\1.20.1\
├── AGENTS.md                          # Fabric 1.20.1 总纲（Fabric 版 AGENTS.md）
├── .cursor/
│   ├── rules/
│   └── skills/
├── .claude/
│   ├── rules/
│   └── commands/
├── .continue/
│   ├── rules/
│   └── skills/
├── .trae/
│   ├── rules/
│   ├── skills/
│   └── agents/
├── knowledge/
│   ├── README.md
│   ├── antipatterns/
│   ├── common/
│   ├── porting/
│   └── version-changes/
├── code-patterns/
│   └── README.md
└── scaffold/
    ├── build.gradle
    ├── settings.gradle
    ├── gradle.properties
    └── ...
```

**AGENTS.md（fabric/1.20.1/AGENTS.md）内容要点：**

| 项目 | Forge 值 | Fabric 值 |
|------|---------|----------|
| 平台 | Forge | **Fabric** |
| MC 版本 | 1.20.1 | 1.20.1 |
| Java 版本 | Java 17 | Java 17 |
| Gradle | Gradle 8.x + ForgeGradle | **Gradle 8.x + Loom** |
| Mappings | MCP | **Yarn**（+ Parchment 参数名） |
| 注册方式 | DeferredRegister in modEventBus | **Registry.register() in onInitialize** |
| Mod 元数据 | mods.toml | **fabric.mod.json** |
| Mixin 支持 | 需额外配置 mixin 插件 | **Loom 一流支持，fabric.mixins.json** |

**Decision Flow：**
```
IF 项目中有 fabric.mod.json → 这是 Fabric 项目
  → IF MC 版本 = 1.20.1 → 继续加载本规则集
  → ELSE → 跳转到 fabric/对应版本/AGENTS.md
IF 项目中有 mods.toml → 跳转到 forge/1.20.1/AGENTS.md
```

---

## 阶段 7：创建 .cursor/rules/（11个mdc） + .cursor/skills/（17个skill）

### 7.1 .cursor/rules/（11个，Fabric 版）

| 编号 | 文件名 | 内容适配 |
|------|--------|---------|
| 00 | `00-project-setup.mdc` | Java 17、Loom 插件、yarn mappings、Fabric Maven、gradle.properties 管理版本 |
| 01 | `01-registry.mdc` | `Registry.register(Registries.ITEM, id, item)` 在 `onInitialize()` 中执行，Fabric 无 modEventBus |
| 02 | `02-block.mdc` | Fabric `Block` 类，FabricBlockSettings，Registry + BlockItem |
| 03 | `03-item.mdc` | Fabric `Item` 类，`Registry.register(Registries.ITEM, id, Item)` |
| 04 | `04-entity.mdc` | Fabric `EntityType` 注册，Fabric `Entity` 类 |
| 05 | `05-events.mdc` | `CallbackEvaulator` + `EventDispatcher`（Fabric 无 Forge 事件总线） |
| 06 | `06-networking.mdc` | Fabric `Networking`（`FabricNetworkConstants`）vs Forge `SimpleChannel` |
| 07 | `07-datagen.mdc` | Fabric Loom DataGen（`fabric-datagen-api`） |
| 08 | `08-client-server.mdc` | `EnvType`、`ClientTickEvents` vs Forge `@OnlyIn` |
| 09 | `09-anti-patterns.mdc` | Fabric 常见错误（mixin 注入失败、fabric.mod.json schema 错误、Loom 版本不兼容） |
| 10 | `10-gui.mdc` | Fabric Screen API、`HandledScreens` 注册 |

### 7.2 .cursor/skills/（17个，包括 Fabric 独有 skill）

**Forge 通用 Skill（适配 Yarn mappings + Fabric API）：**
- `mc-block`、`mc-item`、`mc-entity`、`mc-registry`、`mc-gui`、`mc-networking`、`mc-datagen`、`mc-recipe`、`mc-fluid`、`mc-blockentity`、`mc-particle`、`mc-sound`、`mc-capability`、`mc-compat-jei`（适配 JEI/REI 插件）、`mc-mixin`（Fabric 版）

**Fabric 独有的 3 个 Skill：**

| 文件名 | 内容 |
|--------|------|
| `mc-fabric-api.md` | Fabric API 20+ 模块：`fabric-command-api-v2`、`fabric-item-api-v1`、`fabric-screen-api-v1`、`fabric-networking-api-v0`、`fabric-object-builder-api-v1` 等 |
| `mc-kotlin.md` | `fabric-language-kotlin` 使用，`kotlin("jvm")` 在 build.gradle.kts，`@PublishedApi` 注解 |
| `mc-cloth-config.md` | Cloth Config：`ConfigBuilder`、`ConfigCategory`、`ConfigEntryBuilder`，`BuildConfig` 注解 |

---

## 阶段 8：创建 .claude/ + .continue/ + .trae/ 目录

复制 `forge/1.20.1/` 的对应结构，文件内容替换为 Fabric 版本：

### 8.1 .claude/
- `agents/default.md` — Fabric 1.20.1 默认 agent
- `commands/` — 12个命令文件（block、item、entity、mixin、gui、datagen 等）
- `rules/` — 11个 mdc 规则

### 8.2 .continue/
- `rules/` — 11个 mdc 规则
- `skills/` — 17个 SKILL.md（与 .cursor/skills 相同）

### 8.3 .trae/
- `agents/default.md` — Fabric 1.20.1 agent
- `rules/` — 11个 mdc 规则
- `skills/` — 17个 skill 文件

---

## 阶段 9：创建 knowledge/ 和 code-patterns/

### 9.1 knowledge/（Fabric 版）

| 路径 | 内容 |
|------|------|
| `knowledge/README.md` | 知识库说明，指向 Fabric 特有内容 |
| `knowledge/antipatterns/registry.md` | Fabric 注册失败：忘记在 `onInitialize` 中注册、错误命名空间 |
| `knowledge/antipatterns/mixin.md` | **Fabric 独有**：Mixin 注入顺序错误、`@AccessWidener` 与 mixin 冲突、Loom mixin 编译器配置 |
| `knowledge/antipatterns/yarn-mappings.md` | **Fabric 独有**：Yarn 映射缺失、mapping 版本不匹配、`class_XXXX` 误解 |
| `knowledge/antipatterns/gradle.md` | Fabric：Loom 版本不兼容、Maven 仓库配置错误 |
| `knowledge/antipatterns/item.md` | Fabric Item API vs Forge Item |
| `knowledge/antipatterns/networking.md` | Fabric Networking API 兼容性 |
| `knowledge/common/glossary.md` | Yarn 命名约定（`class_`、`method_`、`field_` 前缀） |
| `knowledge/common/datapack-format.md` | 通用（Fabric/Forge 相同） |
| `knowledge/porting/forge-to-fabric.md` | **Fabric 独有**：mods.toml → fabric.mod.json、`DeferredRegister` → `Registry.register`、`FMLCommonSetupEvent` → `onInitialize` |
| `knowledge/porting/fabric-to-forge.md` | **Fabric 独有**：反向移植指南 |
| `knowledge/version-changes/1.20.x.md` | MC 1.20.x 通用变更 |

### 9.2 code-patterns/

| 文件 | 内容 |
|------|------|
| `code-patterns/README.md` | 代码模式库说明 |
| `code-patterns/01-block-patterns.md` | Fabric 方块模式（`Block`、`BlockItem`、`FabricBlockSettings`） |
| `code-patterns/02-item-patterns.md` | Fabric 物品模式（`Item`、`ItemStack`） |
| `code-patterns/03-entity-patterns.md` | Fabric 实体模式（`Entity`、`EntityType`） |
| `code-patterns/04-mixin-patterns.md` | **Fabric 独有**：Fabric Mixin 最佳实践（Loom 编译器配置、`fabric.mixins.json`） |
| `code-patterns/05-fabric-api-patterns.md` | **Fabric 独有**：常用 Fabric API 模块使用模式 |
| `code-patterns/06-datagen-patterns.md` | Fabric DataGen 模式（`fabric-datagen-api`） |

---

## 阶段 10：创建 scaffold/ Fabric 项目模板

### 10.1 文件清单

```
scaffold/
├── build.gradle                  # Loom + Kotlin + Fabric API 依赖
├── build.gradle.kts             # Kotlin DSL 版本（可选）
├── settings.gradle              # 项目名
├── gradle.properties             # 版本号集中管理
├── .gitignore
├── gradlew / gradlew.bat
├── gradle/wrapper/
│   └── gradle-wrapper.properties
├── src/main/
│   ├── java/com/example/examplemod/
│   │   └── ExampleMod.java       # 入口：implements FabricMod
│   └── resources/
│       ├── fabric.mod.json        # Fabric 元数据（替代 mods.toml）
│       └── pack.mcmeta
└── README_AI.md                  # AI 助手说明
```

### 10.2 build.gradle 核心内容

```groovy
plugins {
    id 'fabric-loom' version '1.4-SNAPSHOT'
    id 'maven-publish'
}

dependencies {
    minecraft "com.mojang:minecraft:1.20.1"
    mappings "net.fabricmc:yarn:1.20.1+build.10:v2"
    modImplementation "net.fabricmc:fabric-loader:0.15.11"

    // Fabric API（选择性引入）
    modImplementation "net.fabric.sdk:fabric-api:0.91.0+1.20.1"
}
```

### 10.3 fabric.mod.json 核心字段

```json
{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "1.0.0",
  "name": "Example Mod",
  "description": "Example mod description",
  "authors": ["YourNameHere"],
  "contact": { "homepage": "https://fabricmc.net" },
  "license": "MIT",
  "icon": "assets/examplemod/icon.png",
  "environment": "*",
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"]
  },
  "mixins": ["examplemod.mixins.json"],
  "depends": {
    "fabricloader": ">=0.15.0",
    "fabric-api": "*",
    "minecraft": ">=1.20.1",
    "java": ">=17"
  }
}
```

### 10.4 README_AI.md

AI 读取后知道：
- 修改 `fabric.mod.json` 的 `id` 字段后必须同步修改 `ExampleMod.java` 和所有资源路径
- 使用 `Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), item)` 在 `onInitialize` 中注册
- Mixin 通过 Loom 一流支持，无需额外插件

---

## 阶段 11：更新根目录 AGENTS.md 支持 Fabric 路由

修改 `H:\MC_skill\AGENTS.md`，在"第三步：加载对应平台的规则"中，将 Fabric 部分完善：

```
### 2. 检查 Fabric
IF 项目中有 src/main/resources/fabric.mod.json
  → IF build.gradle 中有 loom.platform = "fabric"
  → 跳转到 fabric/1.20.1/AGENTS.md
```

添加 Fabric 特有的 MCP Server 工具：
- `search_fabric_docs` — 搜索 Fabric Docs + Wiki
- `get_fabric_doc_summary` — 获取 Fabric 文档摘要
- `get_fabric_doc_full` — 获取 Fabric 文档全文

---

## 关键文件清单

| 操作 | 文件路径 |
|------|----------|
| 新建 | `H:\MC_skill\fabric\1.20.1\AGENTS.md` |
| 新建 | `H:\MC_skill\fabric\1.20.1\.cursor\rules\00-10.mdc`（11个） |
| 新建 | `H:\MC_skill\fabric\1.20.1\.cursor\skills\*`（17个 skill） |
| 新建 | `H:\MC_skill\fabric\1.20.1\.claude\...`（rules + commands） |
| 新建 | `H:\MC_skill\fabric\1.20.1\.continue\...`（rules + skills） |
| 新建 | `H:\MC_skill\fabric\1.20.1\.trae\...`（rules + skills + agents） |
| 新建 | `H:\MC_skill\fabric\1.20.1\knowledge\...`（14个文档） |
| 新建 | `H:\MC_skill\fabric\1.20.1\code-patterns\*`（6个模式文件） |
| 新建 | `H:\MC_skill\fabric\1.20.1\scaffold\...`（完整 Gradle 项目模板） |
| 修改 | `H:\MC_skill\AGENTS.md` |

---

## Fabric 独有内容总结（相对于 Forge 的增量）

1. **Mixin 一体化**：Fabric Loom 原生支持 mixin，build.gradle 中无需额外插件，`fabric.mixins.json` 由 Loom 管理
2. **Yarn + Parchment Mappings**：完整方法参数名，`class_XXXX` / `method_XXXX` 命名风格
3. **Fabric API 模块系统**：20+ 可选模块，`modImplementation` 逐个引入
4. **Kotlin 支持**：`fabric-language-kotlin` 官方集成
5. **Cloth Config**：配置系统的 Fabric 标准方案
6. **渲染优化生态**：Sodium（渲染优化）、Indium（Fabric 渲染 API）、Continuity（并发渲染）
7. **注册方式差异**：`Registry.register()` 在 `onInitialize` 中执行，无 modEventBus
8. **跨平台移植知识**：Forge ↔ Fabric 互转的反模式和技术差异