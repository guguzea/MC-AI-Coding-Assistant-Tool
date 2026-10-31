# Fabric 26.2 已核实 API

来源（五条可核，逐行标注）：

1. **docs**：`data/fabric_26.2/fabric-docs/26.2/processed/*.md`（105 页，pin commit `238533d819fcb5ec9405acb58fb0ac7655df63b1`）。检索入口 `search_fabric_docs`，`version=26.2`。
2. **loader-api**：`mcp-server/data/loader-api-summaries/26.2-fabric-api.json`（**1636 类**，`source=official`，`mapping=mojmap`，`version=26.2`）。生成方式：fabric-api `0.161.0+26.2` 聚合 jar 的 **44 个模块 jar** 合并 → VineFlower 反编译 → 抽签名（`decompile.javaFileCount=1490`）。
3. **javap（本机 26.2 jar）**：`F:\MOD_TEST\caches\fabric-loom\26.2\minecraft-merged.jar`（35.7 MB，去混淆 Mojang 名），JDK 25 `javap -p` / `javap -c -p`。**不入库、换机需重跑 loom**；标 `javap` 的行都由它取证。
4. **编译实测**：`F:\MOD_TEST\fabric262-probe`（Java 25 / Gradle 9.8.1 / Loom 1.18.2 / loader 0.20.1 / fabric-api 0.161.0+26.2），2026-10-31 `BUILD SUCCESSFUL`（含 `RuleProbe` / `DataGenProbe` / `ScreenProbe`）。
5. **上游迁移文档**：NeoForge Primer 26.2（`get_migration_guide route=26.1->26.2`，本仓 `neoforge_primers` 语料）+ 社区 Blaze3D 指南（见表 F）。

两条 provenance 限制：

- docs 示例代码是 `<<< @/reference/latest/src/…` 的 **include 引用**，目标在 `data/fabric_26.2/reference/latest/`（443 文本件 / 1490 个 `.java`）⇒「某类名正文零命中」≠「本版没有该类」。
- loader-api 摘要**只有 methods**：没有构造器、字段、常量。⇒ 构造器与字段（`FuelValueEvents.BUILD`、`CompostableRegistry.INSTANCE`、`Minecraft.gui`）一律用 docs / javap / 编译实测。

## 表 A — 本档规则 / Skill 实际教学的名称与可核来源

