# NeoForge 1.20.6 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族（`DeferredRegister.createBlocks` / `createItems` / `DeferredBlock`，见 `knowledge/common/verified-api-1.20.6.md`）。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：**未核实**——`get_neoforge_doc_full --id=networking/payload --version=1.20.6` 实测 `DOC_NOT_FOUND`，本档语料只有 `networking.md` 概览页。

## 本档不是 Forge，但也不因此就是 1.21

本档是 NeoForge 分档，`SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel` 一律禁止（`06-networking.mdc`）。但**禁止反向推断**：不能因为「NeoForge 都用 Payload」就把 1.21 族签名（`playBidirectional` / `DirectionalPayloadHandler` / `PayloadRegistrar` 方法表）当本档已核 API 写出来。本档 06 规则判 payload 未核实，本文件不改口。

NeoForge 与 Forge 1.20.x 分叉的具体构建号：**未核实**（本档不写任何 NeoForge / Forge 版本号数字）。要核实走 `list_neoforge_versions` + `download_official_mdk`（dryRun）+ `query_loader_api`。

## 上一跳：MC 1.20.5 → 1.20.6（`primer/1.20.6`）

该 primer 在本仓语料中是**截断的**（`data/neoforge_primers/1.20.6.md` 仅 25 行，只有 Pack Changes / Additions 两节）。可核条目只有一条：新增 `net.minecraft.world.level.block.entity.BlockEntity#parseCustomNameSafe`（`1.20.6.md:25`）。1.20.5→1.20.6 的完整变更面属 **未核实**，需要时重跑 `get_neoforge_doc_full --id=primer/1.20.6 --version=1.20.6`，不要凭记忆补。

## 下一跳：MC 1.20.6 → 1.21（`primer/1.21`）——本档是这条分界的**前一侧**

本档是本仓最后一个仍写 `new ResourceLocation(...)` 且数据包/标签文件夹仍为**复数**的 NeoForge 档。语料计数：1.20.6 raw `new ResourceLocation`=1（`data/neoforge_1.20.6/neoforge-docs/1.20.6/raw/datamaps.md:62`）、`ResourceLocation.fromNamespaceAndPath`=0；1.21.1 / 1.21.3 已反转（0 / 32）。两条都在 `data/neoforge_primers/1.21.md` 有原文：

```java
// ✅ 本档（1.20.6）—— 只谈 ResourceLocation 构造，**不是** payload TYPE 示例
new ResourceLocation("mymod", "my_thing");           // primer/1.21.md:27 起才改
// ❌ 下一跳（1.21+）才有：ResourceLocation final + 构造器 private
ResourceLocation.fromNamespaceAndPath("mymod", "my_data");
// 其余改名（primer/1.21.md:31-35）：new ResourceLocation(String) -> parse(String)
// new ResourceLocation("minecraft", x) -> withDefaultNamespace(x)
// of -> bySeparator ；isValidResourceLocation 移除
```

```text
# ✅ 本档文件夹仍是复数    ❌ 1.21+ 去众数化（primer/1.21.md:37-50）
data/<ns>/advancements/        ->  advancement/
data/<ns>/loot_tables/         ->  loot_table/
data/<ns>/recipes/             ->  recipe/
data/<ns>/structures/          ->  structure/
data/<ns>/tags/blocks/         ->  tags/block/
data/<ns>/tags/items/          ->  tags/item/
data/<ns>/tags/entity_types/   ->  tags/entity_type/
data/<ns>/tags/fluids/         ->  tags/fluid/
data/<ns>/tags/game_events/    ->  tags/game_event/
```

同页其余小节（只列标题，签名 **未核实**）：Moving Experimental Features、Oh Rendering, why must you change so?、The Enchantment Datapack Object、The Painting Variant Datapack Object、Attribute Modifiers, now with ResourceLocations、RecipeInput、Changing Dimensions。

## DataGen：本档仍未拆分

本档事件是**裸 `GatherDataEvent`**，`generator.addProvider(event.includeServer(), ...)` + `event.includeClient()`；`RecipeProvider` 构造收 `PackOutput` + `CompletableFuture<HolderLookup.Provider>`，`buildRecipes(RecipeOutput)`；`event.getExistingFileHelper()` 仍在；模型走 `BlockStateProvider` + `ItemModelProvider`（`07-datagen.mdc`）。

`GatherDataEvent.Client` / `GatherDataEvent.Server` / `createProvider` / `createDatapackRegistryObjects` / `RecipeProvider.Runner` **不属本档**：跨档语料计数显示 1.20.4 / 1.20.6 / 1.21.1 / 1.21.3 的 raw 语料只有裸 `GatherDataEvent`，`.Client`/`.Server` 自 **1.21.5** 档语料起才出现。别拿 1.21.8 档的说法当本档边界，也别拿本档说法去套 1.21.5。

## 物理端与 payload 线程默认值

本档 payload handler **默认网络线程**，回主线程要 `IPayloadContext#enqueueWork`（`08-client-server.mdc:9`）。1.21.5 档改成**默认主线程**、要 `executesOn(HandlerThread.NETWORK)` 才挪走。这条默认值方向在本档与邻档**正好相反**，是从 1.20.6 迁出/迁入时最容易静默写错的一处；两侧细节都受上面 payload「未核实」约束，落笔前重查该版 networking 页。

## 实体与注册

本档语料**没有**独立 `entities` 页（`04-entity.mdc:3`），`EntityType.Builder` 的 1.21.5+ 形参（`.build(ResourceKey...)` / `registerEntityType` / `ValueInput`）**禁止**当本档已核签名。附加数据走 `AttachmentType.builder` + `#serializable` + `NeoForgeRegistries.ATTACHMENT_TYPES`，死亡复制与区块同步要自己接 `PlayerEvent.Clone`（`#isWasDeath`）/ `ChunkWatchEvent.Sent`——本档无 `syncWith` 一等公民（`verified-api-1.20.6.md:12-15`）。
