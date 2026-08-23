---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleChannel。触发词：网络、消息、Network、SimpleChannel、PacketDistributor、FriendlyByteBuf
platform: forge
version: "1.19.4"
dependencies: []
mappings: parchment
---

# 网络通信（Forge 1.19.4）

## 快速开始

```java
// 创建 SimpleChannel
public static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,
    PROTOCOL_VERSION::equals
);

// 注册消息
private static int msgId = 0;
public static void register() {
    CHANNEL.registerMessage(msgId++, MyMessage.class,
        MyMessage::toBytes, MyMessage::new,
        MyMessage::handle);
}
```

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → 在客户端调用 CHANNEL.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → CHANNEL.send(PacketDistributor.PLAYER.with(() -> player), msg)

IF 服务端 → 全服广播
  → CHANNEL.send(PacketDistributor.ALL.noArg(), msg)

IF 服务端 → 区域内所有玩家
  → CHANNEL.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), msg)
```

## 消息类结构

```java
import net.minecraft.network.FriendlyByteBuf;
import net.minecraft.resources.ResourceLocation;

public class MyMessage {
    private int value;
    private ResourceLocation targetId;

    public MyMessage() {}  // 必须有无参构造函数

    public MyMessage(int value, ResourceLocation targetId) {
        this.value = value;
        this.targetId = targetId;
    }

    public void encode(FriendlyByteBuf buf) {
        buf.writeInt(value);
        buf.writeResourceLocation(targetId);
    }

    public void decode(FriendlyByteBuf buf) {
        this.value = buf.readInt();
        this.targetId = buf.readResourceLocation();
    }
}
```

## 消息处理器

```java
public static void handle(MyMessage msg, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        // 在主线程执行游戏逻辑
        ServerPlayer sender = ctx.get().getSender();
        if (sender != null) {
            // 服务端处理
        }
    });
    ctx.get().setPacketHandled(true);
}
```

## 服务端发送广播

```java
// 在 NetworkHandler 类中
public static void broadcast(MyBroadcastMessage msg) {
    CHANNEL.send(PacketDistributor.ALL.noArg(), msg);
}
```

## 常见错误

- ❌ `IMessage` / `IMessageHandler`：那是 1.12 `SimpleNetworkWrapper`。本档用 `SimpleChannel.registerMessage` + encode/decode/handle
- ❌ 在网络线程直接修改世界：所有游戏逻辑必须在 `enqueueWork()` 回调中执行
- ❌ 消息 ID 冲突：每个消息 ID 在同一 channel 中必须唯一
- ❌ `sendToServer()` 在服务端调用：检查 `LogicalSide`

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |

## 进阶同步（区块级 / 插值 / 大包）

> 本节为策略级写法：只列决策与边界，具体类/方法签名一律以 `search_forge_docs`（`networking` / `networking_simpleimpl` / `networking_entities` 页核实数据）为准，不在此编造。

### 可核实锚点：实体与客户端交互（`networking_entities` 页）

- 实体数据分两类：**生成时已知且不变** → 生成包（spawn 数据，`#writeSpawnData` / `#readSpawnData` 控制编解码）；**运行中变化** → 动态数据参数（vanilla 自动同步；数据参数只为你自己的实体定义，`#defineSynchedData` 覆写须先调 `super`）。做自定义包之前先判断这两条路够不够。
- 常见断点：**玩家维度切换**（会话/绑定关系变化导致客户端对不上）、**实体追踪**（只有跟踪范围内的客户端才收到实体数据，跟踪距离外的玩家不该收）——两者都容易让人误以为「包没发出去」。
- 面向实体/区块的同步应走**可靠通道**（SimpleChannel 即 FML 可靠通道，保证送达与顺序语义），并尊重**跟踪距离**：用 `PacketDistributor.TRACKING_ENTITY` / `TRACKING_CHUNK`（见上文 Decision 表格）面向跟踪者分发，而非 `ALL` 无限广播。

### 区块级

- 服务端收到客户端给的区块/方块坐标 → **先做已加载校验**（参考 `networking_simpleimpl` 页防御规则：仅当 `Level#hasChunkAt` 为 true 才访问该处方块/方块实体），否则任意区块生成可被攻击利用。
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
IF 服务端用客户端坐标访问区块 → 先 Level#hasChunkAt 校验
```