| 名称 | 可核来源 | docs 页 |
|------|----------|---------|
| `Event` | `net.fabricmc.fabric.api.event.Event` | `26.2/develop_events_index` |
| `AttackBlockCallback` | `…api.event.player.AttackBlockCallback` | `26.2/develop_events_index` |
| `UseBlockCallback` / `UseItemCallback` | `…api.event.player.UseBlockCallback` / `UseItemCallback` | docs 零命中（include 内） |
| `PlayerBlockBreakEvents` | `…api.event.player.PlayerBlockBreakEvents` | Skill 侧 |
| `ClientTickEvents` | `…api.client.event.lifecycle.v1.ClientTickEvents` | `26.2/develop_events_index`、`develop_key-mappings` |
| `ServerTickEvents` / `ServerLifecycleEvents` | `…api.event.lifecycle.v1.*` | Skill 侧 / docs 零命中 |
| `ServerLivingEntityEvents` | `…api.entity.event.v1.ServerLivingEntityEvents` | docs 零命中（include 内） |
| `LootTableEvents` / `LootTableSource` | `…api.loot.v3.*` | `26.2/develop_events_loot-tables` |
| `CreativeModeTabEvents` | `…api.creativetab.v1.CreativeModeTabEvents` | `26.2/develop_items_first-item` |
| `CompostableRegistry` | `…api.registry.CompostableRegistry`（`INSTANCE` 字段不在摘要） | `26.2/develop_items_custom-compostable:20` |
| `FuelValueEvents` | `…api.registry.FuelValueEvents`（`BUILD` 字段不在摘要） | `26.2/develop_items_custom-fuel:20` |
| `KeyMappingHelper` | `…api.client.keymapping.v1.KeyMappingHelper` | `26.2/develop_key-mappings` |
| `PayloadTypeRegistry` / `ServerPlayNetworking` | `…api.networking.v1.*` | `26.2/develop_networking:91,96,100` |
| `ClientPlayNetworking` / `PlayerLookup` | `…api.client.networking.v1.ClientPlayNetworking` / `…api.networking.v1.PlayerLookup` | `26.2/develop_networking:140,193` |
| `CommandRegistrationCallback` / `ClientCommandRegistrationCallback` / `ClientCommands` | `…api.command.v2.*` / `…api.client.command.v2.*` | `26.2/develop_commands_basics` |
| `DataGeneratorEntrypoint` / `FabricDataGenerator` / `FabricPackOutput` | `…api.datagen.v1.*` | `26.2/develop_data-generation_setup` 等 9 页 |
| `FabricRecipeProvider` / `FabricTagsProvider` / `FabricLanguageProvider` / `FabricAdvancementProvider` | `…api.datagen.v1.provider.*` | 对应 datagen 各页 |
| `FabricBlockLootSubProvider` | **双包**：`…datagen.v1.provider.…`（有构造器 + `generate`）／`…datagen.v1.loot.…`（只有 `withConditions`） | `26.2/develop_data-generation_loot-tables:37,65` |
| `FabricBlockEntityTypeBuilder` | `…api.object.builder.v1.block.entity.…` | `26.2/develop_blocks_block-entities` |
| `FabricDefaultAttributeRegistry` | `…api.object.builder.v1.entity.…` | `26.2/develop_entities_attributes` |
| `EntityRendererRegistry` / `HudElementRegistry` | `…api.client.rendering.v1.*` | `26.2/develop_entities_projectiles` / `develop_rendering_hud` |
| `BiomeModifications` / `BiomeSelectors` | `…api.biome.v1.*` | `26.2/develop_data-generation_features` |
| `DynamicRegistries` | `…api.event.registry.DynamicRegistries` | `26.2/develop_registries_dynamic-registry:49` |
| `AttachmentRegistry` / `…Builder` / `AttachmentSyncPredicate` / `AttachmentType` / `AttachmentTarget` / `GlobalAttachments(Provider)` | `…api.attachment.v1.*` | `26.2/develop_serialization_data-attachments` |
| `Identifier` | 不在 fabric-api 摘要（vanilla）；`reference/latest` 源码命中 | `26.2/develop_items_first-item` 等 |
| `BlockEvents` / `ItemEvents` | `…api.event.player.BlockEvents` / `ItemEvents` — **存在但 methods 为空，不是注册入口** | 摘要实测 |
| `BlockIds` / `BlockItemIds` / `ItemIds` | **`net.minecraft.references.BlockIds` / `.BlockItemIds` / `.ItemIds`**（javap：全是 `public static final ResourceKey<…>` 常量类） | `26.2/develop_items_first-item:29`、`develop_blocks_first-block:36,51` |
| `Gui` | **`net.minecraft.client.gui.Gui`**（javap：`public Screen screen()` / `public void setScreen(Screen)`） | `26.2/develop_rendering_gui_custom-screens:43` |
| `Minecraft.gui` | **`public final Gui gui`**（javap）；`Minecraft` 上**没有** `setScreen` / `getMainRenderTarget` | 同上 + javap |
| `Screenshot` | **`net.minecraft.client.Screenshot`**（javap：`grab(Minecraft, boolean)` + 2 个旧重载） | javap |
| `MouseButtonEvent` | `net.minecraft.client.input.MouseButtonEvent`（javap：`GuiEventListener.mouseClicked(MouseButtonEvent, boolean)` default；`AbstractWidget` override 同签名） | javap |
| Vulkan 后端（**只作背景知识**） | `com.mojang.blaze3d.vulkan.*`（`jar tf` 40 个顶层类）；与 `blaze3d.opengl` **功能平行**（见表 F2） | `26.2/develop_rendering_basic-concepts:15`（只说必须走 Blaze3D） |

## 表 B — 已核实签名（摘要原文 + javap，未改一字）

