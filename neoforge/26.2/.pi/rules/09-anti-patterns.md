---
description: 09 — 反模式（NeoForge 26.2）
---

# 09 — 反模式（NeoForge 26.2）

> 本档 01–10 的证据是**官方 MDK + NeoForge 26.2.0.93 sources jar**，不是 docs 正文（上游 `/docs/26.2/` 404）。

- ❌ **把 26.1 的 01–10 当 26.2**：26.1 主文档写的是 26.1 的 API；26.2 只核到 MDK/sources 的部分，未核处已在各条标出。
- ❌ Forge 的 `META-INF/mods.toml` + `net.minecraftforge.*`：NeoForge 用 **`META-INF/neoforge.mods.toml`**。
- ❌ `ResourceLocation`：26.x mojmap 是 **`Identifier`**（`DeferredRegister.register(String, Function<Identifier, …>)`、`Config.java` 的 `Identifier.parse(...)` 都是实证）。
- ❌ 直接调 `GlDevice` / `VulkanDevice` 这类后端类：**26.2 起**已有可选 Vulkan 后端（`com.mojang.blaze3d.vulkan.*`），mod 只写 Blaze3D 通用层（`blaze3d.opengl` 与 `blaze3d.vulkan` 是功能平行的两套实现）。
- ❌ 把 `@SubscribeEvent` 挂错总线：注册/配置/生命周期走 **mod 总线**（构造器参数 `IEventBus`），世界/玩家/服务器事件走 **`NeoForge.EVENT_BUS`**。
- ❌ 把 Fabric 的 API 当 NeoForge：`FabricDataGenerator` / `PayloadTypeRegistry` / `FabricDefaultAttributeRegistry` 都是 Fabric 侧；NeoForge 对应物是 `GatherDataEvent` / `PayloadRegistrar` / `EntityAttributeCreationEvent`。
- ❌ 抄 26.3 的 datagen 写法：26.3 的 `GatherDataEvent` 是 135 行的瘦事件类（`getWorldLookupProvider()` / `getPackGenerator()`），**26.2 是 285 行的旧结构**（`DataGeneratorConfig` + `addProvider` / `createProvider`）—— 两版不可互抄，见本档 07。
- ❌ 抄 `DeferredRegister.java` 里 **javadoc 示例**的旧写法：`Block.Properties.create(Material.ROCK)` 是注释里的历史示例，MDK 实际用 `registerSimpleBlock("example_block", p -> p.mapColor(MapColor.STONE))`。
- ❌ 引用「官方 26.2 文档页」：不存在。要引只能引 MDK 行号 / sources jar 类路径 / primer 章节。

## 与 26.3 的差异（对拍结论，2026-10-31）

| 项 | 26.2 | 26.3 |
|---|---|---|
| MDK `ExampleMod.java` | `ModConfig.Type.COMMON`（L88） | `ModConfig.Type.LOCAL`（L88） |
| `DeferredRegister.java` | 847 行 | 866 行（差异**全在 javadoc**，API 一致） |
| `PayloadRegistrar.java` | 234 行 | 234 行（**逐字节一致**） |
| `GatherDataEvent.java` | **285 行**（`getLookupProvider()` + `DataGeneratorConfig`） | **135 行**（`getWorldLookupProvider()` / `getReloadableLookupProvider()` / `getPackGenerator`） |
| datagen provider 入口 | `event.getGenerator().getVanillaPack(...)` → `PackGenerator.addProvider(Factory)` | `event.addProvider(实例)` / `createProvider(builder)` / `createBlockAndItemTags(...)` |
| `Screen` 渲染回调 | `extractRenderState(GuiGraphicsExtractor, int, int, float)` | **同左**（两版一致；26.x 都没有 `render(GuiGraphics,…)`） |
| `EntityAttributeCreationEvent` / `RegisterPayloadHandlersEvent` | 都是 `implements IModBusEvent` | **同左**（都挂 mod 总线） |
| GLFW → SDL | **未发生**（SDL 是 26.2→26.3 的改动） | 已发生，`InputConstants` 常量值变了 |

## Decision Flow

```
→ 看到「26.2 官方文档说…」 → 停，26.2 没有 docs 正文
→ 看到 ResourceLocation / mods.toml / net.minecraftforge → 换成 Identifier / neoforge.mods.toml / net.neoforged
→ 看到 GlDevice / VulkanDevice → 退回 Blaze3D 通用层
→ 看到 getWorldLookupProvider / getPackGenerator → 那是 26.3 的，26.2 用 DataGeneratorConfig
→ 签名不确定 → 打开 neoforge-26.2.0.93-sources.jar 对应类，或 javap
```
