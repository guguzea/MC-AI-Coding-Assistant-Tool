# MC AI Coding Assistant Tool

让 AI 编程助手（Cursor / Claude Code 等）能更好地编写 Minecraft 模组的完整工具包。

为 AI 提供一个「读懂 MC Mod 开发生态」的环境，消除知识陈旧、API 版本混淆、构建系统复杂、映射不一致等结构性障碍。

## 项目结构

```
MC_skill/
├── README.md                    # 你在这里
├── AGENTS.md                    # 根总纲：引导 AI 选择正确的平台规则
├── CONTRIBUTING.md              # 贡献指南
│
├── forge/
│   └── 1.20.1/
│       ├── AGENTS.md            # Forge 1.20.1 总纲
│       ├── .cursor/
│       │   ├── rules/           # 10 个规则文件（.mdc）
│       │   │   ├── 00-project-setup.mdc
│       │   │   ├── 01-registry.mdc
│       │   │   ├── 02-block.mdc
│       │   │   ├── 03-item.mdc
│       │   │   ├── 04-entity.mdc
│       │   │   ├── 05-events.mdc
│       │   │   ├── 06-networking.mdc
│       │   │   ├── 07-datagen.mdc
│       │   │   ├── 08-client-server.mdc
│       │   │   └── 09-anti-patterns.mdc
│       │   ├── agents/
│       │   │   └── default.md
│       │   └── skills/           # Agent Skills（Phase 2）
│       │       ├── mc-registry/
│       │       ├── mc-block/
│       │       ├── mc-item/
│       │       └── ...
│       ├── scaffold/            # 项目骨架模板（Phase 1.5）
│       └── code-patterns/       # 代码模式库
│
├── fabric/                      # 规划中
├── neoforge/                   # 规划中
├── mcp-server/                  # ✅ 实施中（Phase 3）
└── knowledge/                   # 跨平台通用知识（Phase 4）
```

## 平台说明


| 平台       | 状态     | 当前版本          |
| -------- | ------ | ------------- |
| Forge    | ✅ 实施中  | 1.20.1        |
| Fabric   | 🔜 规划中 | 1.20.1 / 1.21 |
| NeoForge | 🔜 规划中 | 1.20.4 / 1.21 |


## 多平台适配

规则核心内容以 Markdown 存储，不耦合特定 AI 工具格式。可通过转换脚本输出为：

- `.mdc` — Cursor
- `CLAUDE.md` — Claude Code
- `.cursorrules` — VSCode Copilot

## 快速开始

**对 AI（当你打开一个新 MC Mod 项目时）：**

> AI 会根据你项目的 `build.gradle` 或 `mods.toml` 自动判断平台和版本，并加载对应的规则集。

**对新项目使用脚手架（Phase 1.5）：**

> 运行 `forge/1.20.1/scaffold/cli/` 中的工具，选择平台/版本/Mod 名称，一键生成带完整规则的项目骨架。

## 目录约定

- 每个平台按 `平台/版本/` 分目录（如 `forge/1.20.1/`）
- 每个版本的 `.cursor/rules/` 目录下存放规则文件，编号 `00`~`09` 对应不同主题
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
| `07-datagen.mdc`       | 数据生成器   | 按数据类型选择 Provider             |
| `08-client-server.mdc` | 客户端/服务端 | 判断代码应放哪侧                     |
| `09-anti-patterns.mdc` | 反模式库    | 常见错误、错误症状、正确方案               |


## 阶段里程碑


| 阶段        | 状态     | 内容                                                |
| --------- | ------ | ------------------------------------------------- |
| Phase 1   | 🚧 实施中 | Forge 1.20.1 Cursor Rules（10 个规则文件）               |
| Phase 1.5 | 📋 规划中 | 模组脚手架 + 校验 CLI                                    |
| Phase 2   | 🚧 实施中 | Agent Skills + 代码模式库（含 Mixin/Capability/Compat）   |
| Phase 3   | ✅ 实施中  | MCP Server（11 个工具，含 Parchment API + Forge 文档分层搜索） |
| Phase 4   | 📋 规划中 | 知识库 + 反模式库 + 版本变更记录                               |
| Phase 5   | 📋 暂缓  | 微调数据集 + runtime-inspector                         |


