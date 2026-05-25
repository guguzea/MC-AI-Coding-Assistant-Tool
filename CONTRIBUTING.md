# 贡献指南

感谢你愿意为 MC AI Coding Assistant Tool 贡献力量！本文档说明如何添加新内容。

---

## 模块总览


| 模块           | 路径                             | 状态         | 适合贡献      |
| ------------ | ------------------------------ | ---------- | --------- |
| 平台规则         | `forge/1.20.1/.cursor/rules/`  | 完整         | 扩展现有规则    |
| Agent Skills | `forge/1.20.1/.cursor/skills/` | 9 个已实现     | 新增 Skill  |
| 代码模式         | `forge/1.20.1/code-patterns/`  | 5 个已实现     | 新增/完善模式   |
| 项目脚手架        | `forge/1.20.1/scaffold/`       | 完整         | 扩展 CLI 工具 |
| MCP Server   | `mcp-server/`                  | 完整         | 新增工具模块    |
| 官方文档数据       | `data/`                        | 1.20.1 已完成 | 新版本/新语言   |
| 知识库          | `knowledge/`                   | 部分完成       | 新增文档/反模式  |
| 新平台          | `fabric/`、`neoforge/`          | 规划中        | 从零创建      |


---

## 添加新平台或新版本

### 步骤 1：复制目录模板

每个平台的最低目录结构如下（以 Forge 1.20.1 为模板）：

```
forge/1.20.1/
├── AGENTS.md
├── .cursor/
│   ├── rules/
│   │   ├── 00-project-setup.mdc
│   │   ├── 01-registry.mdc
│   │   ├── 02-block.mdc
│   │   ├── 03-item.mdc
│   │   ├── 04-entity.mdc
│   │   ├── 05-events.mdc
│   │   ├── 06-networking.mdc
│   │   ├── 07-datagen.mdc
│   │   ├── 08-client-server.mdc
│   │   └── 09-anti-patterns.mdc
│   ├── agents/
│   │   └── default.md
│   └── skills/
│       └── mc-registry/
│           └── SKILL.md
├── scaffold/
│   ├── build.gradle
│   ├── gradle.properties
│   ├── settings.gradle
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── cli/
│   │   ├── validate_project.py
│   │   └── validate_project.bat
│   └── README_AI.md
└── code-patterns/
    ├── 01-block-patterns.md
    ├── 02-item-patterns.md
    ├── 03-entity-patterns.md
    ├── 04-world-patterns.md
    └── 05-datagen-patterns.md
```

### 步骤 2：修改版本相关字段

修改以下文件中的版本号：

- `AGENTS.md`：顶部声明当前版本
- `scaffold/gradle.properties`：`minecraft_version`、`forge_version`
- `scaffold/build.gradle`：替换版本占位符
- `scaffold/README_AI.md`：更新版本说明

### 步骤 3：更新平台总览

在根目录 `README.md` 的「平台说明」表格中添加新条目。

---

## 扩展现有规则

### 规则文件结构

每个 `.mdc` 规则文件必须包含三个部分：

1. **约束（Constraints）** — 明确禁止什么、推荐什么
2. **Decision Flow** — 遇到场景时如何选择正确方案
3. **示例代码** — 可直接运行的代码（Forge 1.20.1）

### Decision Flow 格式规范

每个 Decision Flow 以标题 `### Decision:` 开头，后跟条件分支：

```text
### Decision: 场景描述

IF 条件 A
  → 执行方案 A

IF 条件 B
  → 执行方案 B

ELSE
  → 默认方案或询问用户
```

### 新增反模式

在 `knowledge/antipatterns/` 对应文件中添加，或在 `09-anti-patterns.mdc` 中添加。

反模式条目格式：

```markdown
### 错误描述（简短）

**错误写法：**
```java
// 有问题的代码
```

**错误症状**：描述导致的问题（如「服务端卡死」「NPE 崩溃」）

**正确方案：**

```java
// 修复后的代码
```

**原因**：解释为什么这样做是对的。

```

---

## 添加新 Skill

每个 Skill 是一个独立目录，放在 `平台/版本/.cursor/skills/` 下：

```

mc-block/
├── SKILL.md          # 必须：Skill 主文件
├── snippets/         # 可选：代码片段
└── README.md         # 可选：详细说明

```

当前已实现的 Skills：

