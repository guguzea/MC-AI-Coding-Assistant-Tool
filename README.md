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
│       └── code-patterns/      # 代码模式库（6 个文件）
│
├── fabric/                      # 规划中
├── neoforge/                   # 规划中
├── mcp-server/                  # MCP Server（9 个工具模块）
├── data/                        # Forge 文档 + Parchment 映射数据
└── knowledge/                  # 跨平台通用知识
    ├── common/                  # 通用文档（术语表、数据包/资源包格式）
    ├── antipatterns/            # 反模式库（7 个文件）
    └── version-changes/         # 版本变更记录
```

## 平台说明


| 平台       | 状态     | 当前版本          |
| -------- | ------ | ------------- |
| Forge    | ✅ 完成  | 1.20.1        |
| Fabric   | 🔜 规划中 | 1.20.1 / 1.21 |
| NeoForge | 🔜 规划中 | 1.20.4 / 1.21 |


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
| `MC_SKILL_DEBUG_PATHS` | 设为 `1` 打印路径解析过程 | `MC_SKILL_DEBUG_PATHS=1` |
| `MCP_TIMEOUT_MS` | 测试脚本超时毫秒数 | `MCP_TIMEOUT_MS=30000` |

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
