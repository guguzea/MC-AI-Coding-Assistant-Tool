# Fabric 26.1.2 已核实 API

来源：`search_fabric_docs version=26.1.2` + `query_loader_api platform=fabric minecraftVersion=26.1.2`。禁止把 1.21.11 wiki / knowledge 当本档。

三条可核来源，逐行标注：

1. **docs**：`data/fabric_26.1.2/fabric-docs/26.1.2/processed/*.md`（检索入口 `search_fabric_docs`，`version=26.1.2`）。
2. **loader-api**：`mcp-server/data/loader-api-summaries/26.1.2-fabric-api.json`（1565 类，Mojmap 名，`source=official`，非 overlay；检索入口 `query_loader_api(platform=fabric, minecraftVersion=26.1.2, className=…)`）。
3. **jar**：本机 `minecraft-26.1-client.jar`（去混淆 Mojang 名）类名 / `javap` 方法签名。**这条源不入库、不可复现**，只在表 D 用于钉死签名；换机后须重跑 `get_minecraft_source` / `decompile_mod_jar` 才能复现。

两条 provenance 限制（读表前必须知道）：

- docs 页里的示例代码是 `<<< @/reference/26.1.2/src/…` 的 **include 引用**，仓库内 **没有** `reference/` 目录，也没有 `.java` 文件。所以「某类名在本档 docs 零命中」 **不等于**「该 API 不存在」，只等于「该页正文与 include 路径里没写出这个名字」。
- loader-api 摘要 **只有 methods**（`fqcn / simpleName / pkg / modifiers / apiStatusInternal / environment / methods / file`），**没有** 构造器、字段、常量，`modifiers` 也不区分 class / interface / enum。所以「构造器参数表」「某类型是不是接口」这两类问题本表一律标 **未核实**，禁止按邻版补全。

核不到的类名写成「以该版文档为准，禁止默写」。禁止克隆 `fabric/1.21.11/knowledge`。

## 表 A — 本档规则 / Skill 实际教学的名称与其可核来源

