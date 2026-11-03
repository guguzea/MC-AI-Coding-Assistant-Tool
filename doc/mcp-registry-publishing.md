# 被 MCP 目录收录：协议件、发布链与核对口径

> 本项目（`mc-ai-coding-assistant-tool`，本地 stdio MCP）**尚未被任何第三方目录收录**（2026-11-03 实测：
> 官方 registry `search=guguzea` 返回 `count:0`、Glama 条目 404）。
> 本文件是「仓库侧准备件 + 人执行清单」：**仓库侧能做的事已经做完**，剩下每一跳都要用**你自己的账号**点/敲，
> agent 不代发、不代提 PR（与根 `AGENTS.md`「人在环 / 不代上传发布」同一条铁律）。

## 一、结论先行：先做官方 Registry，其余大半自动跟随

| 目录 | 机制 | 本项目可行性 | 依据 |
|---|---|---|---|
| **官方 MCP Registry** | `mcp-publisher publish`（PR 无效） | **高** —— 协议件已就位并通过 `/validate` | [README](https://github.com/modelcontextprotocol/registry/blob/main/README.md) 原话：「Adding a server.json, a server directory, or an entry in data/seed.json will not publish or list your server, even if the PR is merged.」 |
| **Glama** | 自动镜像官方 registry + 认领 | **高** —— 发完官方就自动进 | [methodology](https://glama.ai/mcp/methodology) 原话：「Glama ingests and re-publishes everything in the official registry」；[llms.txt](https://glama.ai/llms.txt) 自称「A superset of the official MCP Registry」 |
| **punkpeye/awesome-mcp-servers** | fork + 改 README 提 PR | **高** —— 归 🎮 Gaming | [CONTRIBUTING](https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/CONTRIBUTING.md)：「Maintain alphabetical order within each category」「One server per line」「add `🤖🤖🤖` to the end of the PR title」 |
| **PulseMCP** | 暂停提交，恢复后自动抓官方 registry | 低（等） | 提交页原话：「submissions and changes are temporarily paused」，并称会自动 pickup 官方 registry |
| **Cline Marketplace** | GitHub Issue 模板 | 中偏低 | 仓库最后 push 2025-06-24（约 16 个月未变更），**是否仍受理未核实** |
| **Docker MCP Registry** | 仓库 PR + 必须 Dockerfile | **不可行** | 许可原文只接受 MIT/Apache 类；本项目是 PolyForm Noncommercial |
| **Smithery** | 已于 2026-10-31 关停 Proxy/API/CLI/SDK | 不可行 | 官网横幅 + `/docs` 全 404 |

**为什么先官方**：官方把自己定位成 canonical source，下游（Glama / PulseMCP）靠轮询未认证只读 API 拉数据；
官方**不反向**从下游收录。⇒ 一次 `publish` 覆盖多家，比逐家填表省事。

## 二、仓库侧已就绪的协议件

| 文件 | 作用 | 状态 |
|---|---|---|
| `server.json`（仓库根） | 官方 registry 的登记载荷 | **已修**：`description` 97 字（上限 100）、`_meta` 改成官方唯一保留的扁平键 `io.modelcontextprotocol.registry/publisher-provided` |
| `glama.json`（仓库根） | Glama 认领（组织仓库必需；个人仓库是加分项） | **已新增**：`{"$schema":"https://glama.ai/mcp/schemas/server.json","maintainers":["guguzea"]}` |
| `mcp-server/package.json` 的 `mcpName` | npm 所有权校验（必须与 `server.json` 的 `name` 逐字相同） | 已有且一致 |
| `mcp-server/package.json` 的 `bin` | 让 `npx mc-ai-coding-assistant-tool` 真的能拉起 | **已修**：新增 `"mc-ai-coding-assistant-tool": "./dist/index.js"` + 给 `src/index.ts` 补 shebang |

### 2.1 两处「不改就发不出去 / 发出去也不能用」的坑（都已修，写明为什么）

**坑 A —— `server.json` 原样会被 registry 拒。** 用官方 `POST /v0.1/validate` 实测原件的回执：

```json
{"detail":"validation failed","errors":[
  {"message":"unexpected property","location":"body._meta.io"},
  {"message":"expected length <= 100","location":"body.description"}
]}
```

第一处：schema 的 `_meta` 只声明了一个属性名 —— 那个名字**本身就带点号**（字面 key 是
`io.modelcontextprotocol.registry/publisher-provided`），而不是三层嵌套对象。写成嵌套会被判
`unexpected property`，且官方对未声明的 key 是**静默丢弃**的，所以原来的 `dataDistribution` 说明根本存不下来。
第二处：`description` 上限 100 字符，原件 115。

**坑 B —— 只改 `server.json` 的话，用户 `npx` 起不来。** 实测已发布的 2.0.0：

```text
$ npx -y mc-ai-coding-assistant-tool@2.0.0 --version
npm error could not determine executable to run
```

根因在 npm 自己的 `libnpmexec/lib/get-bin-from-manifest.js`：包的 `bin` 里**既没有与包名同名的键、又有多个不同目标**
时，直接抛这个错（只有「恰好一个 bin」或「所有 bin 指向同一文件」才会自动取）。
本项目原来两个 bin（`mc-skill` / `mc-skill-scripts`）指向不同文件 ⇒ 必然抛。
同侪包都是把 bin 键写成包名（`exa-mcp-server`、`firecrawl-mcp`、`chrome-devtools-mcp` 均如此，实测 npm registry 元数据）。
⇒ 新增 `mc-ai-coding-assistant-tool` 这个 bin 键指向 MCP 入口 `dist/index.js`（原两个 bin 一个没动，CLI 用法不变）。

## 三、执行清单（全部由你本人操作）

### Step 0 · 先发一个新 npm 版本（否则下面的 registry 条目指向的是起不来的 2.0.0）

`bin` 与 shebang 的修复只有**发到 npm** 才生效；`server.json` 现在写的是 `2.0.0`，
而 2.0.0 是修复**之前**发的。顺序必须是：**先 `npm publish`，再改 `server.json` 的版本号，最后 `mcp-publisher publish`**。

```powershell
cd mcp-server
npm run build          # 已在本机跑过，干净
npm publish --access public
```

发布后把 `server.json` 的**两处**版本号改成新版本（顶层 `version` 与 `packages[0].version`，两处都要改）：

```powershell
# 在仓库根执行；<newver> 换成刚发的版本（例如 2.0.1）
(Get-Content server.json -Raw) -replace '"2\.0\.0"', '"<newver>"' | Set-Content server.json -Encoding UTF8
```

改完**一定要重新验一遍**（这一步免费、无副作用，替代本地装 CLI）：

```powershell
node -e "const b=require('fs').readFileSync('server.json','utf8');fetch('https://registry.modelcontextprotocol.io/v0.1/validate',{method:'POST',headers:{'content-type':'application/json'},body:b}).then(r=>r.text()).then(console.log)"
```

期望回执：`{"valid":true,"issues":[]}`。

> ⚠️ **同时要拍板的一件事：许可证口径对不上。** 仓库 `LICENSE` 与 `mcp-server/package.json` 写的是
> PolyForm Noncommercial 1.0.0，但**已发布的 npm 2.0.0 元数据里 `license` 是 `MIT`**（npm registry 与 jsDelivr 双查）。
> 会读包元数据的目录（Glama 许可展示、mcp.so、Docker 审核）看到的是 MIT。发新版本时顺手统一，
> 否则「非商业许可」这件事在目录里是看不见的。（官方 registry 的 schema **根本没有 license 字段**，所以它不受影响。）

### Step 1 · 官方 MCP Registry

装 CLI（Windows PowerShell，官方 quickstart 原文命令）：

```powershell
$arch = if ([System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq "Arm64") { "arm64" } else { "amd64" }
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_$arch.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz mcp-publisher.exe
Remove-Item mcp-publisher.tar.gz
mcp-publisher --help   # 应看到 init / login / logout / publish / status / validate
```

登录（device flow，会打印 `https://github.com/login/device` 和一次性 code）→ 发布：

```powershell
cd <仓库根>
mcp-publisher login github
mcp-publisher validate      # 先验；等价于打 /v0.1/validate
mcp-publisher publish       # 默认读当前目录的 ./server.json
```

期望输出含 `✓ Server io.github.guguzea/mc-ai-coding-assistant-tool version <ver>`。

> **已知坑（官方 issue #1468）**：交互式 `login github` 走 GitHub App，**读不到组织成员关系**，
> 因此发不了 `io.github.<组织>` 命名空间。本项目是个人账号 `guguzea`（非组织），走交互式登录即可；
> 若日后改到组织命名空间，得换 PAT（classic 需 `read:org`）或 Actions OIDC。

**核对是否真进库**（注意 `name` 里的 `/` 必须编码成 `%2F`）：

```powershell
curl.exe "https://registry.modelcontextprotocol.io/v0.1/servers?search=guguzea"
curl.exe "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.guguzea%2Fmc-ai-coding-assistant-tool/versions/latest"
```

### Step 2 · Glama

发完官方后**先等几小时**（Glama 无 SLA 承诺），再查 `https://glama.ai/mcp/servers` 搜 `mc-ai-coding-assistant-tool`。

- 若已自动出现：用 GitHub OAuth 登录认领（methodology 明文要求提交者对仓库有 **write/admin** 权限）。
- 若没自动出现：在 `https://glama.ai/mcp/servers` 点 **Add MCP Server**，填仓库 URL + 显示名 + 短描述。
- `glama.json` 已经加在仓库根，认领时会被读到（**改了它要重走一次认领**才会被拾取）。

> 风险（methodology §1.3 原话）：Glama 会用 Dockerfile 构建，「If the AI-inferred Dockerfile fails to produce a working build,
> the profile page is preserved but distribution is withheld」——即页面在、但不进搜索与分类。
> 本项目是本地 stdio、无 Dockerfile，且核心语料 1.8 GiB 走 Release 不在包里，**推断构建能否成功未核实**。
> 就算被 withheld，官方 registry 那条已经生效，不影响主路径。

### Step 3 · punkpeye/awesome-mcp-servers

fork → 在 README 的 **🎮 Gaming** 分类（锚点 `<a name="gaming"></a>`）里按字母序插一行 → 提 PR。
该分类已有同类先例：`Coding-Solo/godot-mcp`（Godot 引擎）、`CoderGamester/mcp-unity`（Unity 引擎），**不需要新建分类**。

条目格式（照同表既有行）：`- [owner/repo](URL) <语言emoji> <范围emoji> <OS emoji...> - 一句话描述`

- 语言 = 📇（TS/JS）；范围 = 🏠（Local，本地 stdio）
- OS emoji 本项目实际支持面**未核实**，别照抄——确认后再填
- Glama 分数徽章是惯例但非强制（抽样 267 条：201 带 / 66 不带）

**agent 提交的快速通道**：CONTRIBUTING 顶部 NOTE 原话是「add `🤖🤖🤖` to the end of the **PR title**」——
是 **PR 标题后缀**，不是条目行里加表情。

### Step 4（可选）· Cline Marketplace

`https://github.com/cline/mcp-marketplace/issues/new?template=mcp-server-submission.yml`
必填三件：仓库 URL、**400×400 PNG logo**、勾选「已用 README.md 和/或 llms-install.md 验证能装成功」。
title 前缀固定 `[Server Submission]: `。
`llms-install.md` 是 Cline 自家约定（无 schema、可选），放仓库根即可。

> 该仓库最后 push 是 2025-06-24，README 却仍写「review within a couple of days」⇒ **是否仍受理未核实**，
> 建议先用一个试探性 issue 探路，别一上来就投入做 logo。

## 四、不做的与不代做的

- **不代发布**：`npm publish` / `mcp-publisher publish` / 任何 PR，一律由你本人执行（凭据是你的）。
- **不投 Docker MCP Registry**：其收录原文要求 MIT/Apache 类许可，本项目 PolyForm 属限制性许可，投了也是拒。
- **不投 Smithery**：2026-10-31 已关停 Proxy/API/CLI/SDK，站点 docs 全 404，无自助入口。

## 五、未核实清单（禁止当结论用）

1. `mcp-publisher` 当前最新版本号：本机 `github.com` 与 `api.github.com` 被拦（TLS `UNABLE_TO_VERIFY_LEAF_SIGNATURE`），
   拿不到 releases 页；命令照官方 quickstart 的 `releases/latest/download` 形态写，未实测下载。
   ⚠️ **不要装 npm 上的 `mcp-publisher`**：npm 上同名包 latest 是 0.4.2，描述与 MCP 无关（俄语、浏览器自动化），**不是**官方 CLI。
2. Glama 对「本地 stdio + 无 Dockerfile + 数据外挂」这类服务器的推断构建成功率。
3. `glama.json` 除 `maintainers` 外的字段（FAQ 说有 display name / description / category / build spec，
   但公开 [schema](https://glama.ai/mcp/schemas/server.json) 只声明 `maintainers`）⇒ 本仓库只写最小集。
4. 官方 registry 何时 GA：docs 通篇仍标 preview（preview 期官方保留 breaking change / 数据重置的权利）。
5. 本项目实际支持的 OS（决定 awesome 列表里填哪几个 OS emoji）。
6. Glama 从官方 registry 抓取的实际延迟（官方对下游无时效/SLA 承诺）。
