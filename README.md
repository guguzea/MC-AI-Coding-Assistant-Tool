# MC AI Coding Assistant Tool

让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 项目结构

```
MC_skill/
├── README.md                    # 你在这里
├── AGENTS.md                    # 根总纲：引导 AI 选择正确的平台规则
├── CONTRIBUTING.md              # 贡献指南
├── AUTO_SETUP.md               # AI 自动配置 MCP Server 指南
│
├── forge/
│   └── 1.20.1/
│       ├── AGENTS.md           # Forge 1.20.1 总纲
│       ├── CLAUDE.md           # 通用开发指南
│       ├── sync-skills.ps1     # 多 IDE 配置同步脚本
│       ├── .cursor/            # Cursor AI 配置源
│       │   ├── rules/          # 11 个规则文件（.mdc）
│       │   ├── skills/         # 15 个 Agent Skills
│       │   └── agents/         # Agent 配置文件
│       ├── .claude/            # Claude Desktop 配置
│       ├── .continue/          # Continue.dev 配置
│       ├── .trae/              # Trae AI 配置
│       ├── scaffold/           # 项目骨架模板
│       ├── code-patterns/      # 代码模式库（5 个文件）
│       └── knowledge/           # forge通用知识（antipatterns / common / porting / version-changes）
│
├── fabric/                      # Fabric 规则与知识（多版本）
├── neoforge/                    # NeoForge 规则与知识（多版本）
├── mcp-server/                  # 本地 stdio MCP Server（约 31 个工具）
└── data/                        # 完整离线数据：文档 + mappings zip + yarn JSON/SQLite + porting
```

## 平台说明


| 平台       | 状态    | 当前版本（规则/数据） |
| -------- | ----- | ------------- |
| Forge    | ✅ 完成 | 多版本（主推 1.20.1） |
| Fabric   | ✅ 完成 | 多版本（主推 1.20.1 / 1.21.x） |
| NeoForge | ✅ 完成 | 多版本（主推 1.20.4+） |


## 多 IDE 支持

本项目的配置同时支持以下 AI 编程助手：

```
forge/1.20.1/
├── .cursor/     → Cursor AI（原始配置）
├── .claude/     → Claude Desktop
├── .continue/   → Continue.dev
└── .trae/      → Trae AI
```

所有 IDE 的 skill 和 rule 内容 100% 一致。修改时只需改 `.cursor/` 下的源文件，然后运行 `sync-skills.ps1` 同步到其他目录。

| IDE | Rules 目录 | Skills 目录 | Agent 配置 |
|-----|-----------|------------|-----------|
| Cursor | `.cursor/rules/*.mdc` | `.cursor/skills/` | `.cursor/agents/` |
| Claude Desktop | `.claude/rules/*.mdc` | `.claude/commands/` | `.claude/agents/` |
| Continue.dev | `.continue/rules/*.mdc` | `.continue/skills/` | — |
| Trae | `.trae/rules/*.mdc` | `.trae/skills/` | `.trae/agents/` |

## 快速开始

**对 AI（当你打开一个新 MC Mod 项目时）：**

> AI 会根据你项目的 `build.gradle` 或 `mods.toml` 自动判断平台和版本，并加载对应的规则集。

**对新项目使用脚手架：**

> 运行 `forge/1.20.1/scaffold/cli/` 中的工具，选择平台/版本/Mod 名称，一键生成带完整规则的项目骨架。

**多 IDE 同步（当你修改了 .cursor/ 下的配置后）：**

> 运行 `forge/1.20.1/sync-skills.ps1`，将更改同步到所有其他 IDE 目录。

**自动配置 MCP Server（AI 自动执行，无需用户干预）：**

> 将 `AUTO_SETUP.md` 拖入 Cursor，AI 将自动编译 mcp-server 并写入 `mcp.json`。

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | 数据目录根路径（不含版本子目录） | `MC_SKILL_DATA=/path/to/data` |
| `MC_SKILL_ALLOW_WRITE` | `1` 时允许 `port_project` 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许的项目根（绝对路径） | `H:/mods/my-mod` |
| `MC_SKILL_STRICT` | `1` 时数据无效则 MCP 启动失败 | `1` |
| `MC_SKILL_DEBUG_PATHS` | 设为 `1` 打印路径解析过程 | `MC_SKILL_DEBUG_PATHS=1` |
| `MCP_TIMEOUT_MS` | 测试脚本超时毫秒数 | `MCP_TIMEOUT_MS=30000` |