| 名称 | 可核来源 | 备注 |
|------|----------|------|
| `ModInitializer` | Fabric **Loader** 类（本档无 loader jar 摘要，摘要内 `net.fabricmc.api.*` 0 条）；FQCN 未核实 | docs `26.1.2/develop_loader_fabric-mod-json` 等 4 页 |
| `ClientModInitializer` | Fabric **Loader** 类（同上）；FQCN 未核实 | docs `26.1.2/develop_loader_fabric-mod-json` 等 6 页 |
| `DataGeneratorEntrypoint` | loader-api `net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint` | docs `26.1.2/develop_data-generation_recipes` 等 9 页 |
| `Event` | loader-api `net.fabricmc.fabric.api.event.Event` | docs `26.1.2/develop_events` 等 3 页 |
| `AttackBlockCallback` | loader-api `net.fabricmc.fabric.api.event.player.AttackBlockCallback` | docs `26.1.2/develop_events` |
| `UseBlockCallback` | loader-api `net.fabricmc.fabric.api.event.player.UseBlockCallback` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `UseItemCallback` | loader-api `net.fabricmc.fabric.api.event.player.UseItemCallback` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `ClientTickEvents` | loader-api `net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents` | docs `26.1.2/develop_events` 等 2 页 |
| `ServerTickEvents` | loader-api `net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents` | docs `26.1.2/develop_porting_fabric-api` |
| `ServerLifecycleEvents` | loader-api `net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `ServerLivingEntityEvents` | loader-api `net.fabricmc.fabric.api.entity.event.v1.ServerLivingEntityEvents` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `LootTableEvents` | loader-api `net.fabricmc.fabric.api.loot.v3.LootTableEvents` | docs `26.1.2/develop_events` |
| `CreativeModeTabEvents` | loader-api `net.fabricmc.fabric.api.creativetab.v1.CreativeModeTabEvents` | docs `26.1.2/develop_items_first-item` 等 2 页 |
| `FuelValueEvents` | loader-api `net.fabricmc.fabric.api.registry.FuelValueEvents` | docs `26.1.2/develop_items_first-item` 等 2 页 |
| `CompostableRegistry` | loader-api `net.fabricmc.fabric.api.registry.CompostableRegistry` | docs `26.1.2/develop_items_first-item` 等 2 页 |
| `KeyMappingHelper` | loader-api `net.fabricmc.fabric.api.client.keymapping.v1.KeyMappingHelper` | docs `26.1.2/develop_key-mappings` 等 2 页 |
| `PayloadTypeRegistry` | loader-api `net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry` | docs `26.1.2/develop_networking` 等 2 页 |
| `CustomPayload` | docs 正文简写，**非类名**：摘要与 jar 均无 `CustomPayload`，真实接口 `net.minecraft.network.protocol.common.custom.CustomPacketPayload`（jar，含 `$Type` / `$TypeAndCodec`） | docs `26.1.2/develop_networking` |
| `PlayerLookup` | loader-api `net.fabricmc.fabric.api.networking.v1.PlayerLookup` | docs `26.1.2/develop_networking` 等 2 页 |
| `CommandRegistrationCallback` | loader-api `net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback` | docs `26.1.2/develop_commands_basics` |
| `ClientCommandRegistrationCallback` | loader-api `net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback` | docs `26.1.2/develop_commands_basics` |
| `ClientCommands` | loader-api `net.fabricmc.fabric.api.client.command.v2.ClientCommands` | docs `26.1.2/develop_commands_basics` 等 2 页 |
| `FabricDataGenerator` | loader-api `net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `FabricPackOutput` | loader-api `net.fabricmc.fabric.api.datagen.v1.FabricPackOutput` | docs `26.1.2/develop_porting_fabric-api` |
| `FabricRecipeProvider` | loader-api `net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider` | docs `26.1.2/develop_data-generation_recipes` |
| `FabricTagsProvider` | loader-api `net.fabricmc.fabric.api.datagen.v1.provider.FabricTagsProvider` | docs `26.1.2/develop_data-generation_tags` 等 2 页 |
| `FabricBlockLootSubProvider` | loader-api `net.fabricmc.fabric.api.datagen.v1.loot.FabricBlockLootSubProvider` + `net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootSubProvider`（**双包**） | docs `26.1.2/develop_porting_fabric-api` |
| `FabricLanguageProvider` | loader-api `net.fabricmc.fabric.api.datagen.v1.provider.FabricLanguageProvider` | docs `26.1.2/develop_data-generation_translations` 等 2 页 |
| `FabricAdvancementProvider` | loader-api `net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider` | docs `26.1.2/develop_data-generation_advancements` 等 2 页 |
| `FabricModelProvider` | loader-api `net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider` | docs `26.1.2/develop_data-generation_block-models` 等 2 页 |
| `FabricBlockEntityTypeBuilder` | loader-api `net.fabricmc.fabric.api.object.builder.v1.block.entity.FabricBlockEntityTypeBuilder` | docs `26.1.2/develop_blocks_block-entities` |
| `FabricDefaultAttributeRegistry` | loader-api `net.fabricmc.fabric.api.object.builder.v1.entity.FabricDefaultAttributeRegistry` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `EntityRendererRegistry` | loader-api `net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry` | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在） |
| `BiomeModifications` | loader-api `net.fabricmc.fabric.api.biome.v1.BiomeModifications` | docs `26.1.2/develop_data-generation_features` |
| `BiomeSelectors` | loader-api `net.fabricmc.fabric.api.biome.v1.BiomeSelectors` | docs `26.1.2/develop_data-generation_features` |
| `HudElementRegistry` | loader-api `net.fabricmc.fabric.api.client.rendering.v1.hud.HudElementRegistry` | docs `26.1.2/develop_rendering_basic-concepts` 等 2 页 |
| `AttachmentRegistry` | loader-api `net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry`（`public,final`） | docs `26.1.2/develop_serialization_data-attachments`（全库仅此 1 页） |
| `AttachmentRegistry.Builder` | loader-api 外层 `net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry`，摘要内为其嵌套类型（simpleName Builder，fqcn 后缀 $Builder，`modifiers=public`） | docs 同页只写出 `builder` / `persistent` / `copyOnDeath` 三个简名，其余方法名在 `<<< @/reference` include 内 |
| `AttachmentSyncPredicate` | loader-api `net.fabricmc.fabric.api.attachment.v1.AttachmentSyncPredicate` | docs 同页写明 `all()` / `targetOnly()` / `allButTarget()` |
| `AttachmentTarget` | loader-api `net.fabricmc.fabric.api.attachment.v1.AttachmentTarget`（`public`，12 个 default 方法） | docs 零命中（示例代码是 `<<< @/reference` include，不计零命中为不存在；注入目标该页写作 `Entity` / `BlockEntity` / `ServerLevel` / `ChunkAccess`） |
| `AttachmentTarget.OnAttachedSet` | loader-api 外层 `net.fabricmc.fabric.api.attachment.v1.AttachmentTarget`，摘要内为其嵌套类型（simpleName OnAttachedSet，fqcn 后缀 $OnAttachedSet，摘要 modifiers 为空） | docs 零命中（同上）；摘要内该嵌套类型只有 1 个方法 onAttachedSet(A, A)，是否接口未核实 |
| `AttachmentType` | loader-api `net.fabricmc.fabric.api.attachment.v1.AttachmentType` | docs 零命中（同上）；**是返回类型简名，是否接口本表未核实**（摘要无 class/interface 区分） |
| `GlobalAttachments` | loader-api `net.fabricmc.fabric.api.attachment.v1.GlobalAttachments`（摘要内 `methods` 为**空数组**） | docs 同页写作 `Level.globalAttachments()` / `MinecraftServer.globalAttachments()` |
| `GlobalAttachmentsProvider` | loader-api `net.fabricmc.fabric.api.attachment.v1.GlobalAttachmentsProvider` | docs 零命中（同上） |
| `Identifier` | 26.1 client jar `net.minecraft.resources.Identifier` | docs `26.1.2/develop_networking` 等 12 页 |
| `Registry` | 26.1 client jar `net.minecraft.core.Registry` | docs `26.1.2/develop_entities_effects` 等 7 页 |
| `BuiltInRegistries` | 26.1 client jar `net.minecraft.core.registries.BuiltInRegistries` | docs `26.1.2/develop_items_custom-data-components` 等 3 页 |
| `Registries` | 26.1 client jar `net.minecraft.core.registries.Registries` | docs `26.1.2/develop_automatic-testing` 等 2 页 |
| `HolderLookup` | 26.1 client jar `net.minecraft.core.HolderLookup` | docs 零命中 |
| `HolderGetter` | 26.1 client jar `net.minecraft.core.HolderGetter` | docs 零命中 |
| `InteractionResult` | 26.1 client jar `net.minecraft.world.InteractionResult` | docs `26.1.2/develop_events` 等 4 页 |
| `ItemStack` | 26.1 client jar `net.minecraft.world.item.ItemStack` | docs `26.1.2/develop_automatic-testing` 等 8 页 |
| `BlockPos` | 26.1 client jar `net.minecraft.core.BlockPos` | docs `26.1.2/develop_networking` 等 6 页 |
| `Level` | 26.1 client jar `net.minecraft.world.level.Level` | docs `26.1.2/develop_mixins_bytecode` 等 4 页 |
| `Player` | 26.1 client jar `net.minecraft.world.entity.player.Player` | docs `26.1.2/develop_entities_first-entity` 等 4 页 |
| `ServerPlayer` | 26.1 client jar `net.minecraft.server.level.ServerPlayer` | docs `26.1.2/develop_networking` 等 2 页 |
| `MinecraftServer` | 26.1 client jar `net.minecraft.server.MinecraftServer` | docs `26.1.2/develop_getting-started_intellij-idea_generating-sources` 等 2 页 |
| `PathfinderMob` | 26.1 client jar `net.minecraft.world.entity.PathfinderMob` | docs `26.1.2/develop_entities_first-entity` |
| `EntityBlock` | 26.1 client jar `net.minecraft.world.level.block.EntityBlock` | docs `26.1.2/develop_blocks_block-entities` 等 2 页 |
| `BlockEntity` | 26.1 client jar `net.minecraft.world.level.block.entity.BlockEntity` | docs `26.1.2/develop_blocks_block-entities` 等 5 页 |
| `BlockEntityType` | 26.1 client jar `net.minecraft.world.level.block.entity.BlockEntityType` | docs `26.1.2/develop_blocks_block-entities` 等 2 页 |
| `EntityDataAccessor` | 26.1 client jar `net.minecraft.network.syncher.EntityDataAccessor` | docs `26.1.2/develop_entities_first-entity` 等 2 页 |
| `MobCategory` | 26.1 client jar `net.minecraft.world.entity.MobCategory` | docs 零命中 |
| `SoundEvent` | 26.1 client jar `net.minecraft.sounds.SoundEvent` | docs `26.1.2/develop_sounds_custom` 等 3 页 |
| `SoundSource` | 26.1 client jar `net.minecraft.sounds.SoundSource` | docs 零命中 |
| `Component` | 26.1 client jar `net.minecraft.network.chat.Component` | docs `26.1.2/develop_commands_basics` 等 9 页 |
| `Commands` | 26.1 client jar `net.minecraft.commands.Commands` | docs `26.1.2/develop_commands_basics` |
| `StreamCodec` | 26.1 client jar `net.minecraft.network.codec.StreamCodec` | docs `26.1.2/develop_networking` 等 3 页 |
| `RecipeProvider` | 26.1 client jar `net.minecraft.data.recipes.RecipeProvider` | docs `26.1.2/develop_data-generation_recipes` |
| `RecipeOutput` | 26.1 client jar `net.minecraft.data.recipes.RecipeOutput` | docs 零命中 |
| `ShapedRecipeBuilder` | 26.1 client jar `net.minecraft.data.recipes.ShapedRecipeBuilder` | docs 零命中 |
| `RecipeCategory` | 26.1 client jar `net.minecraft.data.recipes.RecipeCategory` | docs `26.1.2/develop_class-tweakers_enum-extension` |
| `BlockLootSubProvider` | 26.1 client jar `net.minecraft.data.loot.BlockLootSubProvider` | docs 零命中 |
| `Identifier` 补充 | 官方映射把旧 `ResourceLocation` 改名为 `Identifier`：26.1 client jar（10682 条）内 `resources/Identifier.class` **1 条、无嵌套**，`ResourceLocation` **0 条**。 | 1.21.11 及更早那半句（改名发生在 1.21.11）本表 **未核实**：1.21.11 客户端 jar 仍是混淆名（`fzu$a.class` 之类），无法用同名核对；`07-datagen.mdc` 该段按 mappings.dev 口径书写。 |

