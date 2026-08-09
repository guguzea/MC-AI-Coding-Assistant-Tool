---
id: authored/patterns-framework
title: 代码模式库怎么用（knowledge/patterns）
tags: [patterns, engineering, structure, skills, antipatterns, forge]
summary: 模式库 vs code-patterns vs 反模式；单文件结构；何时新增示范；MCP Resource mcskill://patterns/README。
mcHint: 1.20.1+（示例偏 Forge）
sourceKind: authored
---

# 代码模式库怎么用（`knowledge/patterns`）

自写短文。具体 API / 方法名以官方文档与 `query_api` 为准；模式片段仅作骨架。

## 三层知识别混用

| 层 | 路径 | 回答的问题 |
|----|------|------------|
| **模式库** | 仓库根 `knowledge/patterns/examples/*.md` | 「最小可抄的一小段」长什么样？ |
| **平台 code-patterns** | 如 `forge/1.20.1/code-patterns/` | 某系统（方块/物品/网络）有哪些完整写法？ |
| **反模式** | `knowledge/antipatterns/`、各平台 `09-anti-patterns.mdc` | 错了会怎样、应怎么改？ |

Agent 流程建议：**先反模式排除坑 → 再模式库拿最小片段 → 不够再打开 code-patterns / 规则 Decision Flow**。

## 模式文件约定

每个示范单独一个文件，放在 `knowledge/patterns/examples/`，建议 **<80 行**，含：

1. 首行元数据：`平台：… · 依赖：mc-xxx Skill 或规则编号`  
2. 一段最小代码或 JSON（可编译/可粘贴）  
3. 一行「常见坑」链到 `knowledge/antipatterns/` 或社区短文 id  

索引：`knowledge/patterns/README.md`。MCP Resource：`mcskill://patterns/README`（`read_knowledge_resource`）。

## 何时往模式库加新文件

适合：

- 同一套路在多个 Skill 里重复出现（注册+物品、SimpleChannel 单包、cube_all 三元组）  
- 需要给生成器（`generate_*`）对齐的「金样」  

不适合：

- 整台机器/GUI 全链路 → 用 `authored/machine-be-gui-working` 等社区短文  
- 第三方库 API 大全 → 用 `authored/library-integration*` + 官方/库文档  

新增后：**更新 README 示范表**，必要时在相关 Skill 的「快速入口」加一行链接。

## 当前示范（维护时与 README 同步）

| 文件 | 用途 |
|------|------|
| `deferred-block-item.md` | DeferredRegister 方块 + BlockItem |
| `simple-channel-packet.md` | SimpleChannel 注册一条 C2S |
| `cube-all-resources.md` | blockstate + block/item 模型 |
| `container-data-sync.md` | Menu 侧 ContainerData 进度同步 |
| `modlist-compat-gate.md` | 软依赖探测后再进兼容类 |

## 自检

- 模式是否能在不读整篇教程的情况下单独理解？  
- 是否标明平台/版本？  
- 坑是否指向已有反模式或社区短文，而不是重复写一篇？  

## 不清楚时

- 注册：`authored/register-helpers`、`01-registry.mdc`  
- 网络细节：`06-networking.mdc`、`search_forge_docs`（SimpleChannel）  
- 社区工具规则：`community_knowledge/AGENT_USAGE.md`
