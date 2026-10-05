---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleChannel。触发词：网络、消息、Network、SimpleChannel、PacketDistributor、FriendlyByteBuf
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# 网络通信（Forge 1.20.4）

## 快速开始

⚠️ 1.20.4（Forge 49）**没有** `NetworkRegistry.newSimpleChannel` / `NetworkEvent` / `net.minecraftforge.network.simple.SimpleChannel`；那是 1.20.1 的写法。本档用 `ChannelBuilder` + `net.minecraftforge.network.SimpleChannel`。

```java
import net.minecraft.resources.ResourceLocation;
import net.minecraftforge.network.ChannelBuilder;
import net.minecraftforge.network.SimpleChannel;

// 创建通道
private static final int PROTOCOL_VERSION = 1;
public static final SimpleChannel CHANNEL = ChannelBuilder
    .named(new ResourceLocation(MOD_ID, "main"))
    .networkProtocolVersion(PROTOCOL_VERSION)
    .simpleChannel();

// 注册消息 + 处理器（在 FMLCommonSetupEvent 中调用）
public static void register() {
    CHANNEL.messageBuilder(MyMessage.class)
        .encoder(MyMessage::encode)
        .decoder(MyMessage::new)
        .consumerMainThread(ModNetwork::handle)
        .add();
}
```

## Decision: 选择数据包方向

```
IF 客户端 → 服务端（玩家发起）
   → CHANNEL.send(msg, PacketDistributor.SERVER.noArg())

IF 服务端 → 玩家（精准发送）
   → CHANNEL.send(msg, PacketDistributor.PLAYER.with(player))

IF 服务端 → 全服广播
   → CHANNEL.send(msg, PacketDistributor.ALL.noArg())

IF 服务端 → 区域内所有玩家
   → CHANNEL.send(msg, PacketDistributor.TRACKING_ENTITY.with(entity))
```

> `with(...)` 直接收对象（1.20.1 是收 `Supplier`）；无参目标用 `.noArg()`。

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
// 签名固定为 (MSG, CustomPayloadEvent.Context)；用 consumerMainThread 注册即保证主线程
public static void handle(MyMessage msg, CustomPayloadEvent.Context ctx) {
    ServerPlayer sender = ctx.getSender();
    if (sender != null) {
        // 服务端处理（此处已在主线程，可直接动世界）
    }
    ctx.setPacketHandled(true);
}
```

## 服务端发送广播

```java
// 在 ModNetwork 类中
public static void broadcast(MyBroadcastMessage msg) {
    CHANNEL.send(msg, PacketDistributor.ALL.noArg());
}
```

## 常见错误

- ❌ `NetworkRegistry.newSimpleChannel` / `NetworkEvent` / `network.simple.SimpleChannel`：**1.20.4 已删除**，本档用 `ChannelBuilder` + `net.minecraftforge.network.SimpleChannel`
- ❌ `IMessage` / `IMessageHandler`：那是 1.12 `SimpleNetworkWrapper`
- ❌ 在非主线程直接修改世界：注册消息时用 `.consumerMainThread(...)`
- ❌ 显式 discriminator 冲突：不传 discriminator 时由 `messageBuilder(Class)` 自动分配
- ❌ `PacketDistributor.PLAYER.with(() -> player)`：本档直接 `with(player)`

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |

## 进阶同步（区块级 / 插值 / 大包）

> 本节为策略级写法：只列决策与边界，具体类/方法签名一律以 `query_loader_api platform=forge minecraftVersion=1.20.4` 的逐签名摘要为准。⚠️ 上游 `networking_simpleimpl` 页仍是 1.20–1.20.1 的旧 SimpleImpl 写法（`NetworkRegistry.newSimpleChannel`），**本档不要照抄那一页的通道/注册代码**；`networking_entities`（spawn 数据 / `defineSynchedData`）仍适用。

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
