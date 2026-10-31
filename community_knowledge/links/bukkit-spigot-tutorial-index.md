---
id: links/bukkit-spigot-tutorial-index
title: Bukkit/Spigot 插件开发教程索引（中文社区，外链）
url: https://www.spigotmc.org/wiki/spigot/
summary: 中文社区的 Bukkit/Spigot 插件开发教程与 API 文档入口：官方 wiki、Bukkit 中文 javadoc、事件/Packet 协议库/NMS 自定义实体等专题长文。本仓服务端面只收签名面（data/spigot_*/、data/paper-api_*/），本页补的是「教程该怎么查」这一层，全部仅外链不入库正文。
tags: [index, bukkit, spigot, paper, plugin, chinese, server-side, link-only]
sourceKind: links
mcHint: 跨版本（1.8–1.21.x）；条目多数不标版本，引用前先对版本
---

# Bukkit/Spigot 插件开发教程索引（中文社区，外链）

> **本页补哪个缺口**：本仓的服务端面（见 [`doc/server-face-paper.md`](../../doc/server-face-paper.md)）只有**签名面**——`data/spigot_<ver>/spigot-javadoc/`（GPL-3.0 构件的 javap 派生）与 `data/paper-api_<ver>/paper-javadoc/`，两个签名面的 processed 页**只有签名、没有描述散文**。所以「该怎么用」在本仓没有语料出处。本页把中文社区那份教程生态按**指针**收进来，位置与本仓既有的 `links/` 一致：只有标题 / 摘要 / 外链，**不含正文**。
>
> 顺带说明为什么本仓没有 Spigot 教程语料：SpigotMC Wiki 实测无任何开放许可（页脚仅 `© 2012-2026 SpigotMC Pty. Ltd.`），按本仓准入只能走 `links/`。依据见 [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)「SpigotMC Wiki 不可入库」一条。

## 状态约定

本页条目的状态只有两种取值：

- **✅ 可用** —— 默认。包括两种「脚本读不到但人打开没问题」的情况：① 反爬主机对脚本返回 403（如 `spigotmc.org`、`minecraftforum.net`、`zhihu`）；② 本机网络/DNS 环境导致的超时（如被污染的解析）。这两类**不是失效**。
- **❌ 已失效** —— 仅限实测到 **404 / 410 / NXDOMAIN** 三条硬失效之一，逐条列在文末《已失效条目》。

## 官方与 API 文档（含中文镜像）

| 资源 | 链接 | 状态 |
|------|------|------|
| SpigotMC 官方 wiki（现版本教程入口） | https://www.spigotmc.org/wiki/spigot/ | ✅ 可用 |
| Bukkit API 中文 javadoc（windit 镜像） | https://bukkit.windit.net/javadoc/ | ✅ 可用 |
| Spigot API 英文 javadoc | https://hub.spigotmc.org/javadocs/spigot/ | ✅ 可用 |
| Paper 官方文档 | https://docs.papermc.io/ | ✅ 可用 |
| Paper API javadoc（按版本） | https://jd.papermc.io/paper/1.21.8/ | ✅ 可用 |

本地对应：查**签名**走 `search_docs platform=paper|paper-api|spigot`（三面许可与口径不同，见 `doc/server-face-paper.md`）；本页只解决「教程去哪看」。

## 中文社区专题长文

| 主题 | 链接 |
|------|------|
| Paper API 自定义生物 AI 系统（作者博客，原 `my.minecraft.kim` 已迁 `blog.hikarilan.life`） | https://blog.hikarilan.life/tech/393/ |
| Bukkit NMS 开发实践：造自己的自定义实体（同上，已迁移） | https://blog.hikarilan.life/tech/260/ |
| Bukkit 编程杂谈：雷点 / 模板 / 思路 / 设计 | https://icebear003.github.io/noticements-in-bukkit/ |
| 如何问玩家「吾与徐公孰美？」（聊天组件与异步交互） | https://izzel.io/2020/02/12/chat-with-future/ |
| Forge/LiteLoader 与 Bukkit/Sponge 之间的通信（插件消息通道） | https://izzel.io/2017/08/28/minecraft-plugin-message/ |
| Minecraft 服务端开发指北（服务端工程化总览） | https://izzel.io/2021/11/13/how-to-minecraft-server/ |

## 经 MCBBS 存档站可读的专题帖

`archives.mcbbs.co` 是 MCBBS 关站后的存档站，**脚本探测结果不能当死链结论**（它会对同一 URL 在趟与趟之间漂移 200/5xx）。下列条目 2026-10-31 探测为 200，但**内容时效未逐篇核实**，引用前用浏览器打开确认：

- 正确使用 `PluginManager#registerEvent` 的方式 — https://archives.mcbbs.co/read.php?tid=1472122
- 用 PersistentDataContainer 添加自定义数据 — https://archives.mcbbs.co/read.php?tid=1248632
- 关于 ProtocolLib 监听系统的使用与研究 — https://archives.mcbbs.co/read.php?tid=1248152
- 玩转 ProtocolLib 数据包发包 — https://archives.mcbbs.co/read.php?tid=1123486
- 使用 NMS 的同时支持多个版本 — https://archives.mcbbs.co/read.php?tid=694224
- wyt 的 Bukkit 插件开发教程 — https://archives.mcbbs.co/read.php?tid=614388
- Day's Bukkit 插件开发教程 — https://archives.mcbbs.co/read.php?tid=439856

## 其他可用条目

- 旧版 Bukkit 官方教程（`wiki.bukkit.org` 已重定向到 Fandom 存档）：http://wiki.bukkit.org/Plugin_Tutorial ✅ 可用

## 已失效条目（本仓不再推荐）

**判据**：2026-10-31 实测 **404 / 410 / NXDOMAIN** 三条硬失效之一。风控型主机的 **403** 与网络超时 **不计入失效**（见上文状态约定），这类一律按可用处理。

| 原条目 | 链接 | 读数 |
|--------|------|------|
| 事件监听大典（Bukkit API 中文翻译） | https://william-shi233.gitbook.io/event-listeners/ | 404 |
| 信息的处理与呈现相关应用编程 | https://hamsteryds.gitee.io/info-processing-in-bukkit/ | 404 |
| 生物运动&空间坐标的理论探索与应用编程 | https://hamsteryds.gitee.io/kinematics-of-minecraft/ | 404 |
| 图形学基础与 MC 插件开发（范围挖掘算法） | https://www.iseason.top/mc-scope-mining/ | NXDOMAIN |

## 用法

- 写插件代码前，先根 `AGENTS.md` 第一步确认是**服务端面**（Paper/Spigot）而不是模组平台；服务端面走 `paper/<ver>/rules/` + `search_docs platform=paper`，**不套**模组 00–10。
- 本页的社区长文是**讲解**，不是 API 规范：类名 / 方法签名一律回签名面或 `jd.papermc.io` 核对，对不上就留 `// TODO(未核实)`。
- 存档站条目**不保证时效**（多为 1.8–1.16 时代），用前先看帖内版本标注。