## 表 B — Fabric API 关键方法签名（逐字取自已入库 loader-api 摘要）

行首记法 = 摘要内 `simpleName` + `.` + 方法名（按第一个 `.` 切分）；嵌套类写成嵌套 simpleName（如 `Builder.persistent`），外层归属写在括号里，第三列的 `.java` 路径才决定查摘要内哪一个同名 simpleName。签名列第一处反引号内容须与摘要 `signature` **逐字**相同，多条重载按摘要顺序把基准那条放前面。

| 方法 | 摘要内签名 | 修饰符 / 源文件 |
|------|-----------|-----------------|
| `DataGeneratorEntrypoint.onInitializeDataGenerator` | `void onInitializeDataGenerator(FabricDataGenerator)` | - / net/fabricmc/fabric/api/datagen/v1/DataGeneratorEntrypoint.java |
| `FabricDataGenerator.createPack` | `Pack createPack()` | public / net/fabricmc/fabric/api/datagen/v1/FabricDataGenerator.java |
| `FabricRecipeProvider.createRecipeProvider` | `RecipeProvider createRecipeProvider(HolderLookup.Provider, RecipeOutput)` | protected abstract / net/fabricmc/fabric/api/datagen/v1/provider/FabricRecipeProvider.java |
| `FabricTagsProvider.addTags` | `void addTags(HolderLookup.Provider)` | protected abstract / net/fabricmc/fabric/api/datagen/v1/provider/FabricTagsProvider.java |
| `FabricLanguageProvider.generateTranslations` | `void generateTranslations(HolderLookup.Provider, TranslationBuilder)` | public abstract / net/fabricmc/fabric/api/datagen/v1/provider/FabricLanguageProvider.java |
| `FabricBlockLootSubProvider.generate` | `void generate()` | public abstract / net/fabricmc/fabric/api/datagen/v1/provider/FabricBlockLootSubProvider.java |
| `FabricAdvancementProvider.generateAdvancement` | `void generateAdvancement(HolderLookup.Provider, Consumer<AdvancementHolder>)` | public abstract / net/fabricmc/fabric/api/datagen/v1/provider/FabricAdvancementProvider.java |
| `Event.register` | `void register(T)` | public abstract / net/fabricmc/fabric/api/event/Event.java |
| `PayloadTypeRegistry.clientboundPlay` | `PayloadTypeRegistry<RegistryFriendlyByteBuf> clientboundPlay()` | static / net/fabricmc/fabric/api/networking/v1/PayloadTypeRegistry.java |
| `PayloadTypeRegistry.serverboundPlay` | `PayloadTypeRegistry<RegistryFriendlyByteBuf> serverboundPlay()` | static / net/fabricmc/fabric/api/networking/v1/PayloadTypeRegistry.java |
| `PayloadTypeRegistry.register` | `CustomPacketPayload.TypeAndCodec<?superB,T> register(CustomPacketPayload.Type<T>, StreamCodec<?superB,T>)` | - / net/fabricmc/fabric/api/networking/v1/PayloadTypeRegistry.java |
| `CompostableRegistry`（类级） | 摘要内 `methods` 为 **空数组**（`modifiers=public`, `file=net/fabricmc/fabric/api/registry/CompostableRegistry.java`） | 注册方法名 **未核实**：以该版文档为准，禁止默写 |
| `AttachmentRegistry.create` | `AttachmentType<A> create(Identifier, Consumer<Builder<A>>)` / `AttachmentType<A> create(Identifier)`（摘要内 `create` 两条重载即此顺序） | public static / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `AttachmentRegistry.createDefaulted` | `AttachmentType<A> createDefaulted(Identifier, Supplier<A>)` | public static / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `AttachmentRegistry.createPersistent` | `AttachmentType<A> createPersistent(Identifier, Codec<A>)` | public static / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `AttachmentRegistry.builder` | `Builder<A> builder()` | public static / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `Builder.persistent`（外层 `AttachmentRegistry` 的嵌套 `Builder`） | `Builder<A> persistent(Codec<A>)` | - / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `Builder.initializer`（外层 `AttachmentRegistry` 的嵌套 `Builder`） | `Builder<A> initializer(Supplier<A>)` | - / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `Builder.copyOnDeath`（外层 `AttachmentRegistry` 的嵌套 `Builder`） | `Builder<A> copyOnDeath()` | - / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `Builder.syncWith`（外层 `AttachmentRegistry` 的嵌套 `Builder`） | `AttachmentRegistry.Builder<A> syncWith(StreamCodec<?superRegistryFriendlyByteBuf,A>, AttachmentSyncPredicate)`（另有末尾多一个 `int` 的重载） | - / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `Builder.buildAndRegister`（外层 `AttachmentRegistry` 的嵌套 `Builder`） | `AttachmentType<A> buildAndRegister(Identifier)` | - / net/fabricmc/fabric/api/attachment/v1/AttachmentRegistry.java |
| `AttachmentSyncPredicate.all` | `AttachmentSyncPredicate all()`（`targetOnly()` / `allButTarget()` 同形） | static / net/fabricmc/fabric/api/attachment/v1/AttachmentSyncPredicate.java |
| `AttachmentTarget.hasAttached` | `boolean hasAttached(AttachmentType<?>)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentTarget.getAttached` | `A getAttached(AttachmentType<A>)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentTarget.setAttached` | `A setAttached(AttachmentType<A>, A)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentTarget.modifyAttached` | `A modifyAttached(AttachmentType<A>, UnaryOperator<A>)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentTarget.removeAttached` | `A removeAttached(AttachmentType<A>)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentTarget.onAttachedSet` | `Event<OnAttachedSet<A>> onAttachedSet(AttachmentType<A>)` | default / net/fabricmc/fabric/api/attachment/v1/AttachmentTarget.java |
| `AttachmentType.identifier` | `Identifier identifier()`（另有 `persistenceCodec()` / `isPersistent()` / `initializer()` / `isSynced()` / `copyOnDeath()`） | - / net/fabricmc/fabric/api/attachment/v1/AttachmentType.java |
| `GlobalAttachmentsProvider.globalAttachments` | `GlobalAttachments globalAttachments()` | default / net/fabricmc/fabric/api/attachment/v1/GlobalAttachmentsProvider.java |

