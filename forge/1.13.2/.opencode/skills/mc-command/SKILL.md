---
name: mc-command
description: Commands.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-command（1.13.2）

> 一手来源：本档 docs 语料 `data/forge_1.13.2/forge-docs/1.13.2/processed/conventions_loadstages.md`（加载阶段清单明列「FMLServerStartingEvent: Register Commands」）。

## Decision Flow

```
→ 服务端命令注册 → 1.13.2 语料口径：FMLServerStartingEvent
→ 命令写法 → 1.13 起原版命令体系重建（本仓 1.13.2 语料无专页；1.14.4 语料明写改用 Mojang 独立库 Brigadier——1.13.2 的库内用法细节以本档语料/原版为准，不要照抄 1.14+ 工程代码）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 注册时机：**FMLServerStartingEvent**（语料 loadstages 页原文，与 1.12.2 相同）。
- 1.13 起原版命令开始改用声明式语法；本仓 1.13.2 档语料没有命令专页，**Brigadier 成员名/参数不进本技能**——要用时先 `get_doc_full` 或反编译核实。

## 反模式

- 把 1.16+ 的 `RegisterCommandsEvent` 写进 1.13.2 工程（本仓一手证据只到 1.16.5 primer 明文）。
- 凭记忆写 Brigadier 调用链（本档无核实来源，空写不如不写）。

## 下一步

- 语料全文：`get_doc_full`（id 见本档语料 processed 目录）；反模式库：`forge/1.13.2/knowledge/antipatterns/`。
