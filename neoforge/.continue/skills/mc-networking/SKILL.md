---
name: mc-networking
description: 分发到版本目录。1.20.1 = Forge SimpleChannel 形态；1.20.4+ = Payload。
platform: neoforge
version: "unversioned"
---

# 网络通信（NeoForge Payload 时代）

> 本稿按 NeoForge **1.21.1** 文档树核实（页 id 见「参考资料」）。版本对照（仓库既有结论，跨版本以 `search_neoforge_docs` 复核）：1.20.1 = Forge SimpleChannel 形态（session overlay）；1.20.4 = `RegisterPayloadHandlerEvent`（单数）；1.21+ = `RegisterPayloadHandlersEvent`（复数）。**本档禁用 SimpleChannel。**

## 核心概念

- 网络通信两大目标：客户端视图与服务端保持同步；客户端把玩家侧变化（按键、修改）告诉服务端。
- 通行做法：客户端与服务端互传**结构化消息**（payload）。NeoForge 提供基于 netty 的通信设施，常用方式是监听 `RegisterPayloadHandlersEvent`，向 `PayloadRegistrar` 注册 payload 的类型、读写编码与处理器。
- 注册监听挂在 **mod event bus** 上。

## 1. 定义 Payload（页 id：`networking_payload`）

```java
public record MyData(String name, int age) implements CustomPacketPayload {

    public static final CustomPacketPayload.Type<MyData> TYPE =
        new CustomPacketPayload.Type<>(ResourceLocation.fromNamespaceAndPath("mymod", "my_data"));

    public static final StreamCodec<ByteBuf, MyData> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, MyData::name,
        ByteBufCodecs.VAR_INT, MyData::age,
        MyData::new
    );

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }
}
```

- `CustomPacketPayload` 要求实现 `type()`：返回 payload 的**唯一标识**（`CustomPacketPayload.Type` 包着 `ResourceLocation`）。
- `STREAM_CODEC` 负责把对象写进/读出网络缓冲区；`composite` 每**两个参数**一组（字段 codec + 字段 getter），最后一个参数是构造器，按给出顺序构造；重载最多六个参数。
- 1.21.1 资源 id 用 `ResourceLocation.fromNamespaceAndPath`，不用 `new ResourceLocation`。

## 2. 注册（页 id：`networking_payload`）

```java
@SubscribeEvent // 在 mod event bus 上
public static void register(final RegisterPayloadHandlersEvent event) {
    final PayloadRegistrar registrar = event.registrar("1"); // 设定当前网络版本
    registrar.playBidirectional(
        MyData.TYPE,
        MyData.STREAM_CODEC,
        new DirectionalPayloadHandler<>(
            ClientPayloadHandler::handleDataOnMain,
            ServerPayloadHandler::handleDataOnMain
        )
    );
}
```

- `registrar("1")`：**设定当前网络版本**（版本不一致的协商行为以 `search_neoforge_docs` 复核）。
- 阶段：`play*` 注册 play 阶段 payload；另有 `configuration*`（仅配置阶段）与 `common*`（配置 + play 同时）。
- 方向：`*Bidirectional` 双向（`DirectionalPayloadHandler` 分别给定逻辑服务端/客户端处理器）；`*ToClient` / `*ToServer` 只管单侧。
- **线程**：处理器默认在**主线程**执行；重计算先切网络线程：

```java
PayloadRegistrar registrar = event.registrar("1")
    .executesOn(HandlerThread.NETWORK); // 之后注册的 payload 都在网络线程执行
```

- `executesOn` 是**状态修改型**方法：配置方法返回新实例，**必须接返回值**（`registrar = registrar.executesOn(HandlerThread.NETWORK);`），需要回主线程时再 `executesOn(HandlerThread.MAIN)`。

处理器（默认主线程；网络线程里用 `enqueueWork` 提交回主线程）：

