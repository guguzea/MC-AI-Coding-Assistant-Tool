# 贡献指南

感谢你愿意为 **MC AI Coding Assistant Tool** 贡献力量。本文说明如何扩展规则、数据与 MCP Server。

---

## 模块总览

| 模块 | 路径 | 状态 | 适合贡献 |
|------|------|------|----------|
| Forge 规则 / Skills | `forge/<version>/` | 多版本已完成（主推 1.20.1） | 扩展规则、Skill、scaffold |
| Fabric 规则 / Skills | `fabric/<version>/` | 多版本已完成（主推 1.20.1 / 1.21.x） | 同上 + Fabric 专有 Skill |
| NeoForge 规则 | `neoforge/` | 已完成（主推 1.20.4+） | 扩展规则与知识 |
| MCP Server | `mcp-server/` | 约 31 个工具 | 新工具、脚本、测试 |
| 离线数据 | `data/` | Forge / Fabric / NeoForge 多版本 | 抓取、索引、审计 |
| 根文档 | `README.md` / `AUTO_SETUP.md` / `AGENTS.md` | 持续维护 | 修正与同步 |

知识库与反模式通常位于 **各平台版本目录** 下的 `knowledge/`（不是仓库根目录）。

---

## 添加新平台或新版本

### 步骤 1：复制目录模板

以已完成的同平台版本为模板（Forge → `forge/1.20.1/`，Fabric → `fabric/1.20.1/`）：

```
平台/版本/
├── AGENTS.md
├── sync-skills.ps1          # 若该平台使用多 IDE 同步
├── .cursor/
│   ├── rules/               # 00–10 .mdc
│   ├── skills/
│   └── agents/
├── .claude/ / .continue/ / .trae/
├── .opencode/ / .agents/ / .zcode/ / .pi/   # OpenCode / Codex / ZCode / Pi（代表版本已支持）
├── scaffold/                # 可选：Gradle 骨架
├── code-patterns/           # 可选
└── knowledge/               # antipatterns / common / porting / version-changes
```

社区实务知识写在仓库根 `community_knowledge/`（不要双写进 `forge/*/knowledge/`）。

### 步骤 2：改版本相关字段

- `AGENTS.md`：平台、MC 版本、Java、mappings、Decision Flow
- `scaffold/gradle.properties` / `build.gradle` / `fabric.mod.json` 或 `mods.toml`
- Skill frontmatter 中的 `platform` / `version` / `mappings`

### 步骤 3：同步多 IDE

修改 `.cursor/` 后：

```powershell
cd <平台>/<版本>
./sync-skills.ps1
```

或在仓库根目录批量同步全部版本（统一 8 IDE）：

```powershell
.\scripts\sync-skills.ps1 -All
.\scripts\sync-skills.ps1 -TargetDir .\forge\1.19.4
```

各版本下的 `sync-skills.ps1` 是对 `scripts/sync-skills.ps1` 的薄包装；逻辑以仓库根脚本为准。

### 步骤 4：数据与总览

1. 在 `data/` 下按约定建立 `forge_<ver>/`、`fabric_<ver>/` 或 `neoforge_<ver>/`
2. 用 `mcp-server/scripts/` 抓取并生成 L0/L1/L2 + processed
3. 更新根 `README.md`「平台说明」与 `AGENTS.md` 路由
4. `cd mcp-server && set MC_SKILL_DATA=<data绝对路径> && npm run audit:data`

---

## 扩展现有规则

每个 `.mdc` 建议包含：

1. **约束（Constraints）**
2. **Decision Flow**
3. **示例代码**（使用该版本正确的 mappings）

Decision Flow 格式：

```text
### Decision: 场景描述

IF 条件 A
  → 方案 A

IF 条件 B
  → 方案 B

ELSE
  → 默认或询问用户
```

反模式写在 `knowledge/antipatterns/` 或 `09-anti-patterns.mdc`，条目需含：错误写法、症状、正确方案、原因。

---

## 添加新 Skill

目录：`平台/版本/.cursor/skills/<skill-name>/`

```
mc-block/
├── SKILL.md          # 必须
├── snippets/         # 可选
└── README.md         # 可选
```

`SKILL.md` 顶部元数据示例：

```yaml
---
platform: forge         # forge / fabric / neoforge
version: "1.20.1"
dependencies: []
mappings: mcp           # mcp / yarn / parchment
---
```