上列首参 `Identifier` 是 26.1 Mojmap 名（旧 `ResourceLocation`，见表 A 补充行）；`?superX` 是摘要把 `? super X` 去掉空格后的写法，不是泛型语法。`AttachmentTarget` 共 12 个 default 方法，本表只列教学常用项，其余 `getAttachedOrThrow` / `getAttachedOrSet` / `getAttachedOrCreate`（2 个重载）/ `getAttachedOrElse` / `getAttachedOrGet` 逐字见摘要。

## 表 C — 1.21.11 → 26.1 已死类名（72 条，本档禁止出现在代码块内）

派生方式（门禁会重跑同一派生，不信赖本表手抄）：取 docs 页 `26.1.2/develop_porting_fabric-api` 顶层「反引号旧名 → 反引号新名」条目的**旧侧** PascalCase 简名，减去新侧同名、再减去 26.1.2 摘要里仍然存在的简名。

| 已死旧名（禁止） | 26.1.2 现名 |
|------------------|-------------|
| `AbstractWorldRenderContext` | `AbstractLevelRenderContext` |
| `AtlasSourceRegistry` | `SpriteSourceRegistry` |
| `BlockRenderLayerMap` | `ChunkSectionLayerMap` |
| `BlockVertexConsumerProvider` | `BlockMultiBufferSource` |
| `C2SConfigurationChannelEvents` | `ServerboundConfigurationChannelEvents` / `ServerboundConfigurationChannelEvents$Register` / `ServerboundConfigurationChannelEvents$Unregister` |
| `C2SPlayChannelEvents` | `ServerboundPlayChannelEvents` / `ServerboundPlayChannelEvents$Register` / `ServerboundPlayChannelEvents$Unregister` |
| `ClientCommandManager` | `ClientCommands` |
| `ClientWorldEvents` | `ClientLevelEvents` / `ClientLevelEvents$AfterClientLevelChange` |
| `ComponentTooltipAppenderRegistry` | `ItemComponentTooltipProviderRegistry` |
| `CompostingChanceRegistry` | `CompostableRegistry` |
| `DrawItemStackOverlayCallback` | `RenderItemDecorationsCallback` |
| `EntityModelLayerRegistry` | `ModelLayerRegistry` / `ModelLayerRegistry$TexturedArmorModelSetProvider` / `ModelLayerRegistry$TexturedLayerDefinitionProvider` |
| `ExtendedScreenHandlerFactory` | `ExtendedMenuProvider` |
| `ExtendedScreenHandlerType` | `ExtendedMenuType` / `ExtendedMenuType$ExtendedFactory` |
| `FabricBakedModelManager` | `FabricModelManager` |
| `FabricBlockLootTableGenerator` | `FabricBlockLootSubProvider` |
| `FabricBlockLootTableProvider` | `FabricBlockLootSubProvider` |
| `FabricBlockModelRenderer` | `FabricModelBlockRenderer` |
| `FabricBlockModels` | `FabricBlockModelShaper` |
| `FabricBlockRenderManager` | `FabricBlockRenderDispatcher` |
| `FabricBlockStateParticleEffect` | `FabricBlockParticleOption` |
| `FabricBrewingRecipeRegistryBuilder` | `FabricPotionBrewingBuilder` / `FabricPotionBrewingBuilder$BuildCallback` |
| `FabricCreativeInventoryScreen` | `FabricCreativeModeInventoryScreen` |
| `FabricDataOutput` | `FabricPackOutput` |
| `FabricEntityLootTableGenerator` | `FabricEntityLootSubProvider` |
| `FabricEntityLootTableProvider` | `FabricEntityLootSubProvider` |
| `FabricEntitySelectorReader` | `FabricEntitySelectorParser` |
| `FabricErrorCollectingSpriteGetter` | `FabricSpriteGetter` |
| `FabricGameRuleVisitor` | `FabricGameRuleTypeVisitor` |
| `FabricItemGroup` | `FabricCreativeModeTab` |
| `FabricItemGroupEntries` | `FabricCreativeModeTabOutput` |
| `FabricLootTableProvider` | `FabricLootTableSubProvider` |
| `FabricProvidedTagBuilder` | `FabricTagAppender` |
| `FabricReadView` | `FabricValueInput` |
| `FabricRecipeExporter` | `FabricRecipeOutput` |
| `FabricRenderCommandQueue` | `FabricOrderedSubmitNodeCollector` |
| `FabricScreenHandlerFactory` | `FabricMenuProvider` |
| `FabricServerConfigurationNetworkHandler` | `FabricServerConfigurationPacketListenerImpl` |
| `FabricServerRecipeManager` | `FabricRecipeManager` |
| `FabricSpriteAtlasTexture` | `FabricPreparations` |
| `FabricSpriteProvider` | `FabricSpriteSet` |
| `FabricStitchResult` | `FabricTextureAtlas` |
| `FabricTagProvider` | `FabricTagsProvider` / `FabricTagsProvider$AliasGroupBuilder` / `FabricTagsProvider$BlockEntityTypeTagsProvider` / `FabricTagsProvider$BlockTagsProvider` / `FabricTagsProvider$EntityTypeTagsProvider` / `FabricTagsProvider$FabricIntrinsicHolderTagsProvider` / `FabricTagsProvider$FluidTagsProvider` / `FabricTagsProvider$ItemTagsProvider` |
| `FabricTrackedDataRegistry` | `FabricEntityDataRegistry` |
| `FabricWriteView` | `FabricValueOutput` |
| `FuelRegistryEvents` | `FuelValueEvents` / `FuelValueEvents$BuildCallback` / `FuelValueEvents$Context` / `FuelValueEvents$ExclusionsCallback` |
| `InventoryStorage` | `ContainerStorage` |
| `ItemGroupEvents` | `CreativeModeTabEvents` / `CreativeModeTabEvents$ModifyOutput` / `CreativeModeTabEvents$ModifyOutputAll` |
| `KeyBindingHelper` | `KeyMappingHelper` |
| `LandPathNodeTypesRegistry` | `LandPathTypeRegistry` / `LandPathTypeRegistry$DynamicPathTypeProvider` / `LandPathTypeRegistry$PathTypeProvider` / `LandPathTypeRegistry$StaticPathTypeProvider` |
| `LivingEntityFeatureRendererRegistrationCallback` | `LivingEntityRenderLayerRegistrationCallback` / `LivingEntityRenderLayerRegistrationCallback$RegistrationHelper` |
| `MeshBakedGeometry` | `MeshQuadCollection` |
| `ModelBakeSettingsHelper` | `ModelStateHelper` |
| `PacketByteBufs` | `FriendlyByteBufs` |
| `ParticleFactoryRegistry` | `ParticleProviderRegistry` / `ParticleProviderRegistry$PendingParticleProvider` |
| `ParticleRendererRegistry` | `ParticleGroupRegistry` |
| `PointOfInterestHelper` | `PoiHelper` |
| `RenderLayerHelper` | `ChunkSectionLayerHelper` |
| `S2CConfigurationChannelEvents` | `ClientboundConfigurationChannelEvents` / `ClientboundConfigurationChannelEvents$Register` / `ClientboundConfigurationChannelEvents$Unregister` |
| `S2CPlayChannelEvents` | `ClientboundPlayChannelEvents` / `ClientboundPlayChannelEvents$Register` / `ClientboundPlayChannelEvents$Unregister` |
| `SculkSensorFrequencyRegistry` | `VibrationFrequencyRegistry` |
| `ServerEntityWorldChangeEvents` | `ServerEntityLevelChangeEvents` / `ServerEntityLevelChangeEvents$AfterEntityChange` / `ServerEntityLevelChangeEvents$AfterPlayerChange` |
| `ServerWorldEvents` | `ServerLevelEvents` / `ServerLevelEvents$Load` / `ServerLevelEvents$Unload` |
| `SimpleFabricLootTableProvider` | `SimpleFabricLootTableSubProvider` |
| `SimpleResourceReloader` | `SimpleReloadListener` |
| `SpecialGuiElementRegistry` | `PictureInPictureRendererRegistry` / `PictureInPictureRendererRegistry$Context` / `PictureInPictureRendererRegistry$Factory` |
| `TooltipComponentCallback` | `ClientTooltipComponentCallback` |
| `WorldExtractionContext` | `LevelExtractionContext` |
| `WorldRenderContext` | `LevelRenderContext` |
| `WorldRenderEvents` | `LevelRenderEvents` / `LevelRenderEvents$AfterBlockOutlineExtraction` / `LevelRenderEvents$AfterEntities` / `LevelRenderEvents$BeforeBlockOutline` / `LevelRenderEvents$BeforeEntities` / `LevelRenderEvents$BeforeTranslucent` / `LevelRenderEvents$DebugRender` / `LevelRenderEvents$EndExtraction` / `LevelRenderEvents$EndMain` / `LevelRenderEvents$StartMain` |
| `WorldTerrainRenderContext` | `LevelTerrainRenderContext` |
| `WrapperUnbakedGroupedBlockStateModel` | `WrapperUnbakedRootBlockStateModel` |

