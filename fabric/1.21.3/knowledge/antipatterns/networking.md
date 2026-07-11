# 网络通信反模式（Fabric 1.21.3）

## 症状

- 网络包不发送
- 客户端/服务端通信失败
- 数据包内容不一致
- 游戏崩溃（非法数据包）

## 根因分析

### 1. 在非主线程处理数据

**错误代码：**
```java
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
    // ❌ 直接在回调中修改世界状态
    world.setBlockState(pos, Blocks.DIAMOND.getDefaultState());
});
```

**正确方案：**
```java
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
    packetContext.queue(() -> {  // ✅ 在主线程执行
        world.setBlockState(pos, Blocks.DIAMOND.getDefaultState());
    });
});
```

### 2. 忘记在客户端 entrypoint 注册

**错误代码：**
```java
// ❌ 在 FabricMod.onInitialize() 中注册客户端接收器
public class ExampleMod implements FabricMod {
    @Override
    public void onInitialize() {
        // ❌ 客户端网络接收器不应该在这里注册
        ClientSidePacketRegistry.INSTANCE.register(...);  // 服务端启动崩溃！
    }
}
```

**正确方案：**
```java
// ✅ 在 ClientModInitializer 中注册
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ClientSidePacketRegistry.INSTANCE.register(...);  // 正确
    }
}
```

### 3. 包 ID 命名空间不一致

**错误代码：**
```java
// 客户端
Identifier MY_PACKET = new Identifier(MOD_ID, "my_packet");

// 服务端
Identifier MY_PACKET = new Identifier("other_mod", "my_packet");  // ❌ 命名空间不同！
```

### 4. PacketByteBuf 序列化顺序不匹配

**错误代码：**
```java
// 发送端
buf.writeInt(value);
buf.writeString(text);

// 接收端
int value = buf.readString();  // ❌ 顺序不匹配！
int text = buf.readInt();
```

**正确方案：**
```java
// 发送端
buf.writeInt(value);
buf.writeString(text);

// 接收端
int value = buf.readInt();  // ✅ 顺序一致
String text = buf.readString();
```

## ⚠️ 1.21 重大变化：PayloadTypeRegistry 系统

**Fabric 1.21+ 移除了 `fabric-networking-api-v1` 兼容层，使用新的 `PayloadTypeRegistry` 系统。**

### 新旧 API 对比

```java
// ❌ 旧 API（1.20.x）- 已废弃
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, ...);
ServerSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, ...);
ServerPlayNetworking.send(player, MY_PACKET_ID, buf);
ClientPlayNetworking.send(MY_PACKET_ID, buf);

// ✅ 新 API（1.21.x）- PayloadTypeRegistry
public class MyPacket implements CustomPayload {
    public static final CustomPayload.Id<MyPacket> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    // 编码
    public MyPacket(FriendlyByteBuf buf) {
        this.value = buf.readInt();
    }

    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.value);
    }

    @Override
    public Id<? extends CustomPayload> getId() {
        return ID;
    }
}
```

### 注册 Payload 类型

```java
// ✅ 1.21.x 方式：在 onInitialize 中注册
public class ExampleMod implements FabricMod {
    public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

    @Override
    public void onInitialize() {
        // 注册 C2S payload 类型
        PayloadTypeRegistry.c2s(CustomPayloadRegistry.INSTANCE.get(buf -> {
            int value = buf.readInt();
            // 处理
        }));

        // 或者使用完整类型
        PayloadTypeRegistry.c2s(
            PayloadType.Builder.of(MyPacket.ID, buf -> new MyPacket(buf)).build()
        );
    }
}
```

### 发送 Payload

```java
// 服务端向客户端发送
ServerPlayNetworking.withLocks(player.getServer(), locks, (server, handle) -> {
    handle.send(MyPacket.ID, new MyPacket(value));
});

// 客户端向服务端发送
ClientPlayNetworking.send(MyPacket.ID, new MyPacket(value));
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| 是否在主线程 | 使用 `packetContext.queue()` |
| 客户端/服务端分离 | 客户端网络在 ClientModInitializer |
| 包 ID 一致性 | 对比客户端和服务端 Identifier |
| 序列化顺序 | 对比读写顺序 |
| 1.21+ API | 使用 `PayloadTypeRegistry` 而非旧版 Registry |
