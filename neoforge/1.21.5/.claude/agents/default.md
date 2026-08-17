# NeoForge 1.21.5 — Agent 总纲

> 只适用于 **NeoForge 1.21.5**。禁止读取邻档 00–10 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 文档工具用 `list_neoforge_versions` / `search_neoforge_docs`（version=1.21.5）。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.21.5 |
| Java | **21** |
| Mappings | mojmap |
| 入口 | `@Mod` + `public ExampleMod(IEventBus modEventBus)` |
| 元数据 | neoforge.mods.toml |
| 资源 id | `ResourceLocation` |
| 网络 | RegisterPayloadHandlersEvent + PayloadRegistrar（以 networking 页为准） |
| 文档 | https://docs.neoforged.net/docs/1.21.5/ |

类名必须能在 `knowledge/common/verified-api-1.21.5.md` 或 `search_neoforge_docs` 该版页面找到。

pack-status: ready