## MCP 工具使用注意

本地 MCP 服务名：**`MC-AI-Coding-Assistant-Tool`**（约 31 个工具）。配置时请使用 **绝对路径** + `MC_SKILL_DATA` 指向本仓库 `data/`。要求 **Node.js >= 22.5**（Yarn 映射使用内置 `node:sqlite`）。解压 Release 后需自行 `npm ci && npm run build`（仓库/Release **不含** `node_modules`）。

### 文档查询（Fabric / Forge）

1. **页面 ID 必须用搜索结果里的 `id`**，不要用网站 URL 路径。  
   - 正确：`get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
   - 错误：`id: "items/first-item"`
2. **推荐流程**：`search_*_docs` →（可选）`get_*_doc_summary` → `get_*_doc_full`。
3. **L0 搜索只匹配索引字段**（`label` / `id` / `url` / `tags`），不是全文检索。索引里没有的词（例如部分版本没有 `registry` 标签）会返回空；可换 `item`、`mixin` 等已有标签，或用 `class:` / `event:` / `method:` 前缀。
4. 前缀查询示例：`class:Item`、`event:lifecycle`；前缀本身不会再当作普通关键词重复过滤。

### 映射转换（`convert_mapping` + Yarn）

1. Yarn 走预建 **`yarn-mappings.sqlite` 惰性点查**，运行时**禁止**全量加载 `yarn-mappings.json`。
2. 类名推荐写法（任选其一）：  
   - Yarn 路径：`net/minecraft/block/Block`  
   - 简单类名：`Block`（唯一匹配或可按包路径消歧时可用）  
   - 官方混淆名：`cpn`（与 Yarn 互转时，`mojang` 列指的是混淆短名，**不是** `net.minecraft.world.level.block.Block` 这种 Mojang 映射全名）
3. 也可用 Mojang 映射风格 FQN 做启发式匹配（按简单类名 + 包路径打分）；不确定时看返回的 `notes` / `候选`。

### 移植分析（`analyze_porting_path`）

1. 平台识别会综合 **Java/Kotlin 源码**（`import` / `@Mod`）与 **构建/元数据**（`build.gradle`、`mods.toml`、`fabric.mod.json` 等）。  
   - 仅有 gradle/元数据、尚无源码时，一般也能识别为 forge / fabric / neoforge。  
   - 空目录仍为 `platform: unknown`。
2. `mappings channel: 'official'` 等形式会解析为 mappings 通道名（如 `official`）。

### 写操作（`port_project`）

默认只读。真正写盘需要同时设置：

- `MC_SKILL_ALLOW_WRITE=1`
- `MC_SKILL_PROJECT_ROOT=<允许写入的项目根>`

且目标路径必须落在该根目录下。

## 数据复现与分发

`data/` 中的索引和文本数据由 `mcp-server/scripts/` 下的抓取、处理和索引脚本生成。原始 `*.jar`、`*.zip` 体积较大且已被 `.gitignore` 排除，不应假定它们会随 Git 仓库分发。

- 只从对应脚本声明的 Fabric、Forge、NeoForge、Parchment 或 Maven 官方来源重建数据。
- 每次重建记录来源 URL、抓取时间和原始内容 SHA-256；生成后的 `meta.json`、manifest、raw/processed 头信息及索引版本必须一致。
- 运行 `cd mcp-server && npm run audit:data` 校验所有声明版本；任何 `ERROR` 都表示数据包不能发布。
- 需要分发原始二进制时使用 Git LFS 或 release artifact，并同时发布哈希清单；不要取消全局 `*.jar`/`*.zip` 忽略规则后直接提交。
- 本地原始包丢失时应重新运行对应 fetch/extractor 流程，不从其他 Minecraft 版本目录复制并改名。

## 目录约定

- 每个平台按 `平台/版本/` 分目录（如 `forge/1.20.1/`）
- 每个版本的 `.cursor/rules/` 目录下存放规则文件，编号 `00`~`10` 对应不同主题
- 每个规则文件包含 **约束**（禁止什么）和 **决策流**（什么情况用什么）

## 规则文件说明


| 文件                     | 主题      | 说明                           |
| ---------------------- | ------- | ---------------------------- |
| `00-project-setup.mdc` | 项目结构    | Java 版本、Gradle 命令、版本号管理      |
| `01-registry.mdc`      | 注册系统    | Decision Flow：根据版本选择注册方式     |
| `02-block.mdc`         | 方块开发    | 基础方块 / 方块实体 / 流体             |
| `03-item.mdc`          | 物品开发    | 基础物品 / 工具 / 盔甲 / 食物          |
| `04-entity.mdc`        | 实体开发    | 实体类型、Renderer、Attribute、Goal |
| `05-events.mdc`        | 事件系统    | 按场景选择正确的事件类                  |
| `06-networking.mdc`    | 网络通信    | 同步需求 → 选择包类型                 |
| `07-datagen.mdc`      | 数据生成器   | 按数据类型选择 Provider             |
| `08-client-server.mdc` | 客户端/服务端 | 判断代码应放哪侧                     |
| `09-anti-patterns.mdc` | 反模式库    | 常见错误、错误症状、正确方案               |
| `10-gui.mdc`          | GUI 开发   | Menu、Screen、Container 开发      |


## Agent Skills（15 个）


| Skill 目录 | 主题 | 说明 |
| --- | --- | --- |
| `mc-registry/` | 注册系统 | DeferredRegister / RegisterEvent |
| `mc-block/` | 方块开发 | Block / BlockState / BlockBehaviour |
| `mc-item/` | 物品开发 | Item / ItemStack / ItemProperties |
| `mc-blockentity/` | 方块实体 | BlockEntity / Container / Screen |
| `mc-entity/` | 实体开发 | EntityType / Renderer / Goal / Attribute |
| `mc-mixin/` | Mixin 注入 | @Inject / @At / Redirect |
| `mc-networking/` | 网络通信 | SimpleChannel / FriendlyByteBuf |
| `mc-datagen/` | 数据生成器 | DataGenerator / Provider / tags |
| `mc-capability/` | Capability | ICapabilityProvider / CapabilityToken |
| `mc-compat-jei/` | JEI 兼容 | RecipeCategory / RecipeTransferHandler |
| `mc-fluid/` | 流体开发 | Fluid / FluidType / FlowableFluid |
| `mc-gui/` | GUI 开发 | Menu / Screen / ContainerScreen |
| `mc-particle/` | 粒子系统 | ParticleType / ParticleRenderType |
| `mc-sound/` | 音效系统 | SoundEvent / SoundSource |
| `mc-recipe/` | 配方系统 | RecipeSerializer / RecipeType |

## MCP Server 工具（9 个模块）


| 模块 | 工具数 | 功能 |
| --- | --- | --- |
| `api/` | 3 个 | `query_api`、`get_method_params`、`get_version_info` |
| `docs-platform/forge/` | 3 个 | `search_forge_docs`、`get_forge_doc_summary`、`get_forge_doc_full` |
| `mappings/` | 1 个 | `convert_mapping`（映射互转：MCP ↔ Parchment ↔ Mojang） |
| `datagen/` | 1 个 | `generate_datagen`（数据生成器代码生成） |
| `crash/` | 1 个 | `crash_analyze`（崩溃日志分析） |
| `validate/` | 1 个 | `validate_project`（项目结构校验） |
| `gradle/` | 1 个 | `diagnose_gradle`（Gradle 诊断） |
| `version/` | — | 版本信息查询（内部使用） |
| `workers/preloader.ts` | — | 数据预加载 Worker |

## 阶段里程碑


| 阶段        | 状态     | 内容                                                |
| --------- | ------ | ------------------------------------------------- |
| Phase 1   | ✅ 完成  | Forge 1.20.1 Cursor Rules（11 个规则文件）               |
| Phase 1.5 | ✅ 完成  | 模组脚手架 + 校验 CLI                                    |
| Phase 2   | ✅ 完成  | Agent Skills + 代码模式库（15 个 Skills + 6 个模式文件）     |
| Phase 3   | ✅ 实施中  | MCP Server（9 个工具模块，含 Forge 文档 + Parchment 映射） |
| Phase 4   | 🚧 实施中 | 知识库 + 反模式库（7 个反模式文件 + 版本变更记录）               |
| Phase 5   | 📋 暂缓  | 微调数据集 + runtime-inspector                         |