```java
public static void handleDataOnMain(final MyData data, final IPayloadContext context) {
    // 默认主线程
}

public static void handleDataOnNetwork(final MyData data, final IPayloadContext context) {
    context.enqueueWork(() -> { /* 回主线程 */ })
        .exceptionally(e -> {
            context.disconnect(Component.translatable("my_mod.networking.failed", e.getMessage()));
            return null;
        });
}
```

- `enqueueWork` 返回 `CompletableFuture`：可链式组合、集中处理异常；**不处理异常会被吞掉且无通知**。

## 3. 发送（页 id：`networking_payload`）

- 实际传输：包装成 `ServerboundCustomPayloadPacket`（发往服务器）或 `ClientboundCustomPayloadPacket`（发往客户端），经 `Connection#send` 发送；按条件群发的便利实现集中在 `PacketDistributor`。
- **尺寸限制（已核实）**：发往**客户端**的 payload 最多 **1 MiB**；发往**服务器**的 payload **小于 32 KiB**。

```java
// 客户端侧 → 服务器
PacketDistributor.sendToServer(new MyData(...));

// 服务端侧 → 单个玩家 / 跟踪某区块的所有玩家 / 全部玩家
PacketDistributor.sendToPlayer(serverPlayer, new MyData(...));
PacketDistributor.sendToPlayersTrackingChunk(serverLevel, chunkPos, new MyData(...));
PacketDistributor.sendToAllPlayers(new MyData(...));
```

- 更多实现直接看 `PacketDistributor` 类。

## 4. Stream Codec 速查（页 id：`networking_streamcodecs`）

- 核心：`StreamCodec#encode(buffer, obj)` / `#decode(buffer)`；除非手动管理缓冲区，否则基本不会直接调用。缓冲区分三层：`ByteBuf` ← `FriendlyByteBuf`（Minecraft 读写）← `RegistryFriendlyByteBuf`（可访问注册表）；构造 codec 时用**最不特定的**缓冲区类型。
- 常用实例：`ByteBufCodecs`（`BOOL`/`BYTE`/`SHORT`/`INT`/`FLOAT`/`DOUBLE`/`BYTE_ARRAY`/`STRING_UTF8`/`TAG`/`COMPOUND_TAG`/`VECTOR3F`/`QUATERNIONF`/`GAME_PROFILE` 等）；`VAR_INT`/`VAR_LONG` 变长数字（值小时更省）；`UNSIGNED_SHORT`；`TRUSTED_TAG`/`TRUSTED_COMPOUND_TAG` 无 2 MiB 堆上限、**只建议 clientbound**；`#byteArray`/`#stringUtf8` 限长。
- 对象自带：`ResourceLocation#STREAM_CODEC`、`BlockPos.STREAM_CODEC`、`NeoForgeStreamCodecs#CHUNK_POS` 等；集中找 `StreamCodec` / `ByteBufCodecs` / `NeoForgeStreamCodecs`。
- 组合与变换：`composite`（≤6 参数）、`unit`（无数据；编码对象须与 unit 匹配）、`map`/`apply`/`mapStream`、`StreamCodec#ofMember`、`NeoForgeStreamCodecs#lazy`、`recursive`（自引用）、`dispatch`（按类型分派）。
- 集合/可选/映射：`ByteBufCodecs#collection`（可限最大数量）、`#list`、`#map`、`#optional`、`#either`、`#idMapper`（枚举/注册表按 id 传；可扩展枚举酌情用 `IExtensibleEnum#createStreamCodecForExtensibleEnum`）。
- 注册表对象：`ByteBufCodecs#registry` / `#holderRegistry` / `#holder`（配 `SoundEvent.DIRECT_STREAM_CODEC` 等直接编码）/ `#holderSet`（标签）。**自定义注册表必须 `RegistryBuilder#sync` 置 true**，否则编码抛异常。

## 5. 配置阶段（页 id：`networking_configuration_tasks`）