| Skill 目录 | 主题 | 状态 |
| --- | --- | --- |
| `mc-registry/` | 注册系统 | 完整 |
| `mc-block/` | 方块开发 | 完整 |
| `mc-item/` | 物品开发 | 完整 |
| `mc-entity/` | 实体开发 | 完整 |
| `mc-mixin/` | Mixin 注入 | 完整 |
| `mc-networking/` | 网络通信 | 完整 |
| `mc-datagen/` | 数据生成器 | 完整 |
| `mc-capability/` | Capability 能力 | 完整 |
| `mc-compat-jei/` | JEI 兼容 | 完整 |

### SKILL.md 格式要求

每个 `SKILL.md` 必须包含以下章节：

```markdown
# Skill 名称

## 适用场景
什么情况下应该使用这个 Skill。

## 核心规则
这个 Skill 的主要约束。

## 示例代码
提供可运行的代码示例。

## 扩展点
在哪里添加新的功能。
```

### 元数据要求

每个 Skill 的 `SKILL.md` 顶部必须包含：

```yaml
---
platform: forge         # forge / fabric / neoforge
version: "1.20.1"      # 支持的版本
dependencies: []        # 需要的依赖（如 "fabric-api"）
mappings: mcp           # 使用的映射（mcp / yarn / parchment）
---
```

---

## 提交代码模式

代码模式放在 `平台/版本/code-patterns/` 下，按功能分类：

```
code-patterns/
├── 01-block-patterns.md
├── 02-item-patterns.md
├── 03-entity-patterns.md
├── 04-world-patterns.md
└── 05-datagen-patterns.md
```

### 片段格式

每个代码片段以元数据头开始，片段内的语言标记代码块可正常嵌套：

```markdown
```yaml
# platform: forge
# version: "1.20.1"
# mappings: mcp
# dependencies: []
# tags: [registry, block, basic]
```

```java
// 完整可编译的代码
```

```

---

## 维护映射数据

映射数据主要通过以下来源维护：

- **MCP**：MinecraftForge/MinecraftForge GitHub（Forge 官方）
- **Yarn**：FabricMC/yarn GitHub
- **Parchment**：ParchmentMC/data GitHub（社区维护的带文档映射）

**注意**：不要手动编辑映射数据。所有映射数据通过 Parchment 的结构化导出更新（MCP Server Phase 3 中处理）。

---

## 提交反模式

在 `knowledge/antipatterns/` 中添加新的反模式条目。

格式：

```markdown
### 错误描述（简短）

**错误写法：**
```java
// 有问题的代码
```

**错误症状**：描述导致的问题（如「服务端卡死」「NPE 崩溃」）

**正确方案：**

```java
// 修复后的代码
```

**原因**：解释为什么这样做是对的。

```

---

## 官方文档数据贡献

`data/` 目录下存放两类数据：**Forge 官方文档**（`forge-docs/`）和 **Parchment 映射**（`mappings/`），由 MCP Server 工具直接读取。

### 数据目录结构

```

data/
└── forge_1.20.1/
    ├── forge-docs/1.20.1/
    │   ├── index-l0.json    # L0 索引（页面标题、URL、版本、标签、优先级）
    │   ├── index-l1.json    # L1 摘要（每个 h2 章节的标题 + 150-200 字摘要）
    │   ├── index-l2.json    # L2 全文索引（章节列表 + 代码块数量 + 关键段数）
    │   ├── _manifest.json   # 版本清单
    │   ├── raw/             # 原始 Markdown（fetch-forge-docs.js 产出）
    │   └── processed/       # L2+ 关键标记文件（process-forge-docs.js 产出）
    │
    ├── mappings/
    │   ├── parchment.json          # 原始 Parchment JSON（从 ParchmentMC/data 下载）
    │   └── parchment-1.20.1-2023.09.03.zip
    │
    └── extracted/
        ├── api-index.json     # 完整 API 索引
        ├── method-lookup.json # 方法快速查找表
        ├── class-names.json   # 类名列表（模糊搜索用）
        └── critical-classes.json # 关键 Forge 类状态

```

### 三个脚本及其作用

| 脚本 | 位置 | 作用 | 输入 | 输出 |
| --- | --- | --- | --- | --- |
| `fetch-forge-docs.js` | `mcp-server/scripts/` | 爬取官方文档 | `docs.minecraftforge.net` | `data/forge_1.20.1/forge-docs/{version}/raw/*.md` |
| `process-forge-docs.js` | `mcp-server/scripts/` | 清洗 + 生成三层索引 | `raw/*.md` | `index-l0/1/2.json`、`processed/*.md` |
| `parchment-extractor.js` | `mcp-server/scripts/` | 提取 Parchment 关键类和方法 | `data/forge_1.20.1/mappings/parchment.json` | `data/forge_1.20.1/extracted/*.json` |

