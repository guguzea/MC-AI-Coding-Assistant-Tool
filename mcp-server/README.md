# MC MCP Server

本地 **stdio** MCP Server：为 Cursor 等 AI 助手提供 Minecraft 模组开发工具（Forge / Fabric / NeoForge）。

**要求：Node.js >= 22**（Yarn 映射使用内置 `node:sqlite`）。

## 功能特性

- **约 31 个 MCP 工具**：API 查询、映射转换（含 Yarn SQLite 惰性点查）、版本指导、Gradle 诊断、DataGen、崩溃分析、项目校验、Forge/Fabric/NeoForge 文档搜索、数据路径诊断、Mod 移植分析等
- **完整离线 data/**：文档索引、parchment/mcp zip、yarn-mappings.json（源）+ **yarn-mappings.sqlite（运行时）**、porting 知识库
- **三层文档查询**：L0 索引搜索 → L1 摘要 → L2/L2+ 全文
- **硬性禁令**：运行时禁止全量加载 `yarn-mappings.json`（避免 >1.5GB 内存与事件循环阻塞）

---

## 快速开始

### 1. 安装依赖

```bash
cd mcp-server
npm ci
npm run build
# 若 data 中尚无 sqlite：
npm run build:yarn-sqlite
```

### 2. 配置 MCP 客户端

推荐使用 **绝对路径** + `MC_SKILL_DATA` 指向 `data/` 目录（无需 junction）：

```json
{
  "mcpServers": {
    "mc-skill": {
      "command": "node",
      "args": ["H:/MC_skill/mcp-server/dist/index.js"],
      "env": {
        "MC_SKILL_DATA": "H:/MC_skill/data"
      }
    }
  }
}
```

写操作（`port_project` 且 `dryRun=false`）额外需要：

```json
"env": {
  "MC_SKILL_DATA": "H:/MC_skill/data",
  "MC_SKILL_ALLOW_WRITE": "1",
  "MC_SKILL_PROJECT_ROOT": "H:/path/to/your/mod"
}
```

#### 可选：目录联接（旧方案）

若环境无法解析其他盘符，仍可用 `mklink /J`，但优先使用绝对路径 + `MC_SKILL_DATA`。

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["C:/Users/用户名/MC_skill/mcp-server/dist/index.js"]
    }
  }
}
```

#### VS Code（需要 MCP 插件）

安装 [MCP extension](https://marketplace.visualstudio.com/items?itemName=modelcontextprotocol.example) 后，在插件设置中填写相同的 `node <path>/dist/index.js`。

### 3. 重启编辑器

配置完成后，**完全关闭并重新打开** Cursor。MCP 工具栏中应能看到 `mc-skill`，约 **31** 个工具。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | data 目录绝对路径（必填推荐） | `H:/MC_skill/data` |
| `MC_SKILL_ALLOW_WRITE` | `1` 时允许 port_project 写盘 | `1` |
| `MC_SKILL_PROJECT_ROOT` | 写盘允许根目录 | `H:/mods/my-mod` |
| `MC_SKILL_DEBUG_PATHS` | `1` 打印路径解析 | `1` |

### 5. 开发调试

```bash
# 构建
npm run build

# 运行测试（进程复用，精确响应匹配）
npm test

# 监听模式（修改后自动重启）
npm run dev

# 直接运行
node dist/index.js
```

> 调试时可以用 MCP Inspector：
>
> ```bash
> npx @modelcontextprotocol/inspector node dist/index.js
> ```

---

## 工具列表

### 核心工具

| 工具 | 功能 | 输入 |
|------|------|------|
| `query_api` | 查询类/方法的完整签名、参数名、javadoc | `className`, `methodName?`, `version?` |
| `get_method_params` | 查询方法参数名列表（区分重载） | `className`, `methodName`, `descriptor?` |
| `convert_mapping` | mojang/mcp/yarn/parchment 映射互转 | `from`, `to`, `memberName`, `ownerClass?` |
| `get_version_info` | 获取版本的推荐做法和关键变更点 | `version`, `action` |
| `diagnose_gradle` | 校验 build.gradle 和 gradle.properties | `buildGradle`, `gradleProperties?` |
| `generate_datagen` | 生成 DataGen Provider 代码模板 | `providerType`, `modId`, `targetName`, `version?` |
| `crash_analyze` | 解析崩溃日志并给出修复建议 | `crashReport`, `version?` |
| `validate_project` | 校验 mods.toml 和 Java 代码规范 | `modsToml?`, `javaFiles?`, `buildGradle?` 等 |
| `diagnose_data_paths` | 诊断数据目录配置（高级排障） | （无参数） |

### Mod 移植工具

| 工具 | 功能 | 输入 |
|------|------|------|
| `analyze_porting_path` | 分析项目，生成跨平台/跨版本移植路线图（风险评估、动态 routeSteps、参考链接） | `projectPath`, `targetPlatform?`, `targetVersion?` |
| `port_project` | 执行移植步骤（init_architectury / extract_common / apply_version_migration），默认 dryRun | `projectPath`, `action`, `dryRun?`, `confirmed?` |

### 通用文档工具（支持多平台：Forge / NeoForge / Fabric）

| 工具 | 功能 | 输入 |
|------|------|------|
| `list_doc_versions` | 列出支持平台的可用版本 | `platform?` |
| `search_docs` | 通用文档搜索（L0） | `query`, `version?`, `platform?`, `tags?` |
| `get_doc_summary` | 获取文档摘要（L1） | `id`, `version?`, `platform?` |
| `get_doc_full` | 获取文档全文（L2） | `id`, `version?`, `platform?`, `highlight_key?` |
| `get_doc_related` | 获取相关文档 | `id`, `version?`, `platform?`, `limit?` |

### Fabric 专用别名

| 别名 | 指向 |
|------|------|
| `list_fabric_versions` | `list_doc_versions` (platform=fabric) |
| `search_fabric_docs` | `search_docs` (platform=fabric) |
| `get_fabric_doc_summary` | `get_doc_summary` (platform=fabric) |
| `get_fabric_doc_full` | `get_doc_full` (platform=fabric) |
| `get_fabric_doc_related` | `get_doc_related` (platform=fabric) |

### Forge 专用别名（向后兼容）

| 别名 | 指向 |
|------|------|
| `list_forge_versions` | `list_doc_versions` (platform=forge) |
| `search_forge_docs` | `search_docs` (platform=forge) |
| `get_forge_doc_summary` | `get_doc_summary` (platform=forge) |
| `get_forge_doc_full` | `get_doc_full` (platform=forge) |
| `get_forge_doc_related` | `get_doc_related` (platform=forge) |


---

## 使用示例

### 查询 API 方法签名

```
工具: query_api
输入: {
  "className": "net.minecraft.world.entity.LivingEntity",
  "methodName": "getHealth"
}
```

返回：`LivingEntity.getHealth` 的完整签名、参数名（来自 Parchment）、返回值类型和 javadoc。

### 生成 DataGen 代码

```
工具: generate_datagen
输入: {
  "providerType": "loottable",
  "modId": "mymod",
  "targetName": "my_block"
}
```

返回：完整的 `LootTableProvider` + `BlockLootSubProvider` Java 代码，含正确的 `gatherData` 写法。

### 分析 Mod 移植路线

```
工具: analyze_porting_path
输入: {
  "projectPath": "h:/my-forge-mod",
  "targetPlatform": "neoforge",
  "targetVersion": "1.20.4"
}
```

返回：当前平台推断、平台证据评分、风险评估、动态 routeSteps、参考链接和建议的 `query_api` 调用。

### 执行移植步骤

```
工具: port_project
输入: {
  "projectPath": "h:/my-forge-mod",
  "action": "extract_common",
  "dryRun": true
}
```

返回：候选移动清单（`safe_to_move` / `has_loader_calls` / `review_required`），始终 dryRun。

```
工具: port_project
输入: {
  "projectPath": "h:/my-forge-mod",
  "action": "init_architectury",
  "dryRun": true,
  "targetPlatform": "neoforge",
  "targetVersion": "1.20.4"
}
```

返回：diff 预览。用户确认后以 `confirmed: true` 写入文件。

### 搜索 Forge 文档

```
工具: search_forge_docs
输入: { "query": "DeferredRegister" }
工具: get_forge_doc_full
输入: { "id": "1.20.1/concepts_registries" }
```

推荐工作流：`search` → `get_summary` → `get_full`（仅当摘要显示相关内容时才取全文）。

### 分析崩溃日志

```
工具: crash_analyze
输入: { "crashReport": "---- Minecraft Crash Report ----\n..." }
```

---

## 数据来源

### Parchment 映射数据（1.20.1）

- 覆盖 **5720 个 Vanilla Minecraft 类**，33824 个方法，417 个字段
- MCP/srg 层的方法名 + Parchment 参数名
- 数据文件：`data/forge_1.20.1/extracted/api-index.json`

### Forge 官方文档（1.20.1）

- 来源：`https://docs.minecraftforge.net/en/1.20.1/`
- 预处理脚本：`scripts/fetch-forge-docs.js` + `scripts/process-forge-docs.js`
- 覆盖 60 个页面（L0/L1/L2 三层索引）
- 数据文件：`data/forge_1.20.1/forge-docs/1.20.1/`

### Fabric 官方文档（1.20.1）

- 来源：`https://docs.fabricmc.net/develop/`（主）+ `https://fabricmc.net/wiki/documentation:`（旧 Wiki）
- 预处理脚本：`scripts/fetch-fabric-docs.js` + `scripts/process-fabric-docs.js`
- 覆盖 12+ 个页面（L0/L1/L2 三层索引）
- 数据文件：`data/fabric_1.20.1/fabric-docs/1.20.1/`
- `data/fabric_1.20.1/meta.json` 含版本元信息（Loader 版本、Yarn build、Loom 版本等）

> **关于 meta.json**：Fabric 数据目录下有 `meta.json`，记录 Fabric Loader 版本范围、Yarn build、Loom 版本等元信息。该文件**不影响任何 MCP 工具**，仅供人工参考和脚本使用。

---

## 项目结构

```
mcp-server/
├── src/
│   ├── porting/             # analyze_porting_path, port_project
│   ├── api/                  # query_api、get_method_params
│   ├── mappings/              # convert_mapping
│   ├── version/               # get_version_info
│   ├── gradle/               # diagnose_gradle
│   ├── datagen/              # generate_datagen
│   ├── crash/                # crash_analyze
│   ├── validate/             # validate_project
│   ├── docs-platform/           # 多平台文档搜索（Forge/Fabric）
│   │   ├── forge/             # ForgeDocStore + 工具注册
│   │   │   ├── index.ts
│   │   │   └── store.ts
│   │   ├── fabric/           # FabricDocStore + 工具注册
│   │   │   ├── index.ts
│   │   │   └── store.ts
│   │   ├── index.ts          # 统一导出
│   │   └── store.ts          # createDocStore 工厂
├── data/
│   ├── forge_1.20.1/
│   │   ├── extracted/            # Parchment 预提取索引
│   │   ├── forge-docs/           # Forge 文档预处理数据
│   │   │   └── 1.20.1/
│   │   └── mappings/            # Parchment 原始数据
│   └── porting/                  # Mod 移植知识库
│       ├── knowledge-base/
│       │   ├── versions.json     # 版本 breaking changes 知识库
│       │   └── loaders.json     # 跨 Loader API 对照表
│       └── architectury-patterns.json
│   ├── parchment-extractor.js
│   ├── fetch-forge-docs.js
│   ├── process-forge-docs.js
│   ├── fetch-fabric-docs.js    # Fabric 文档抓取（Fabric Docs + Wiki）
│   ├── process-fabric-docs.js  # Fabric 文档处理（Fabric 专用 PRIORITY_TAGS）
│   ├── check-porting-updates.js       # 检查知识库版本更新
│   ├── update-porting-updates.js      # 辅助生成 breaking changes 草稿
│   └── update-architectury-examples.js # 从 GitHub 提取 ExpectPlatform 用例草稿
└── dist/                     # 编译输出（运行时代码）

---

## 文档数据维护脚本

### fetch-forge-docs.js + process-forge-docs.js（Forge）

```bash
node scripts/fetch-forge-docs.js             # 增量抓取 Forge 文档
node scripts/fetch-forge-docs.js --force    # 强制全部重新抓取
node scripts/process-forge-docs.js           # 处理所有版本，产出 index-l0/l1/l2.json
node scripts/process-forge-docs.js --version=1.20.1
```

- raw 文件顶部有元数据行（`> 来源：...` / `> 版本：...`），process 脚本依赖此格式
- 缓存机制：使用 ETag / Last-Modified，避免重复抓取

### fetch-fabric-docs.js + process-fabric-docs.js（Fabric）

```bash
node scripts/fetch-fabric-docs.js             # 增量抓取 Fabric 文档
node scripts/fetch-fabric-docs.js --force      # 强制全部重新抓取
node scripts/process-fabric-docs.js             # 处理，产出 index-l0/l1/l2.json + processed/
node scripts/process-fabric-docs.js --version=1.20.1
```

- **来源优先级**：`docs.fabricmc.net`（官方 VitePress）> `fabricmc.net/wiki/documentation:`（旧 Wiki）
- raw 文件顶部元数据行格式与 Forge 完全一致（确保 process 脚本无缝复用）
- Fabric 专用 PRIORITY_TAGS：区分 `Registry.register` / `Identifier` / `ModInitializer` 与 Forge 的 `DeferredRegister` / `ResourceLocation` / `@Mod`
- ⚠️ 两个 process 脚本的核心解析函数（`parseMarkdown` / `inferTags` 等）逻辑完全一致，仅 PRIORITY_TAGS 不同

### check-porting-updates.js（日常检查）

```bash
node scripts/check-porting-updates.js
```

- 对比 `data/porting/knowledge-base/versions.json` 与硬编码的最新版本
- 发现新版本后输出提醒，**不修改任何文件**
- 适合定期运行（如每周一次）

### update-porting-updates.js（按需生成草稿）

```bash
node scripts/update-porting-updates.js --version=1.20.4
node scripts/update-porting-updates.js --version=26.1
```

- 输出引导信息 + breaking changes 草稿 JSON
- **不自动覆写** `versions.json`，需人工 review 后手动合并
- 草稿 JSON 片段供直接复制到 `versions.json`

### update-architectury-examples.js（按需提取示例）

```bash
node scripts/update-architectury-examples.js --dry-run   # 仅预览，不写入
node scripts/update-architectury-examples.js             # 生成草稿文件
```

- 通过 GitHub API 查询 MultiLoader-Template 等真实项目
- 提取 `@ExpectPlatform` 注解模式 + mixin 配置
- 输出草稿 JSON，需人工 review 后合并到 `architectury-patterns.json`
- 可选设置 `GITHUB_TOKEN` 环境变量提高速率限制

---

## 常见问题

**Q: Cursor 中 MCP 工具不显示？**
A: 确认 `%APPDATA%\Cursor\mcp.json` 格式正确，`dist/index.js` 路径正确，**完全重启 Cursor**。

**Q: `dist/index.js` 找不到？**
A: 需要先 `npm run build` 编译 TypeScript，再运行 server。

**Q: `node` 找不到项目文件？**
A: Windows 下 Node 进程默认工作目录是 `C:\Users\<用户名>`，无法直接访问其他盘符。创建目录链接：

```bash
mklink /J C:\Users\<用户名>\MC_skill h:\MC_skill
```

然后在 `mcp.json` 中使用 `C:/Users/用户名/MC_skill/mcp-server/dist/index.js`。

**Q: 工具返回"平台不支持"？**
A: 当前仅支持 `forge` 和 `fabric` 平台（`neoforge` 正在扩展中）。确认 `data/` 目录下存在对应数据目录且含 `index-l0.json`。

**Q: `search_docs(platform="fabric")` 返回空结果？**
A: 先确认 `data/fabric_1.20.1/fabric-docs/1.20.1/index-l0.json` 存在且非空。若目录为空，先运行 `node scripts/fetch-fabric-docs.js` 抓取文档。

**Q: `query_api` 返回 found=false？**
A: 该工具仅覆盖 Vanilla Minecraft 类（5720 个）。Forge 特有类（如 DeferredRegister）不在数据中，请使用 `search_forge_docs` 查询 Forge 官方文档。