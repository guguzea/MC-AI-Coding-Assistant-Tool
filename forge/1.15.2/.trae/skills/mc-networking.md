---
name: mc-networking
description: Minecraft Forge 网络通信。SimpleChannel、PacketDistributor、NetworkRegistry.newSimpleChannel。触发词：网络、消息、Network、SimpleChannel、PacketDistributor、PacketBuffer
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.15.2）

## 快速开始

```java
private static final String PROTOCOL_VERSION = "1";
public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
        new ResourceLocation(MOD_ID, "main"),
        () -> PROTOCOL_VERSION,
        PROTOCOL_VERSION::equals,
        PROTOCOL_VERSION::equals
);

private static int id = 0;

public static void register() {
    INSTANCE.registerMessage(
            id++,
            MyMessage.class,
            MyMessage::encode,
            MyMessage::new,
            (msg, ctx) -> msg.handle(ctx)
    );
}
```

`newSimpleChannel` 返回 **`SimpleChannel`**。不要 `SimpleNetworkWrapper`，不要 `IMessage`。decoder 必须是 `Function<PacketBuffer, MSG>`（`MyMessage(PacketBuffer)`）。

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → INSTANCE.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → INSTANCE.send(PacketDistributor.PLAYER.with(() -> player), msg)

IF 服务端 → 全服广播
  → INSTANCE.send(PacketDistributor.ALL.noArg(), msg)

IF 服务端 → 追踪实体的玩家
  → INSTANCE.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), msg)
```

## 消息类结构

```java
public class MyMessage {
    private final int value;

    public MyMessage(int value) { this.value = value; }

    public MyMessage(PacketBuffer buf) { this.value = buf.readInt(); }

    public void encode(PacketBuffer buf) { buf.writeInt(value); }

    public void handle(Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> {
            ServerPlayerEntity player = ctx.get().getSender();
            if (player != null) {
                // 服务端处理
            }
        });
        ctx.get().setPacketHandled(true);
    }
}
```

## 常见错误

- ❌ `SimpleNetworkWrapper` / `IMessageHandler`
- ❌ `sendToAll(msg)`（1.12）；本档用 `PacketDistributor.ALL.noArg()`
- ❌ 在网络线程直接修改世界：必须 `enqueueWork()`
- ❌ 消息 ID 冲突
- ❌ `sendToServer()` 在服务端调用

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |

## 进阶同步（区块级 / 插值 / 大包）

> 本节为策略级写法：只列决策与边界，具体类/方法签名一律以 `search_forge_docs`（`networking` / `networking_overview` / `networking_simpleimpl` / `networking_entities` 页核实数据）为准，不在此编造。

### 可核实锚点：实体与客户端交互（`networking_entities` 页）

- 实体数据分两类：**生成时已知且不变** → 生成包（`IEntityAdditionalSpawnData` 的 `#writeSpawnData` / `#readSpawnData` 控制编解码）；**运行中变化** → 数据参数（vanilla 自动同步；数据参数只为你自己的实体定义，`EntityDataManager#createKey`（参数 + `DataSerializers` 系列化器）定义，`Entity#registerData` 里 `dataManager.register(...)` 并**先调 super**）。做自定义包之前先判断这两条路够不够。
- 常见断点：**玩家维度切换**（会话/绑定关系变化导致客户端对不上）、**实体追踪**（只有跟踪范围内的客户端才收到实体数据，跟踪距离外的玩家不该收）——两者都容易让人误以为「包没发出去」。
- 面向实体/区块的同步应走**可靠通道**（本档 SimpleChannel 即可靠通道，保证送达与顺序语义），并尊重**跟踪距离**：用 `PacketDistributor.TRACKING_ENTITY` / `PacketDistributor.TRACKING_CHUNK`（后者 `networking_simpleimpl` 页已核实）面向跟踪者分发，而非 `ALL` 无限广播。

### 区块级

- 服务端收到客户端给的区块/方块坐标 → **先做已加载校验**（`networking_simpleimpl` 页防御规则：仅当 `World#isBlockLoaded` 为 true 才访问该处方块/方块实体），否则任意区块生成可被攻击利用（页内原文 Warning）。
- 区块级数据按「需要的客户端集合」分发，避免全服广播。

### 插值

- 高频变化数据（坐标/朝向/速度）不要每 tick 一包：发**差值**（delta），或降低发送频率让**客户端插值/平滑**；单次瞬时值（点击、拾取）用单包即可。

### 大包

- 单体数据用单包；**批量数据分批**：列表/容器/配方类拆多包或增量发送，避免单包过大被拆包与丢序。
- 尽量发「变化片段」而非整表；发送频率设上限（每 tick 一次为常规高频上限），防带宽与主线程压力。

### 决策小结

```
IF 跟踪实体/区块 → 可靠通道 + TRACKING_ENTITY / TRACKING_CHUNK（尊重跟踪距离）
IF 维度切换/会话变化 → 客户端收包先做玩家/维度匹配校验，不匹配直接丢弃
IF 单值变化 → 单包；IF 批量数据 → 分批/增量；IF 高频 → 降频 + 差值
IF 服务端用客户端坐标访问区块 → 先 World#isBlockLoaded 校验
```
