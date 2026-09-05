# NeoForge 1.21.5 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族（`DeferredRegister.createBlocks` / `createItems` / `createEntities`，见 `knowledge/common/verified-api-1.21.5.md`）。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent` + `PayloadRegistrar` + `DirectionalPayloadHandler` + `playBidirectional`（`verified-api-1.21.5.md:19`，出处 `networking/payload` 页）。

## 上一跳：MC 1.21.4 → 1.21.5（`primer/1.21.5`，本档语料完整，3083 行）

工具/武器/盔甲的硬编码基类**被完全移除**（`data/neoforge_primers/1.21.5.md:76-78`）：

```java
// ❌ 1.21.4 侧：已删除，本档不得再写
new SwordItem(...); new DiggerItem(...); new ArmorItem(...);
// ✅ 本档：改数据组件 + Item$Properties#component
// WEAPON / TOOL / ARMOR / BLOCKS_ATTACKS（盾类 new BlocksAttacks(...) + DamageReduction + ItemDamageFunction）
// 配套 ATTRIBUTE_MODIFIERS / MAX_DAMAGE / MAX_STACK_SIZE / DAMAGE / REPAIRABLE / ENCHANTABLE
```

方块实体移除逻辑一分为二（`1.21.5.md:33-45`）：`BlockEntity#preRemoveSideEffects` 负责移除前副作用，`BlockBehaviour#onRemove` → `affectNeighborsAfterRemoval` 只负责邻居更新；`Containers#updateNeighboursAfterDestroy` 新增，`Containers#dropContentsOnDestroy` **移除**。

权重列表重构（`1.21.5.md:279-300`）：`SimpleWeightedRandomList` / `WeightedRandomList` → `WeightedList`，`WeightedEntry` → `Weighted`，`Weight` **移除**，`WeightedRandom` 静态方法改收 `ToIntFunction`。另有 VoxelShape helper（`Block#boxes/cube/column/boxZ`、`Shapes#rotate/rotateAttachFace`，含拼写修正 `Shapes#blockOccudes` → `blockOccludes`），以及 The Game Test Overhaul / Render Pipeline Rework / Model Rework / Saved Data, now with Types 四节（小节签名按需回查 primer，勿默写）。

## DataGen：拆分**在本档已完成**

本档 `GatherDataEvent.Client` / `GatherDataEvent.Server` 已拆，先 `event.createDatapackRegistryObjects(...)` 再 `event.createProvider(...)`，`RecipeProvider` 构造 `(HolderLookup.Provider, RecipeOutput)` + `buildRecipes()` 无参 + 套 `RecipeProvider.Runner`，模型走 `ModelProvider`（`07-datagen.mdc`）。

语料计数为证：`GatherDataEvent.Client`/`.Server` 与 `createProvider`/`createDatapackRegistryObjects` 在 1.20.4 / 1.20.6 / 1.21.1 / **1.21.3** 的 raw 语料中为 0，在 **1.21.5** / 1.21.8 / 1.21.10 / 1.21.11 均已出现。⚠️ `neoforge/1.21.8/.../02-version-migration.md` 把这次拆分写成 1.21.8 的「关键分界」——按语料，该分界**不晚于本档**。两档措辞冲突时以各自 raw 语料计数为准，不要任选一侧照抄。

## 本档仍是 CompoundTag，不是 ValueInput/ValueOutput

本档实体存盘仍是 `readAdditionalSaveData(CompoundTag)` / `addAdditionalSaveData(CompoundTag)`（`04-entity.mdc:7`）。`ValueInput` / `ValueOutput` 在**本档 raw 语料为 0 命中**，自 **MC 1.21.6** 起才引入——出处 `data/neoforge_primers/1.21.6.md:2277` 「Generic Encoding and Decoding: Replacing Direct NBT Access」。

```java
// ✅ 本档
protected void readAdditionalSaveData(CompoundTag tag) { ... }
// ❌ 下一跳（1.21.6 起，对应本仓 1.21.8 / 1.21.10 档）
protected void readAdditionalSaveData(ValueInput in) {
    this.stack = in.read("example_stack", ItemStack.CODEC).orElse(ItemStack.EMPTY); // 1.21.6.md:2295
}
```

## 本档仍是 DirectionalPayloadHandler

本档双向包用 `registrar.playBidirectional(TYPE, STREAM_CODEC, new DirectionalPayloadHandler<>(client, server))`。`RegisterClientPayloadHandlersEvent` 在**本档 raw 语料为 0 命中**，在 1.21.8 / 1.21.10 / 1.21.11 各 5 命中——即「拆成服务端 handler + 客户端 `RegisterClientPayloadHandlersEvent`、客户端改 `ClientPacketDistributor.sendToServer`」这条网络分界**不落在本档，也不落在 1.21.10**，落在 1.21.5 与 1.21.8 之间。`DirectionalPayloadHandler` 与 `RegisterClientPayloadHandlersEvent` 在任何一档都**互斥**，不得同时出现。

线程默认值：本档 handler **默认主线程**，挪网络线程要 `registrar = event.registrar("1").executesOn(HandlerThread.NETWORK)`（`executesOn` 返回**新** registrar，必须接住）。从 1.20.6 迁入时注意默认值方向相反（1.20.6 默认网络线程 + `IPayloadContext#enqueueWork`）。TYPE 用 `ResourceLocation.fromNamespaceAndPath`——`ResourceLocation` 构造器自 MC 1.21 起 private（`primer/1.21.md:27`），本档不得再写 `new ResourceLocation(...)`。

## 下一跳：MC 1.21.5 → 1.21.6（`primer/1.21.6`）

小节：GUI Changes、Waypoints、Blaze3d Changes、**Tag Providers: Appender Rewrite**、Generic Encoding and Decoding（上面那条 NBT/`ValueInput`）、Server Player Changes、Minor Migrations。

⚠️ `TagsProvider#getOrCreateRawBuilder` / `TagsProvider.TagLookup` 属**下一跳**（`1.21.6.md:2011-2032`），本档标签 provider 不得按 appender 重写后的形参写。

## 未核实

本档 NeoForge 构建号、Gradle / ModDevGradle / NeoGradle 版本、Java 除 AGENTS.md 所记 **21** 外的细节：**未核实**，本文件不写任何版本数字。落笔前 `list_neoforge_versions` + `download_official_mdk`（dryRun）。