| 类 | 签名 | 来源 |
|---|---|---|
| `AttachmentRegistry` | `AttachmentType<A> create(Identifier, Consumer<AttachmentRegistry.Builder<A>>)` / `create(Identifier)` / `createDefaulted(Identifier, Supplier<A>)` / `createPersistent(Identifier, Codec<A>)` / `Builder<A> builder()` | 摘要 |
| `AttachmentTarget` | 12 个方法：`getAttached` / `getAttachedOrThrow` / `getAttachedOrSet` / `getAttachedOrCreate(×2)` / `getAttachedOrElse` / `getAttachedOrGet` / `setAttached` / `hasAttached` / `removeAttached` / `onAttachedSet` / `modifyAttached` | 摘要（12/12） |
| `DynamicRegistries` | `void register(ResourceKey<? extends Registry<T>>, Codec<T>)` / `void registerSynced(ResourceKey<? extends Registry<T>>, Codec<T>, SyncOption...)` | 摘要 |
| `PayloadTypeRegistry` | `PayloadTypeRegistry<RegistryFriendlyByteBuf> serverboundPlay()` / `clientboundPlay()`；`TypeAndCodec<? super B, T> register(Type<T>, StreamCodec<? super B, T>)` | 摘要 |
| `FabricLanguageProvider` | `(FabricPackOutput, String, CompletableFuture<Provider>)` + 双参重载；`void generateTranslations(Provider, TranslationBuilder)` | 摘要 + 编译 |
| `FabricBlockLootSubProvider`（provider 包） | `(FabricPackOutput, CompletableFuture<Provider>)` / `void generate()` | 摘要 + 编译 |
| `KeyMappingHelper` | `KeyMapping registerKeyMapping(KeyMapping)` / `Key getBoundKeyOf(KeyMapping)` | 摘要 |
| `CreativeModeTabEvents` | `Event<ModifyOutput> modifyOutputEvent(ResourceKey<CreativeModeTab>)` | 摘要 |
| `FabricDefaultAttributeRegistry` | `void register(EntityType<? extends LivingEntity>, AttributeSupplier)` | 摘要 |
| `Gui` | `public Screen screen()` / `public void setScreen(Screen)` | **javap** |
| `Minecraft` | `public static Minecraft getInstance()` / `public final Gui gui` / `public void setScreenAndShow(Screen)`；**无** `setScreen` / `getMainRenderTarget` | **javap** |
| `Minecraft.setScreenAndShow(Screen)` | 字节码：`gui.setScreen(screen)` + `renderFrame(false)`（`Profiler.zone("forcedTick")` 包裹） | **javap -c -p** |
| `Screenshot` | `public static void grab(Minecraft, boolean)`；另有 `grab(File, RenderTarget, Consumer<Component>)` 与 `grab(File, String, RenderTarget, int, Consumer<Component>)` | **javap** |
| `GuiEventListener` | `public default boolean mouseClicked(MouseButtonEvent, boolean)` | **javap** |
| `net.minecraft.references.ItemIds` | `public static final ResourceKey<Item> SADDLE / MINECART / …`（常量类） | **javap** |

## 表 C — 26.1.2 → 26.2 的迁移

| 26.1.2 写法 | 26.2 写法 | 依据 |
|---|---|---|
| `Minecraft.getInstance().setScreen(...)` | `Minecraft.getInstance().gui.setScreen(...)`；要「切屏后立刻刷一帧」用 `setScreenAndShow(...)`（见 F1） | `26.2/develop_rendering_gui_custom-screens:43` + javap |
| `Minecraft.getInstance().currentScreen` | `Minecraft.getInstance().gui.screen()` | **javap**（`Gui.screen()`） |
| `Minecraft.getMainRenderTarget()` | `Screenshot.grab(Minecraft, boolean)` | **javap** |
| `mouseClicked(double, double, int)` | `mouseClicked(MouseButtonEvent, boolean)` | **javap** |
| 单一 id 类 | `net.minecraft.references.ItemIds` / `BlockIds` / `BlockItemIds` 三分 | **javap** + `26.2/develop_blocks_first-block:30,45` |
| 事件单页 `develop_events` | `develop_events_index` + `develop_events_loot-tables` | 26.2 目录结构 |
| 无弹射物页 | `develop_entities_projectiles` | 26.2 新增 |
| 无 compostable/fuel/shields 页 | `custom-compostable` / `custom-fuel` / `custom-shields` | 26.2 新增 |
| — | 有可选 Vulkan 后端（`com.mojang.blaze3d.vulkan.*`），**options 菜单里切换**；raw OpenGL 不受支持 | Primer 26.2 + `basic-concepts:15` + `jar tf` |

## 表 D — 编译实测（2026-10-31）

`F:\MOD_TEST\fabric262-probe` → `BUILD SUCCESSFUL`，三个探针：

1. `RuleProbe`：`ClientTickEvents.END_CLIENT_TICK` / `ServerTickEvents.END_SERVER_TICK` / `AttackBlockCallback` / `UseBlockCallback` / `UseItemCallback` / `PlayerBlockBreakEvents.BEFORE` / `ServerLivingEntityEvents.AFTER_DEATH, ALLOW_DAMAGE` / `ServerLifecycleEvents.SERVER_STARTED, SERVER_STOPPING`。
2. `DataGenProbe`：`DataGeneratorEntrypoint` + `createPack()` + `addProvider` + `FabricLanguageProvider`（三参 `super`）+ `provider` 包 `FabricBlockLootSubProvider`（双参 `super` + `dropSelf`）。
3. `ScreenProbe`：`mc.gui.setScreen(makeScreen())` / `mc.gui.screen()` / `Minecraft.getInstance().setScreenAndShow(makeScreen())` 三条调用同工程编译通过。