### Forge 文档数据贡献方向

贡献 Forge 文档数据时，必须遵循 **四层结构**：

```

L0 索引（index-l0.json）
  └── id、label、url、tags、priority、sectionCount

L1 摘要（index-l1.json）
  └── 在 L0 基础上增加 firstParagraph + sections[].summary

L2 全文（index-l2.json）
  └── 在 L1 基础上增加 sections[].level/title、hasCodeBlocks、codeBlockCount、keySections

L2+ 关键标记（processed/*.md）
  └── 在 Markdown 中插入  等标记

```

**每层须在上层基础上叠加，不可跳过层级。**

#### 方向 1：新增 Minecraft/Forge 版本

1. 在 `fetch-forge-docs.js` 的 `CHAPTERS` 对象中添加新版本号和页面列表
2. 运行 `node scripts/fetch-forge-docs.js --version <版本号>` 爬取文档
3. 运行 `node scripts/process-forge-docs.js --version <版本号>` 生成四层结构
4. 在 `mcp-server/src/forge-docs/store.ts` 中添加版本支持
5. 更新 `README.md` 平台说明表格

#### 方向 2：新增多语言文档

1. 在 `scripts/fetch-forge-docs.js` 中添加语言参数支持（参考 MkDocs 国际化路径）
2. 在 `data/` 下新建语言子目录（如 `data/forge_1.20.1_zh/`）
3. 在 `store.ts` 的 `searchIndex()` 中添加语言过滤

#### 方向 3：完善关键标记（L2+）

`processed/` 目录下的 Markdown 文件包含手动或自动标记的关键段落，可通过编辑标记改善 AI 检索质量：

| 标记 | 类型 | 识别规则 |
| --- | --- | --- |
| `<!-- key:🔴 -->` | 新手必读 | Note / Warning / Important / Tip admonition 段落 |
| `<!-- key:🟠 -->` | 常见错误 | 包含 "do not" / "never" / "avoid" / "deprecated" 的段落 |
| `<!-- key:🟢 -->` | 示例代码 | 完整代码块或 "示例" 章节附近的代码 |

#### 方向 4：调整索引优先级

在 `scripts/process-forge-docs.js` 的 `PRIORITY_TAGS` 中调整关键词权重，影响搜索结果排序。权重越高，页面在 L0 搜索结果中排名越靠前。

### Parchment 映射数据贡献方向

Parchment 数据由 `parchment-extractor.js` 提取，供 `mcp-server/src/mappings/` 使用。

#### 方向 5：更新 Parchment 版本

1. 从 [ParchmentMC/data Releases](https://github.com/ParchmentMC/data/releases) 下载新版 `parchment-{version}.zip`
2. 解压后重命名为 `parchment.json`，替换 `data/forge_1.20.1/mappings/parchment.json`
3. 运行 `node scripts/parchment-extractor.js` 重新生成 `data/forge_1.20.1/extracted/` 下的所有索引文件
4. 在 `mcp-server/src/mappings/index.ts` 的文件头注释中更新版本说明

#### 方向 6：新增关键类覆盖

在 `scripts/parchment-extractor.js` 的 `CRITICAL_CLASSES` 集合中添加遗漏的 Forge 核心类，然后重新提取。

### 路径注意事项

- 脚本中的 `DATA_DIR` 使用相对路径 `../../..`，以脚本文件自身为基准
- 爬虫脚本（`fetch` / `process`）输出到 `mcp-server/data/`（被 git 忽略），需手动复制到 `MC_skill/data/`
- MCP Server 运行时读取 `MC_skill/data/`（项目根目录下的 data）

---

## Commit 规范

使用中文 commit message，格式：

```

feat(forge/1.20.1): 添加方块实体注册规则
fix(mc-mixin): 修正 @Inject at 参数说明
docs(fabric/1.20.1): 补充 Fabric Registry 决策流
chore(mcp-server): 更新 Parchment 映射索引
docs(forge-docs): 新增 1.20.4 版本文档支持

```

---

## 问题与讨论

如有疑问或想法，欢迎提交 Issue。
```

