# NeoForge 1.21.10 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族（`DeferredRegister.createBlocks` / `createItems` / `createEntities`，见 `knowledge/common/verified-api-1.21.10.md`）。

跨版本用 `get_migration_guide`（默认 toc）+ Primer。本档网络：`RegisterPayloadHandlersEvent` + `PayloadRegistrar`（`playBidirectional` **只传服务端 handler**）+ 物理客户端 `RegisterClientPayloadHandlersEvent`（`verified-api-1.21.10.md:19-20`）。

## 先纠正一条最容易写错的分界

`RegisterClientPayloadHandlersEvent` **不是本档引入的**。跨档语料计数：1.21.1 / 1.21.3 / **1.21.5** 各 0 命中且 `DirectionalPayloadHandler` 各 3 命中；**1.21.8 / 1.21.10 / 1.21.11** 各 5 命中且 `DirectionalPayloadHandler` 0 命中。即「双向包拆成服务端 handler + 客户端 `RegisterClientPayloadHandlersEvent`」这条分界落在 **1.21.5 与 1.21.8 之间**。

`DirectionalPayloadHandler` 的宿主档是 **1.21.5**，不是 1.21.8。本档 `06-networking.mdc` 内部两行措辞不一致：第 5 行写「不是 1.21.8 的 `DirectionalPayloadHandler` 双向注册」，第 28 行写「把 1.21.5 的 `DirectionalPayloadHandler` 当本档双向注册」——**以第 28 行为准**，它与语料计数一致。第 5 行那句按语料属误标，迁移讨论中不要照抄。

```java
// ✅ 本档：公共侧只传服务端 handler
registrar.playBidirectional(MyData.TYPE, MyData.STREAM_CODEC, ServerPayloadHandler::handleDataOnMain);
// ✅ 本档：物理客户端侧
event.register(MyData.TYPE, ClientPayloadHandler::handleDataOnMain); // RegisterClientPayloadHandlersEvent
// ❌ 1.21.5 及更早：new DirectionalPayloadHandler<>(client, server) —— 本档禁用
```

客户端发包本档是 `ClientPacketDistributor.sendToServer`，服务端仍用 `PacketDistributor.sendToPlayer` / `sendToPlayersTrackingChunk` / `sendToAllPlayers`。线程默认主线程；网络线程服务端侧 `registrar.executesOn(HandlerThread.NETWORK)`（接住返回值），客户端侧 `event.register(TYPE, HandlerThread.NETWORK, handler)`（`06-networking.mdc`、`08-client-server.mdc:10`）。

## 上一跳：MC 1.21.9 → 1.21.10（`primer/1.21.10`，**语料截断**）

本仓 `data/neoforge_primers/1.21.10.md` 只有 37 行，可核条目**仅两条**：新增 `net.minecraft.world.entity.decoration.HangingEntity#getPopBox`（`:33`）；`net.minecraft.world.level.block.state.BlockBehaviour#entityInside` 多一个 `boolean` 形参，表示实体是相交还是在内（`:37`）。1.21.9→1.21.10 的完整变更面属 **未核实**——需要时重跑 `get_neoforge_doc_full --id=primer/1.21.10 --version=1.21.10`，禁止凭记忆补。

## 从 1.21.5 迁入本档：跨的是四跳，不是一跳

本仓 NeoForge 规则树没有 1.21.4 / 1.21.6 / 1.21.7 / 1.21.9 档，所以 1.21.5 → 1.21.10 中间跨过 MC 1.21.6、1.21.7、1.21.9 三个 primer。除上面的网络分界外，至少还要一起做：

```java
// ✅ 本档存盘：ValueInput / ValueOutput（04-entity.mdc:7；形参改动见 primer/1.21.6.md:2463）
protected void readAdditionalSaveData(ValueInput in) {
    this.stack = in.read("example_stack", ItemStack.CODEC).orElse(ItemStack.EMPTY); // 1.21.6.md:2295
}
protected void addAdditionalSaveData(ValueOutput out) {
    out.putInt("value", this.value); // 1.21.6.md:2328 —— put* 收 key + value
}
// ❌ 1.21.5 的 CompoundTag 形参 —— 该改动实际落在 MC 1.21.6（primer/1.21.6.md:2277），不是本档新事
```

`ValueOutput` 上写 `Codec` 的方法 primer 只说「also a `store` for `Codec`s」（`1.21.6.md:2279`），**未给出形参列表** → `// TODO(未核实)`，照 `put*` 的记忆去补三参调用是禁止的。读侧的 `ValueInput#read(key, codec)` 有示例可抄。实现类 `TagValueInput` / `TagValueOutput`（`createWithContext` / `create`，`1.21.6.md:2335-2341`）同理按需回查，勿默写。

另：标签 provider 的 appender 重写（`TagsProvider#getOrCreateRawBuilder` / `TagsProvider.TagLookup`，`primer/1.21.6.md:2011`）也来自 MC 1.21.6；`net.minecraft.world.level.Level#isClientSide` **字段**自 MC 1.21.9 起 private，查询一律走方法 `level.isClientSide()`（`primer/1.21.9.md:2929-2931`，与本档 `08-client-server.mdc` 用法一致）。物理端官方方法名本档是 `FMLEnvironment#getDist()`。

## DataGen 与注册：本档延续 1.21.5，不是本档的分界

`GatherDataEvent.Client` / `.Server` 已拆、`createDatapackRegistryObjects` 先于 `createProvider`、`RecipeProvider.Runner` 用法**与 1.21.5 页相同**（`07-datagen.mdc:5`）——这三条都不是本档新事，别当本档「关键分界」写。本档相对 1.21.5 的资源表**多出**：客户端 `EquipmentAssetProvider`、`waypoint_style`；服务端 `RecipePrioritiesProvider`、`datapacks`、`dialog` 等文件夹。模型仍走 `ModelProvider`。

物品：`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`，示例返回 `DeferredItem<Item>`，`Item.Properties#setId` **必须设置**；第三参仍是 `new Item.Properties()`，**不是** 26.1 的 unary operator（`03-item.mdc:5`）。

## 下一跳：本档 → 1.21.11（`primer/1.21.11`）

本档仍是 mojmap `ResourceLocation`：raw 语料 `ResourceLocation.fromNamespaceAndPath` 计数 1.21.5=34、1.21.8=35、**1.21.10=35**、1.21.11=**0**（同档 `Identifier` 词元 53）。即 `ResourceLocation` → `Identifier` 改名落在 **1.21.10 → 1.21.11**，本档不得预支。1.21.11 primer 其余小节（签名未核实，勿默写）：The Rename Shuffle、Oh Hey, Another Rendering Rewrite、Gizmos、Permission Overhaul、New Data Components、The Timeline of Environment Attributes、The Game Rule Shuffle。

## 未核实

本档 NeoForge 构建号、Gradle / ModDevGradle / NeoGradle 版本：本文件不写任何版本数字，**未核实**；Java 仅采信 `AGENTS.md` 所记 **21**。上面所有 primer 小节标题之外的签名：`// TODO(未核实)`，回查 `search_neoforge_docs --version=1.21.10` 或 `query_loader_api`（需用户自备 jar 跑 `ingest_loader_api`）。