反例（第一次编译失败，已写进规则 07）：extends `…datagen.v1.**loot**.FabricBlockLootSubProvider` ⇒ `构造器不适用` + `找不到符号 dropSelf`。

`F:\MOD_TEST\fabric262-scaffold` 用本档自带 `gradlew.bat build --offline` → `BUILD SUCCESSFUL in 34s`。

## 表 E — 仍未核实

**0 条。**

上一版列的 6 条已全部清账：`net.minecraft.references.{BlockIds,BlockItemIds,ItemIds}`（javap）、`Gui.screen()/setScreen()`（javap）、`Screenshot.grab(Minecraft, boolean)`（javap）、`mouseClicked(MouseButtonEvent, boolean)`（javap）、`AttachmentTarget` 12 个方法（摘要 12/12）、Vulkan 包存在性（`jar tf` 40 类）。两条「用法」问题见下表 F。

`26.2.1` / `26.2.x`：Fabric Meta 的 stable 列表只有 `26.2`，**不存在补丁档**（2026-10-30 实测 `meta.fabricmc.net/v2/versions/game`）。

## 表 F — 两个用法问题的最终结论

### F1. 开屏：`gui.setScreen` 与 `setScreenAndShow` 是封装关系，不是替代关系

`javap -c -p` 读出的 `Minecraft.setScreenAndShow` 实现：

```java
public void setScreenAndShow(Screen screen) {
    try (Profiler.Scope z = Profiler.get().zone("forcedTick")) {
        this.gui.setScreen(screen);   // 内部就是语料那条
        this.renderFrame(false);      // 额外：强制立刻渲染一帧
    }
}
```

⇒ 用法判据：

| 场景 | 用哪个 |
|---|---|
| 普通开屏（语料 `custom-screens:43` 的标准写法） | `Minecraft.getInstance().gui.setScreen(screen)` |
| 切屏后必须**马上看到画面**（加载屏、阻塞式界面） | `Minecraft.getInstance().setScreenAndShow(screen)` |

社区互证：`JuzipiAN/modern-damage-system` 的 `PROJECT_CONTEXT.md` 把 26.2 的 `Minecraft.setScreen` → `setScreenAndShow(Screen)` 记为「public，不需要反射」，并把调用收敛进 `MdsClientScreens.showScreen()`（GitHub，2026-10 时点）。

编译证据：`ScreenProbe` 两条路径都编过（`BUILD SUCCESSFUL`）。

### F2. Vulkan：由玩家在 options 里切，mod 只写 Blaze3D 通用层

NeoForge Primer 26.2「Vulkan」章原文：

> "Vanilla has added support for the Vulkan graphics API, which can be set in the options menu. As such, for all classes in `com.mojang.blaze3d.opengl`, there is generally a parallel found in `com.mojang.blaze3d.vulkan`. With this change, more of the Blaze3d components has been generalized further."

本机 `jar tf` 实测：`blaze3d.opengl` 28 类 / `blaze3d.vulkan` 40 类，**同名只有 `package-info`** —— 「parallel」是**功能平行**，不是同名：

| opengl | vulkan |
|---|---|
| `GlBackend` | `VulkanBackend` |
| `GlDevice` | `VulkanDevice` |
| `GlBuffer` | `VulkanGpuBuffer` |
| `GlCommandEncoder` | `VulkanCommandEncoder` |
| `GlRenderPass` / `GlRenderPipeline` | `VulkanRenderPass` / `VulkanRenderPipeline` |
| `GlTexture` / `GlTextureView` / `GlSampler` / `GlSurface` | `VulkanGpuTexture` / `VulkanGpuTextureView` / `VulkanGpuSampler` / `VulkanGpuSurface` |
| `GlQueryPool` / `GlTransientMemory` / `GlDebug` / `GlConst` / `GlUtil` | `VulkanQueryPool` / `VulkanTransientMemory` / `VulkanDebug` / `VulkanConst` / `VulkanUtils` |

社区（`Argon4W/LearnBlaze3D`）：

> "Mojang 在公布使用 Vulkan 后提出'尽可能使用 Blaze3D 进行渲染'的解决方案…这允许 Modders 使用同一套渲染代码同时驱动 OpenGL 与 Vulkan 渲染"

⇒ 结论：**后端由 options 菜单切换，mod 只写通用层**（`blaze3d.buffers` / `blaze3d.pipeline` / `blaze3d.textures` / `blaze3d.shaders`），禁止直接调 `VulkanDevice` / `GlDevice` 这类后端类。另有两个社区实验性 Vulkan 后端 mod（`EternityQwQ/LavaFlow-Fabric`、ArtVK）作旁证 —— 它们是**替换后端**的 mod，不是让你在业务代码里调 Vulkan 的教程。