创建或修改后必须跑 `sync-skills.ps1`。

Fabric 可额外贡献平台专有 Skill（如 Fabric API、Kotlin、Cloth Config）。

---

## 官方文档与映射数据

### 数据布局（示意）

```
data/
├── forge_1.20.1/
│   ├── forge-docs/<ver>/{raw,processed,index-l0.json,index-l1.json,index-l2.json}
│   ├── mappings/
│   └── extracted/
├── fabric_1.20.1/
│   ├── fabric-docs/<ver>/...
│   ├── fabric-wiki/<ver>/...
│   ├── mappings/          # yarn-*.jar/tiny、yarn-mappings.json、yarn-mappings.sqlite、parchment*
│   └── meta.json
└── neoforge_*/
    └── neoforge-docs/...
```

文档仍遵循 **L0 → L1 → L2 → L2+（processed）** 分层，不可跳层。

### 常用脚本（均在 `mcp-server/scripts/`）

| 方向 | 示例脚本 |
|------|----------|
| Forge 文档 | `fetch-forge-docs.js`、`process-forge-docs.js` |
| Fabric Docs / Wiki / Meta / Mappings | `fetch-fabric-*.js`、`process-fabric-*.js`、`reindex-all-versions.js` |
| Parchment / API 提取 | `parchment-extractor.js` 等 |
| Yarn SQLite | `npm run build:yarn-sqlite`（推荐；运行时禁止全量读 JSON） |
| 一致性审计 | `npm run audit:data` |

### 贡献注意

- **不要**把 `agent-tools/`、`临时文件*.md`、本地 audit 输出提交进仓库（见 `.gitignore`）
- **不要**假设 `mcp-server/data/` 是运行时路径；MCP 读取的是 `MC_SKILL_DATA` 指向的仓库根 `data/`
- 大体积 `*.jar` / `*.zip` 的忽略规则见根 `.gitignore`；完整包走 Release artifact + `SHA256SUMS` + `data-manifest.json`
- Redistribute `data/` 时附带 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)

---

## MCP Server 贡献

### 技术栈

- TypeScript、Node.js **>= 22.5**
- `@modelcontextprotocol/sdk` + `zod`
- 包名 / Cursor 服务名：`mc-ai-coding-assistant-tool` / **`MC-AI-Coding-Assistant-Tool`**

### 源码结构（摘要）

```
mcp-server/
├── src/
│   ├── index.ts                 # 入口，注册工具
│   ├── api/                     # query_api、get_method_params、get_version_info
│   ├── mappings/                # convert_mapping + yarn-sqlite
│   ├── docs-platform/
│   │   ├── forge/ | fabric/ | neoforge/
│   │   └── store.ts             # 共享文档存储抽象
│   ├── porting/                 # analyze_porting_path、port_project
│   ├── datagen/ | crash/ | validate/ | gradle/
│   ├── utils/                   # path、project-sandbox
│   └── workers/
├── scripts/                     # 抓取 / 处理 / 审计 / yarn sqlite
├── test-*.mjs
└── dist/                        # npm run build（git 忽略）
```

### 添加新工具

1. 在对应模块实现并导出
2. 在 `src/index.ts` 注册
3. 补充测试（`npm test`）与 `assert-no-yarn-json-slurp` 相关约束（若触及 Yarn）
4. 更新 `README.md`、`AUTO_SETUP.md`、`mcp-server/README.md` 的工具列表

### 本地开发命令

```bash
cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
set MC_SKILL_DATA=<仓库>/data
npm test
npm run audit:data
npm run smoke:release   # 可选
```

写盘类工具默认关闭；测试 `port_project` 真写时才设置 `MC_SKILL_ALLOW_WRITE` + `MC_SKILL_PROJECT_ROOT`。

---

## Commit 规范

使用中文 commit message，例如：

```
feat(forge/1.20.1): 添加方块实体注册规则
fix(mcp-server): 修正 Yarn sqlite 路径解析
docs(AUTO_SETUP): 同步 31 工具与配置草稿流程
chore(data): 忽略临时 plan 文件
docs(fabric/1.21.1): 补充 mixin 反模式
```

---

## 问题与讨论

如有疑问或想法，欢迎提交 Issue。配置 MCP 时请先阅读 [`AUTO_SETUP.md`](./AUTO_SETUP.md)。