## 表 D — 原版（vanilla）签名：docs 零命中、只能由 jar 钉死

| 事实 | 证据（javap / 类名，26.1 client jar） |
|------|----------------------------------------|
| `ShapedRecipeBuilder.shaped` 首参 | 逐字（javap）：`public static ShapedRecipeBuilder shaped(net.minecraft.core.HolderGetter<net.minecraft.world.item.Item>, net.minecraft.data.recipes.RecipeCategory, net.minecraft.world.level.ItemLike)` |
| 拿到 `HolderGetter<Item>` 的写法 | `registries.lookupOrThrow(Registries.ITEM)`；`HolderLookup.Provider.lookupOrThrow(ResourceKey)` → `HolderGetter`（javap），且 `HolderLookup<T> extends HolderGetter<T>` |
| `RecipeProvider` 构造器 | `protected RecipeProvider(HolderLookup$Provider, RecipeOutput)`（javap）— 摘要无构造器，此行为 jar 证据 |
| `buildRecipes()` 是抽象方法 | `protected abstract void buildRecipes()`（javap `RecipeProvider`） |
| `save(output)` 可直接调 | `RecipeBuilder`：`public default void save(RecipeOutput)`，另有 `save(RecipeOutput, ResourceKey<Recipe<?>>)` 抽象版（javap） |
| `has(ItemLike)` 存在 | `protected Criterion<InventoryChangeTrigger.TriggerInstance> has(ItemLike)`（javap `RecipeProvider`） |
| 方块掉落基类 | `net.minecraft.data.loot.BlockLootSubProvider`：`protected abstract void generate()`、`protected void dropSelf(Block)`（javap）；Fabric 侧 `datagen.v1.provider.FabricBlockLootSubProvider` 把 `generate()` 重声明为 `public abstract`（摘要） |
| 同名双包 | 摘要里 `FabricBlockLootSubProvider` 有两条：`datagen.v1.loot`（只有 default `withConditions`）与 `datagen.v1.provider`（`generate()` / `run` / `getName`）。DataGen 要 extends 的是 **`datagen.v1.provider`** 那条 |
| 声音分类枚举 | `net/minecraft/sounds/SoundSource.class` 在 26.1 jar 内 **1 条**；`SoundCategory` **0 条**（全 10682 条内）。docs 侧只有 `26.1.2/develop_sounds_using-sounds` 第 23 / 27 行写 `SoundCategory`；`develop_sounds_dynamic-sounds` 里的 `DynamicSoundSource` 是本档自建示例接口，与枚举名无关 |

