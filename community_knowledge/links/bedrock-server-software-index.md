---
id: links/bedrock-server-software-index
title: 基岩版服务端软件索引（LeviLamina/Nukkit/Endstone/Dragonfly，外链）
url: https://github.com/LiteLDev/LeviLamina
summary: 基岩版服务端软件与开发入口：LeviLamina（原 LiteLoaderBDS，C++ 原生）、PowerNukkitX / Cloudburst Nukkit（Java）、Endstone（Python/C++）、Dragonfly（Go）、bdsx（Node.js）。本仓基岩面只做 Add-On（manifest.json / BP / RP），服务端面为零覆盖，本页补这一块的入口，全部仅外链不入库正文。
tags: [index, bedrock, server-side, leviLamina, nukkit, endstone, dragonfly, bdsx, link-only]
sourceKind: links
mcHint: 各软件自带的 BDS 版本轴不同；引用前先看该软件当前支持的 BDS 版本
---

# 基岩版服务端软件索引（外链）

> **本页补哪个缺口**：本仓基岩面（根 `AGENTS.md` 第 8 步）只判 `manifest.json` + `format_version` + `modules` 的 **Add-On** 形态，语料也只有 Microsoft Learn 创作文档与 `@minecraft/server` 声明摘录。**基岩版服务端**是另一条技术栈（第三方服务端软件 + 各自的插件 API），本仓零覆盖。本页只给入口，不给用法。

## 这些软件不是同一件事

| 软件 | 语言栈 | 形态 | 本仓能否给 API 依据 |
|------|--------|------|---------------------|
| LeviLamina（原 LiteLoaderBDS） | C++（原生 mod 加载进 BDS） | 服务端二进制 + 原生插件 | ❌ 无语料；类名/签名须看该仓头文件 |
| LegacyScriptEngine（LSE） | JavaScript/ Lua 脚本 | LeviLamina 之上的脚本引擎 | ❌ 无语料 |
| PowerNukkitX / Cloudburst Nukkit | Java | 独立实现的服务端（非 BDS） | ❌ 无语料；与 Bukkit 生态**不通用** |
| Endstone | Python / C++ | BDS 插件加载器 | ❌ 无语料 |
| Dragonfly | Go | 独立实现的服务端 | ❌ 无语料 |
| bdsx | TypeScript | BDS 的 Node.js 绑定 | ❌ 无语料 |

⚠️ 这些 API **一律不在**本仓的 `query_api` / `search_*_docs` / 加载器摘要面内。写任何一家的代码，类名与方法签名**只能**来自该软件的官方文档或头文件，查不到就留 `// TODO(未核实)`。

## 状态约定

本页条目状态只有两种取值：

- **✅ 可用** —— 默认。含反爬主机对脚本返回 403、本机 DNS 污染/超时、以及站点侧 5xx 抖动——这三类都**不是失效**。
- **❌ 已失效** —— 仅限实测到 **404 / 410 / NXDOMAIN**，逐条列在文末《已失效条目》。

## 入口

### LeviLamina（原 LiteLoaderBDS）

| 资源 | 链接 | 状态 |
|------|------|------|
| 官方主页（中文） | https://lamina.levimc.org/zh/ | ✅ 可用 |
| 官方文档站 | https://docs.levimc.org/ | ✅ 可用 |
| 官方仓库 | https://github.com/LiteLDev/LeviLamina | ✅ 可用 |
| LegacyScriptEngine（脚本引擎） | https://lse.levimc.org/ | ✅ 可用 |
| 旧版仓库（LiteLoaderBDSv2，已停更） | https://github.com/LiteLDev/LiteLoaderBDSv2 | ✅ 可用 |

### Endstone

| 资源 | 链接 | 状态 |
|------|------|------|
| 官方文档 | https://endstone.dev/latest/ | ✅ 可用 |
| 官方仓库 | https://github.com/EndstoneMC/endstone | ✅ 可用 |

### PowerNukkitX / Cloudburst Nukkit（Java）

| 资源 | 链接 | 状态 |
|------|------|------|
| PowerNukkitX 官方仓库 | https://github.com/PowerNukkitX/PowerNukkitX | ✅ 可用 |
| PowerNukkitX 快速入门教程（社区） | https://github.com/wuliao697/PowerNukkitXTutorial | ✅ 可用 |
| PowerNukkitX 官网（旧域名，522 站点故障） | http://www.powernukkitx.cn/ | ✅ 可用 |
| PowerNukkitX 文档（旧域名） | https://www.powernukkitx.com/doc/index.html | ❌ 已失效（NXDOMAIN，见文末） |
| Cloudburst Nukkit 文档 | https://cloudburstmc.org/wiki/nukkit | ✅ 可用 |
| Cloudburst Nukkit 仓库 | https://github.com/CloudburstMC/Nukkit | ✅ 可用 |

### Dragonfly / bdsx

| 资源 | 链接 | 状态 |
|------|------|------|
| Dragonfly wiki | https://github.com/df-mc/dragonfly/wiki | ✅ 可用 |
| Dragonfly 仓库 | https://github.com/df-mc/dragonfly | ✅ 可用 |
| bdsx wiki | https://github.com/bdsx/bdsx/wiki | ✅ 可用 |
| bdsx 仓库 | https://github.com/bdsx/bdsx | ✅ 可用 |

### 横评与官方产物

| 资源 | 链接 | 状态 |
|------|------|------|
| 基岩版服务端软件横评（Bedrock Wiki） | https://wiki.bedrock.dev/servers/server-software.html | ✅ 可用 |
| 基岩版服务端软件横评（Fandom） | https://minecraftservers.fandom.com/wiki/Bedrock_Edition_server_software | ✅ 可用 |

## 已失效条目

**判据**：2026-10-31 实测 **404 / 410 / NXDOMAIN** 三条硬失效之一。403（反爬）、超时（网络）、5xx（站点故障）都**不计入失效**。

| 原条目 | 链接 | 读数 |
|--------|------|------|
| PowerNukkitX 官方文档（旧域名） | https://www.powernukkitx.com/doc/index.html | **NXDOMAIN**（该域名无 A 记录；换 `github.com/PowerNukkitX/PowerNukkitX`） |

`powernukkitx.cn` 的 522 按本页约定**不计为失效**，已在上面标为可用；但 Cloudflare 连不上源站意味着**人打开也大概率打不开**，实际取用请走 GitHub 仓库。

## 用法与边界

- 先确认工程形态：包根 `manifest.json` + `modules` ⇒ Add-On，走第 8 步与 `search_bedrock_docs`；**生成的是服务端插件工程** ⇒ 本页，且本仓**没有**对应的规则树与语料，只能按该软件自家文档写。
- `generate_paper_plugin` / `generate_playtest_server_driver` 是 **Java 服务端面（Paper/Bukkit）** 的工具，**不适用于**基岩任何服务端软件。
- 这些服务端软件与 Add-On 的 Script API（`@minecraft/server`）是**两套东西**：前者跑在第三方服务端，后者跑在 BDS 官方脚本引擎上。别把 `authored/bedrock-script-api-primer` 里的接口名搬进 Nukkit 插件。