# AUTO SETUP — MC Skill MCP Server

> **给 AI Agent 看的自动配置脚本。**
> 当用户把这个文件拖入 Cursor（或其他 AI IDE）时，AI 应该自动执行以下所有步骤，无需用户干预。

---

## 目标

把 `mcp-server` 编译、配置好，让 Cursor MCP Tools 能调用到 `mc-forge` 的 11 个工具。

---

## 执行步骤

### Step 1 — 确认项目根目录

本文件所在目录就是项目根目录 `MC_skill/`。

```bash
pwd
```

如果终端输出不是 `MC_skill` 所在的路径，先切换：

```bash
cd <MC_skill根目录路径>
```

---

### Step 2 — 安装依赖并编译

```bash
cd mcp-server
npm install
npm run build
```

**验证编译产物存在：**

```bash
# 检查 dist/index.js 是否生成
ls dist/index.js
```

- 如果报错 → 查看 `mcp-server/` 下 `package.json` 的 `"engines"` 要求，确保 Node.js >= 18
- 如果 `node` 命令找不到 → 告知用户安装 Node.js 18+

---

### Step 3 — 判断盘符，决定配置路径

获取编译产物的绝对路径：

```bash
node -e "console.log(require('path').resolve('mcp-server/dist/index.js'))"
```

**如果输出以 `C:\Users\` 开头（即编译在 C: 盘）：**

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["<上面命令输出的完整路径>"]
    }
  }
}
```

**如果输出以 `H:\` 或其他非 C: 盘开头：**

Windows 下，Node.js 进程的工作目录默认在 `C:\Users\<用户名>`，无法直接访问其他盘符。需要创建目录链接（Junction）。

```powershell
# 创建目录链接（可静默执行，通常不需要管理员权限）
mklink /J C:\Users\<用户名>\mc_skill h:\MC_skill
```

> 如果 `mklink` 失败（权限不足），则告知用户手动在**管理员 PowerShell** 中执行这条命令，然后继续后续步骤。

然后使用链接后的路径：

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["C:/Users/<用户名>/mc_skill/mcp-server/dist/index.js"]
    }
  }
}
```

> 注意：路径中的反斜杠 `\`  改为正斜杠 `/`，JSON 不支持 Windows 路径格式。

---

### Step 4 — 写入 `mcp.json`

1. 确认用户的 Cursor 配置目录：

```bash
# Windows Cursor
echo $APPDATA
# 预期输出类似：C:\Users\<用户名>\AppData\Roaming
```

1. 目标文件路径：`%APPDATA%\Cursor\mcp.json`（即 `C:\Users\<用户名>\AppData\Roaming\Cursor\mcp.json`）
2. 读取现有配置（如果存在）：

```bash
# 检查是否已有 mcp.json
cat "C:/Users/<用户名>/AppData/Roaming/Cursor/mcp.json" 2>/dev/null || echo "FILE_NOT_EXIST"
```

**如果文件已存在：**

- 读取内容，**合并** `mcpServers` 对象（不要覆盖已有的其他 MCP Server 配置）
- 只加入 `mc-forge` 条目，保留其他已有配置

**如果文件不存在：**

- 创建新文件，内容为：

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["<dist/index.js 的完整路径>"]
    }
  }
}
```

**写入文件：**

```bash
# 创建目录（如果不存在）
mkdir -p "C:/Users/<用户名>/AppData/Roaming/Cursor"

# 写入配置（保留已存在的其他 server，只追加 mc-forge）
# 使用 jq 或 node 脚本合并 JSON，避免覆盖已有配置
```

---

### Step 5 — 验证配置

读取写入后的 `mcp.json`，确认：

```json
{
  "mcpServers": {
    "mc-forge": {
      "command": "node",
      "args": ["C:/Users/<用户名>/mc_skill/mcp-server/dist/index.js"]
    }
  }
}
```

---

### Step 6 — 告知用户重启 Cursor

向用户输出以下信息：

> **配置完成！**
>
> MCP Server 已编译并配置到 `mcp.json`。
>
> **下一步：完全关闭 Cursor 窗口，然后重新打开 Cursor。**
>
> 重启后，在左侧边栏 → AI → MCP Tools 中应能看到 `mc-forge`，包含 11 个工具：
>
> - `query_api` — 查询类/方法签名
> - `get_method_params` — 查询方法参数名
> - `convert_mapping` — 映射互转
> - `get_version_info` — 版本信息
> - `diagnose_gradle` — Gradle 诊断
> - `generate_datagen` — DataGen 代码生成
> - `crash_analyze` — 崩溃分析
> - `validate_project` — 项目校验
> - `search_forge_docs` — Forge 文档搜索
> - `get_forge_doc_summary` — 文档摘要
> - `get_forge_doc_full` — 文档全文

---

## 常见错误处理


| 错误                          | 原因             | 解决方案               |
| --------------------------- | -------------- | ------------------ |
| `dist/index.js not found`   | 未编译            | 执行 `npm run build` |
| `node: command not found`   | Node.js 未安装    | 告知用户安装 Node.js 18+ |
| `Access denied` on mcp.json | 权限不足           | 使用管理员身份运行终端        |
| `mklink: Access denied`     | Junction 需要管理员 | 让用户手动以管理员身份执行      |
| MCP Tools 不显示 mc-forge      | Cursor 未重启     | 完全关闭再打开 Cursor     |


---

## 不需要用户做的事

以下操作 **AI Agent 自动完成**，不要让用户手动执行：

- 创建目录链接（`mklink /J`）
- `cd mcp-server && npm install && npm run build`
- 读写 `mcp.json`
- 切换目录

> 如果 `mklink` 权限不足而失败，告知用户手动以管理员身份执行该命令，然后继续后续步骤。

---

## 成功后

所有步骤完成后，告诉用户：

1. 重启 Cursor
2. 在 MCP Tools 中看到 `mc-forge` 即成功
3. 如遇问题，参考 `mcp-server/README.md` 的常见问题章节