## 表 E — 明确未核实（禁止默写，禁止用邻版 API 顶上）

| 项 | 状态 |
|----|------|
| 各 DataGen provider 的 **构造器参数**（`FabricRecipeProvider` / `FabricTagsProvider` / `FabricLanguageProvider` / `FabricBlockLootSubProvider` 的 `super(output, …)` / `super(output, "en_us", …)`） | 摘要无构造器、docs 代码是 include，未核实；`07-datagen.mdc` 示例按 IDE 补全核对后再落盘 |
| `FabricBlockLootSubProvider`（`datagen.v1.loot`）是 interface 还是 class | 摘要 `modifiers` 不含该信息，未核实 |
| `RecipeCategory` 的枚举常量集合（`MISC` 等） | 摘要不含原版枚举常量；jar 只证类名存在，常量未核实 |
| `pack.addProvider(...)` 的重载与 `Pack` 类型成员 | 摘要只列出 `FabricDataGenerator.createPack() → Pack`，`Pack` 自身成员未核实 |
| 26.2 的任何内容 | 本档不写；线上 26.1→26.2 移植页走 `search_fabric_docs` 的 `porting/26.2` 旁路，禁止建 `data/fabric_26.2` 克隆树 |

## 已知 docs 滞后（写方案时以 loader-api / jar 为准，并注明页 id）

