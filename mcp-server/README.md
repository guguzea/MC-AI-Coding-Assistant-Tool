# MC MCP Server

Minecraft Forge MCP Server，为 Cursor AI 编程助手提供 Forge 开发专用工具集。

## 功能特性

- **12 个 MCP 工具**：API 查询、映射转换、版本指导、Gradle 诊断、DataGen 代码生成、崩溃分析、项目校验、Forge 官方文档搜索、数据路径诊断
- **本地数据**：内置 Parchment 1.20.1 映射数据（5720 个类）+ Forge 官方文档，无需联网
- **三层文档查询**：L0 索引搜索 → L1 摘要 → L2/L2+ 全文，按需加载
- **懒加载校验**：数据目录缺失时不影响非文档工具（如 `query_api`）
- **统一错误格式**：所有错误返回 `{ ok: false, error: { code, message, hint } }`

---

## 快速开始

### 1. 安装依赖

```bash
cd mcp-server
npm install
npm run build
```

### 2. 配置 MCP 客户端

#### Cursor（Windows）

编辑 `%APPDATA%\Cursor\mcp.json`：

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["<项目路径>/mcp-server/dist/index.js"]
    }
  }
}
```

**示例（若项目在 `C:\Users\用户名\MC_skill\`）：**

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

#### 项目在其他盘符（如 H:\）

如果 MCP Server 项目在非 C: 盘，需要先创建目录链接，再在配置中使用：

```bash
# 管理员命令行
mklink /J C:\Users\<用户名>\MC_skill h:\MC_skill
```

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

> **为什么需要链接？** Windows 下 Node.js 进程的工作目录默认在 `C:\Users\<用户名>`，`h:` 盘符在 `C:` 进程中无法访问。目录链接解决了这一问题。

#### Claude Desktop（Windows）

编辑 `%APPDATA%\Claude\claude_desktop_config.json`：

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

配置完成后，**完全关闭并重新打开** Cursor。MCP 工具栏（左侧边栏 → AI → MCP Tools）中应能看到 `mc-forge`，包含 12 个工具。

### 4. 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `MC_SKILL_DATA` | 数据目录根路径 | `MC_SKILL_DATA=h:/MC_skill/data` |
| `MC_SKILL_DEBUG_PATHS` | 设为 `1` 打印路径解析过程 | `MC_SKILL_DEBUG_PATHS=1` |

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

### 通用文档工具（支持多平台）

| 工具 | 功能 | 输入 |
|------|------|------|
| `list_doc_versions` | 列出支持平台的可用版本 | `platform?` |
| `search_docs` | 通用文档搜索（L0） | `query`, `version?`, `platform?`, `tags?` |
| `get_doc_summary` | 获取文档摘要（L1） | `id`, `version?`, `platform?` |
| `get_doc_full` | 获取文档全文（L2） | `id`, `version?`, `platform?`, `highlight_key?` |
| `get_doc_related` | 获取相关文档 | `id`, `version?`, `platform?`, `limit?` |

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

---

## 项目结构

```
mcp-server/
├── src/
│   ├── index.ts              # 11 个工具注册 + stdio 启动
│   ├── api/                  # query_api、get_method_params
│   ├── mappings/              # convert_mapping
│   ├── version/               # get_version_info
│   ├── gradle/               # diagnose_gradle
│   ├── datagen/              # generate_datagen
│   ├── crash/                # crash_analyze
│   ├── validate/             # validate_project
│   └── forge-docs/           # search/summary/full 三个工具
│       ├── index.ts
│       ├── store.ts          # 数据访问层 + 缓存
│       └── types.ts
├── data/
│   └── forge_1.20.1/
│       ├── extracted/            # Parchment 预提取索引
│       ├── forge-docs/           # Forge 文档预处理数据
│       │   └── 1.20.1/
│       └── mappings/            # Parchment 原始数据
├── scripts/                  # 数据提取脚本
│   ├── parchment-extractor.js
│   ├── fetch-forge-docs.js
│   └── process-forge-docs.js
└── dist/                     # 编译输出（运行时代码）
```

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

**Q: 工具返回"不支持的版本"？**
A: 当前仅支持 1.20.1。新版本需要运行数据提取脚本更新 `data/` 目录。

**Q: `query_api` 返回 found=false？**
A: 该工具仅覆盖 Vanilla Minecraft 类（5720 个）。Forge 特有类（如 DeferredRegister）不在数据中，请使用 `search_forge_docs` 查询 Forge 官方文档。