配置阶段 = 玩家真正加入游戏前，服务器（如 vanilla 发资源包信息）用来配置客户端的阶段，模组同样可用：

```java
@SubscribeEvent // mod event bus
public static void register(final RegisterConfigurationTasksEvent event) {
    event.register(new MyConfigurationTask());
}

public record MyConfigurationTask implements ICustomConfigurationTask {
    public static final ConfigurationTask.Type TYPE =
        new ConfigurationTask.Type(ResourceLocation.fromNamespaceAndPath("mymod", "my_task"));
    @Override
    public void run(final Consumer<CustomPacketPayload> sender) {
        sender.accept(new MyData(...));
    }
    @Override
    public ConfigurationTask.Type type() { return TYPE; }
}
```

- `ICustomConfigurationTask` 两个方法：`void run(Consumer<CustomPacketPayload> sender)` 与 `ConfigurationTask.Type type()`。
- **无需客户端确认**：`event.getListener()` 捕获 listener 后 `listener().finishCurrentTask(this.type())` 直接确认（服务器不等客户端处理完）。
- **需要客户端确认**：客户端处理完用 `context.reply(new AckPayload())`（AckPayload 用 `StreamCodec.unit(...)` 即可），服务端处理器再 `context.finishCurrentTask(MyConfigurationTask.TYPE)`。
- **未确认 = 登录永久卡住**；任务失败则断开客户端。务必保证确认/不确认路径其一必走。

## 6. 进阶同步（区块级 / 插值 / 大包）——策略级，未核实签名

- **区块级**：以区块为同步单元，用已核实的 `sendToPlayersTrackingChunk(serverLevel, chunkPos, ...)` 只发给跟踪该区块的玩家；变更走**事件驱动的增量包**（哪变了发哪），不要每 tick 全量重发。
- **插值**：服务端按周期发「快照」数据（位置/朝向/状态等），客户端按时间插值渲染，避免快照到达即跳变；快照结构与插值实现属策略层，客户端类名以 `search_neoforge_docs` 复核。
- **大包**：遵守已核实限制（clientbound ≤ 1 MiB、serverbound < 32 KiB）；超限先压缩/降级为「引用 + 增量」，仍超则**分片**（自定义序号 payload，客户端重组）；不要把长 NBT/大列表一整包发。
- 以上具体类与方法签名一律以 `search_neoforge_docs` 复核，禁止凭记忆补。

## 反面清单

- ❌ `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`（旧 Forge 形态）
- ❌ 把 1.20.4 的 `RegisterPayloadHandlerEvent`（单数）抄进 1.21+
- ❌ 1.21.1 用 `new ResourceLocation(...)` → `ResourceLocation.fromNamespaceAndPath`
- ❌ 自定义注册表不 `RegistryBuilder#sync(true)` 就编进 StreamCodec
- ❌ 手动控线程时漏掉 `CompletableFuture` 异常处理（被吞掉无通知）
- ❌ 配置任务既不确认也不失败 → 玩家永远进不了游戏

## 参考资料

- 页 id `networking`：https://docs.neoforged.net/docs/1.21.1/networking/
- 页 id `networking_payload`（Registering Payloads）：https://docs.neoforged.net/docs/1.21.1/networking/payload/
- 页 id `networking_streamcodecs`（Stream Codecs）：https://docs.neoforged.net/docs/1.21.1/networking/streamcodecs/
- 页 id `networking_configuration_tasks`（Using Configuration Tasks）：https://docs.neoforged.net/docs/1.21.1/networking/configuration-tasks/
- 其它版本：`search_neoforge_docs`（platform=neoforge + 对应 version），本稿不是跨版本全文。

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-sound` | 服务端触发远处玩家的声音（客户端本地播放包） |
| `mc-blockentity` | 方块实体的数据同步（区块级增量 / 对账包） |
| `mc-registry` | payload 依赖的注册表条目先登记 |
| `mc-mixin` | 拦截 vanilla 发包路径时的优先级与安全界限 |