| 页 id | 页内写法 | 26.1.2 现名 |
|-------|----------|-------------|
| `26.1.2/develop_data-generation_loot-tables` | `FabricBlockLootTableProvider`、`SimpleFabricLootTableProvider` | 两者在摘要与 jar 中 **均无**。方块掉落用 `FabricBlockLootSubProvider`（`datagen.v1.provider`）；其余以本版文档 / IDE 为准，禁止默写 |
| `26.1.2/develop_data-generation_enchantments` | `FabricTagProvider<Enchantment>` | `FabricTagsProvider<Enchantment>`（`develop_data-generation_tags` 已用新名） |
| `26.1.2/develop_fluids_first-fluid` | `FabricTagProvider.FluidTagProvider` | `FabricTagsProvider$FluidTagsProvider`（`develop_porting_fabric-api` 逐条改名） |
| `26.1.2/develop_sounds_using-sounds` | `SoundCategory`（第 23 / 27 行；`1.21.11` 同页同写法 = Yarn 时代名） | `SoundSource`（表 D） |
| `26.1.2/develop_networking` | 正文简写 `CustomPayload.Type` / `a CustomPayload` | jar 内真实类型 `CustomPacketPayload` + 嵌套 `CustomPacketPayload$Type`（表 A）；本档规则与 Skill 均写 `CustomPacketPayload` |
