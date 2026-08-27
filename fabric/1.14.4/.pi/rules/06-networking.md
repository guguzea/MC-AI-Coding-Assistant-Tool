---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- 包 ID 用 Yarn `net.minecraft.util.Identifier`
- 本档默认教程是 **networking v0**：`net.fabricmc.fabric.api.network.ClientSidePacketRegistry` / `ServerSidePacketRegistry`（[FAPI javadoc](https://maven.fabricmc.net/docs/fabric-api-0.74.1+1.19.4/net/fabricmc/fabric/api/network/ServerSidePacketRegistry.html) 仍写明职责；1.14 同期就是这套）
- **C2S 接收**在服务端：`ServerSidePacketRegistry.INSTANCE.register`
- **S2C 接收**在客户端：`ClientSidePacketRegistry.INSTANCE.register`（`ClientModInitializer`）
- **C2S 发送**：`ClientSidePacketRegistry.INSTANCE.sendToServer(id, buf)`
- **S2C 发送**：`ServerSidePacketRegistry.INSTANCE.sendToPlayer(player, id, buf)`
- 回调在网络线程：用 `packetContext.getTaskQueue().execute(...)`（loader-api：`PacketContext#getTaskQueue`，不是 `queue()`）
- 不要编造 `PacketByteBuf.createUnpooled()`（Yarn `PacketByteBuf` 无此静态方法）。写 `new PacketByteBuf(Unpooled.buffer())`
- 不要抄 1.16+ 当默认：`ServerPlayNetworking` / `PayloadTypeRegistry`。loader-api 摘要里若出现 `networking.v1`，只在工程 **确实依赖带 v1 的 FAPI jar** 时再用
- 依赖写完整 `fabric-api`，不要钉死 `fabric-networking-v0:0.1.3+...`，也不要编造 `fabric-entity-dragon-v0`
- `fabric.mod.json` **没有** `network` 键；不需要为发包专门加 mixin

---

## Decision Flow

### Decision: 选择网络通信方式

```
IF 服务端向客户端推送（S2C）
  → 客户端 ClientSidePacketRegistry.INSTANCE.register
  → 服务端 ServerSidePacketRegistry.INSTANCE.sendToPlayer

IF 客户端向服务端请求（C2S）
  → 服务端 ServerSidePacketRegistry.INSTANCE.register（ModInitializer）
  → 客户端 ClientSidePacketRegistry.INSTANCE.sendToServer

IF 需要双向
  → 两端分别 register；发送用上面两套 send*

IF 工程 FAPI 已是 networking-api-v1
  → 才改用 ServerPlayNetworking / ClientPlayNetworking；不要和 v0 混用
```

---

## 基础网络注册

```java
import io.netty.buffer.Unpooled;
import net.minecraft.util.PacketByteBuf;
import net.fabricmc.fabric.api.network.ClientSidePacketRegistry;
import net.fabricmc.fabric.api.network.ServerSidePacketRegistry;

public class MyNetworking {
    public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

    // C2S：服务端接收（主入口）
    public static void registerServerReceivers() {
        ServerSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
            int value = buf.readInt();
            packetContext.getTaskQueue().execute(() -> {
                ServerPlayerEntity player = (ServerPlayerEntity) packetContext.getPlayer();
                // 主线程处理
            });
        });
    }

    // S2C：客户端接收
    public static void registerClientReceivers() {
        ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
            int value = buf.readInt();
            packetContext.getTaskQueue().execute(() -> {
                // 客户端主线程
            });
        });
    }
}
```

`PacketRegistry#register(Identifier, PacketConsumer)` 与 `PacketConsumer#accept(PacketContext, PacketByteBuf)` 已核 loader-api。

## 发送数据包

```java
public void sendToClient(ServerPlayerEntity player, int value) {
    PacketByteBuf buf = new PacketByteBuf(Unpooled.buffer());
    buf.writeInt(value);
    ServerSidePacketRegistry.INSTANCE.sendToPlayer(player, MY_PACKET_ID, buf);
}

public void sendToServer(int value) {
    PacketByteBuf buf = new PacketByteBuf(Unpooled.buffer());
    buf.writeInt(value);
    ClientSidePacketRegistry.INSTANCE.sendToServer(MY_PACKET_ID, buf);
}
```

## 客户端入口点（网络初始化）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        MyNetworking.registerClientReceivers();

        KeyBindingRegistry.INSTANCE.add(new KeyBinding(
            "key.examplemod.open_gui",
            InputUtil.Type.KEYSYM,
            80, // GLFW_KEY_P；Yarn KeyBinding(String, Type, int, String)
            "category.examplemod"
        ));
    }
}
```

Yarn 1.14.4 `KeyBinding` 四参最后一参是 **int code**，不要把 `InputUtil.Type.KEYSYM.createFromCode(80)`（返回 `KeyCode`）塞进第三参。

## 常见错误

- ❌ 把 C2S `register` 写在 `ClientSidePacketRegistry` — 那是 **S2C 接收**
- ❌ 把 S2C `register` 写在 `ServerSidePacketRegistry` — 那是 **C2S 接收**
- ❌ `packetContext.queue()` — 本档是 `getTaskQueue().execute`
- ❌ `PacketByteBuf.createUnpooled()` / `ServerPlayNetworking.send` 当 v0 教程
- ❌ 在网络线程改世界
- ❌ 在 `onInitialize()` 注册 S2C 接收器
- ❌ 包 ID 两端不一致

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-item` | 物品使用触发网络包 |
| `mc-entity` | 实体状态通过网络同步 |
