---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- Fabric 网络使用 `Identifier` 作为包 ID
- 客户端只能向服务端发送数据包，服务端可以向客户端发送
- 网络包必须是确定性的（不含随机或非确定性状态）
- `network` 必须在 `fabric.mod.json` 中声明
- 使用 `Identifier` 作为包 ID 命名空间

---

## Decision Flow

### Decision: 选择网络通信方式

```
IF 服务端向客户端单向推送数据
  → ServerSidePacketRegistry.register()

IF 客户端向服务端单向请求
  → ClientSidePacketRegistry.register()

IF 需要双向通信
  → 分别为服务端和客户端注册不同的包处理器

IF 使用 Fabric API 网络模块
  → fabric-entity-dragon-v0 或 fabric-networking-v0
```

---

## 基础网络注册

```java
// C2S: 客户端向服务端
// S2C: 服务端向客户端

public class MyNetworking {
    // 包 ID
    public static final Identifier MY_PACKET_ID =
        new Identifier(MOD_ID, "my_packet");

    // C2S 注册（客户端发送，服务端接收）
    public static final ClientSidePacketRegistry CLIENT_PACKET_REGISTRY =
        ClientSidePacketRegistry.INSTANCE;

    public static void registerServerReceivers() {
        CLIENT_PACKET_REGISTRY.register(MY_PACKET_ID, (packetContext, attachedData) -> {
            packetContext.getTaskQueue().execute(() -> {
                // 在服务端线程执行
                ServerPlayerEntity player = packetContext.getPlayer();
                int value = attachedData.readInt();
                // 处理数据包
            });
        });
    }

    // S2C 注册（服务端发送，客户端接收）
    public static void registerClientReceivers() {
        ServerSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, attachedData) -> {
            packetContext.getTaskQueue().execute(() -> {
                // 在客户端线程执行
            });
        });
    }
}
```

## 发送数据包

```java
// 服务端向客户端发送
public void sendToClient(ServerPlayerEntity player, int value) {
    ServerSidePacketRegistry.INSTANCE.sendToPlayer(player,
        MY_PACKET_ID, PacketByteBuf.createUnpooled().writeInt(value));
}

// 客户端向服务端发送
public void sendToServer(int value) {
    ClientSidePacketRegistry.INSTANCE.sendToServer(MY_PACKET_ID,
        PacketByteBuf.createUnpooled().writeInt(value));
}
```

## fabric.mod.json 配置

```json
{
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"],
    "client": ["com.example.examplemod.ExampleModClient"]
  },
  "mixins": ["examplemod.mixins.json"]
}
```

## 客户端入口点（网络初始化）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 注册客户端接收器
        MyNetworking.registerClientReceivers();

        // 注册快捷键
        KeyBindingHelper.registerKeyBinding(new KeyBinding(
            "key.examplemod.open_gui",
            InputUtil.Type.KEYSYM,
            InputUtil.Type.KEYSYM.createFromCode(80),  // P 键
            "category.examplemod"
        ));

        // 快捷键回调
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            while (KeyBindings.OPEN_GUI.isPressed()) {
                // 打开 GUI 并发送网络包
                sendToServer(value);
            }
        });
    }
}
```

## 使用 Fabric Networking API

```groovy
// build.gradle
modImplementation "net.fabricmc.fabric-api:fabric-networking-v0:0.1.3+build.7"
```

## 常见错误

- ❌ 在非主线程处理网络数据 — 使用 `packetContext.getTaskQueue().execute()`
- ❌ 忘记在 `fabric.mod.json` 中注册 entrypoint — 网络回调不生效
- ❌ 在服务端处理客户端数据时修改世界状态 — 确认线程安全
- ❌ 包 ID 命名空间不一致 — 服务端和客户端 ID 必须完全相同
- ❌ 在 `onInitialize()` 中注册客户端网络 — 应在 `ClientModInitializer.onInitializeClient()` 中

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-item` | 物品使用触发网络包 |
| `mc-entity` | 实体状态通过网络同步 |
