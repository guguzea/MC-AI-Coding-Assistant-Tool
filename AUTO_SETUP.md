# AUTO SETUP �?MC Skill MCP Server

> **�?AI Agent 看的自动配置脚本�?*
> 当用户把这个文件拖入 Cursor（或其他 AI IDE）时，AI 应该自动执行以下所有步骤，无需用户干预�?

---

## 目标

�?`mcp-server` 编译好，�?*生成** Cursor MCP 配置草稿供用户确认后粘贴（不要静默改写用户的 `mcp.json`，不要自动执�?`mklink`）。目标：本地 stdio MCP，约 **31** 个工具可用�?

---

## 执行步骤

### Step 1 �?确认项目根目�?

本文件所在目录就是项目根目录 `MC_skill/`�?

```bash
pwd
```

如果终端输出不是 `MC_skill` 所在的路径，先切换�?

```bash
cd <MC_skill根目录路�?
```

---

### Step 2 �?安装依赖并编�?

```bash
cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
```

**验证编译产物存在�?*

```bash
# 检�?dist/index.js 是否生成
ls dist/index.js
```

- 如果报错 �?查看 `mcp-server/` �?`package.json` �?`"engines"` 要求，确�?**Node.js >= 22**
- 如果 `node` 命令找不�?�?告知用户安装 Node.js 22+
- Yarn 映射依赖 `data/fabric_*/mappings/yarn-mappings.sqlite`（由 `build:yarn-sqlite` 生成�?

---

### Step 3 �?判断盘符，决定配置路�?

获取编译产物的绝对路径：

```bash
node -e "console.log(require('path').resolve('mcp-server/dist/index.js'))"
```

**如果输出�?`C:\Users\` 开头（即编译在 C: 盘）�?*

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["<上面命令输出的完整路�?"]
    }
  }
}
```

**如果输出�?`H:\` 或其他非 C: 盘开头：**

Windows 下，Node.js 进程的工作目录默认在 `C:\Users\<用户�?`，无法直接访问其他盘符。需要创建目录链接（Junction）�?

```powershell
# 创建目录链接（可静默执行，通常不需要管理员权限�?
mklink /J C:\Users\<用户�?\mc_skill h:\MC_skill
```

> **备选方�?�?环境变量配置�?*
>
> 如不想创�?symlink，也可通过环境变量 `MC_SKILL_DATA` 指定数据目录路径�?
>
> ```powershell
> $env:MC_SKILL_DATA = "h:\MC_skill"
> ```
>
> 路径解析优先级：`MC_SKILL_DATA` 环境变量 > symlink 追溯 > cwd 回退�?

> 如果 `mklink` 失败（权限不足），则告知用户手动�?*管理�?PowerShell** 中执行这条命令，然后继续后续步骤�?

然后使用链接后的路径�?

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["C:/Users/<用户�?/mc_skill/mcp-server/dist/index.js"]
    }
  }
}
```

> 注意：路径中的反斜杠 `\` 改为正斜�?`/`，JSON 不支�?Windows 路径格式�?

---

### Step 4 �?写入 `mcp.json`

1. 确认用户�?Cursor 配置目录�?

```bash
# Windows Cursor
echo $APPDATA
# 预期输出类似：C:\Users\<用户�?\AppData\Roaming
```

2. 目标文件路径：`%APPDATA%\Cursor\mcp.json`
3. 读取现有配置（如果存在）�?

```bash
# 检查是否已�?mcp.json
cat "C:/Users/<用户�?/AppData/Roaming/Cursor/mcp.json" 2>/dev/null || echo "FILE_NOT_EXIST"
```

**如果文件已存在：**

- 读取内容�?*合并** `mcpServers` 对象（不要覆盖已有的其他 MCP Server 配置�?
- 只加�?`MC-AI-Coding-Assistant-Tool` 条目，保留其他已有配�?

**如果文件不存在：**

- 创建新文件，内容为：

```json
{
  "mcpServers": {
    "MC-AI-Coding-Assistant-Tool": {
      "command": "node",
      "args": ["<dist/index.js 的完整路�?"]
    }
  }
}
```

**写入文件�?*

```bash
# 创建目录（如果不存在�?
mkdir -p "C:/Users/<用户�?/AppData/Roaming/Cursor"

# 写入配置（保留已存在的其�?server，只追加 MC-AI-Coding-Assistant-Tool�?
# 使用 jq �?node 脚本合并 JSON，避免覆盖已有配�?
```

---

### Step 5 �?验证配置

读取写入后的 `mcp.json`，确认结构正确�?

---

### Step 6 �?告知用户重启 Cursor

向用户输出以下信息：

> **配置完成�?*
>
> MCP Server 已编译并配置�?`mcp.json`�?
>
> **下一步：完全关闭 Cursor 窗口，然后重新打开 Cursor�?*
>
> 重启后，在左侧边�?�?AI �?MCP Tools 中应能看�?`MC-AI-Coding-Assistant-Tool`，包含以下工具：

| 模块 | 工具 | 功能 |
| --- | --- | --- |
| API 查询 | `query_api` | 按类名查�?Forge/MCP API 签名 |
| API 查询 | `get_method_params` | 查询方法参数名（需�?`@Environment` 标注�?|
| API 查询 | `get_version_info` | 查询版本支持�?API 范围 |
| Forge 文档 | `search_forge_docs` | 按关键词搜索 Forge 官方文档 |
| Forge 文档 | `get_forge_doc_summary` | 获取文档摘要（L1�?|
| Forge 文档 | `get_forge_doc_full` | 获取文档全文（L2+�?|
| 映射转换 | `convert_mapping` | MCP �?Parchment �?Mojang 互转 |
| DataGen | `generate_datagen` | 生成数据生成器代�?|
| 崩溃分析 | `crash_analyze` | 分析崩溃日志，定位问题原�?|
| 项目校验 | `validate_project` | 校验模组项目结构 |
| Gradle | `diagnose_gradle` | 诊断 Gradle 构建问题 |

---

## 常见错误处理


| 错误                          | 原因             | 解决方案               |
| --------------------------- | -------------- | ------------------ |
| `dist/index.js not found`   | 未编�?           | 执行 `npm run build` |
| `node: command not found`   | Node.js 未安�?   | 告知用户安装 Node.js 18+ |
| `Access denied` on mcp.json | 权限不足           | 使用管理员身份运行终�?       |
| `mklink: Access denied`     | Junction 需要管理员 | 让用户手动以管理员身份执�?     |
| MCP Tools 不显�?MC-AI-Coding-Assistant-Tool      | Cursor 未重�?    | 完全关闭再打开 Cursor     |


---

## 不需要用户做的事

以下操作 **AI Agent 自动完成**，不要让用户手动执行�?

- 创建目录链接（`mklink /J`�?
- `cd mcp-server && npm install && npm run build`
- 读写 `mcp.json`
- 切换目录

> 如果 `mklink` 权限不足而失败，告知用户手动以管理员身份执行该命令，然后继续后续步骤�?

---

## 成功�?

所有步骤完成后，告诉用户：

1. 重启 Cursor
2. �?MCP Tools 中看�?`MC-AI-Coding-Assistant-Tool` 即成�?
3. 如遇问题，参�?`mcp-server/README.md` 的常见问题章�?
