# NeoForge — AI Coding Assistant

本目录**不再**自称单一 1.20.4 规则集。`CLAUDE.md` 与 [`AGENTS.md`](AGENTS.md) 同口径：先锁版本再进 `neoforge/<ver>`。

```
Decision:
→ list_neoforge_versions + 工程 neo_version / minecraft_version
→ IF 版本 ∈ 1.20.4 | 1.21.1 | 1.21.3 | 1.21.8 | 1.21.11 | 26.1 → 只读 neoforge/<ver>/AGENTS.md 与该档 00–10
→ ELSE IF 版本 ∈ 1.20.1 | 1.20.6 | 1.21.5 | 1.21.10 → 禁止读邻档 00–10，改口 search_neoforge_docs（1.20.1 有 Forge 兼容数据）
→ ELSE → 询问用户。禁止默默读扁平 .cursor/rules
```

文档工具是 `list_neoforge_versions` / `search_neoforge_docs`，不是 `list_forge_versions`。

26.1 与 1.21.1 是两档。官方 `/docs/26.2/` 未发布前不要建克隆树。不为 26.1.1 单造规则树。

## 禁止（写进本文件即错）

- 把 NeoForge 网络写成 `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- `NeoForgeAddonPlugin`、`BuildPlugin + init()` 当 Neo 入口
- 邻档 00–10 顶上未建档版本
- 官方 MDK 404 / 无 pin 时用邻版 MDK 顶上（必须返回 `MDK_NOT_PINNED`，禁止邻版）

## 网络口径（按档）

- 1.20.4：`RegisterPayloadHandlerEvent`（单数）+ `IPayloadRegistrar`
- 1.21.1+：`RegisterPayloadHandlersEvent` + `PayloadRegistrar`
- 26.1：`Identifier` + `RegisterPayloadHandlersEvent`（不要 `new ResourceLocation`）
- Forge 1.20.1 才是 SimpleChannel

## 入口

以该档官方 MDK 为准：`@Mod` + 构造函数注入 `IEventBus`（可再加 `ModContainer`）。不是 `BuildPlugin + init()`。

工作流：完整流程才 `get_workflow_template`；改已有代码不要调。从零工程：`download_official_mdk`（26.1.x/26.2 须传 `buildPlugin`）。
