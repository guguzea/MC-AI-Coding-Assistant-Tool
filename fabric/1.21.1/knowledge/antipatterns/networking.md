# 网络通信相关反模式

## ⚠️ 1.21 重大变化

Fabric 1.21+ 移除了 `fabric-networking-api-v1`，使用新的 **PayloadTypeRegistry** 系统。

## ❌ 使用旧版网络 API

**症状**：网络包不发送/接收

**原因**：使用了 1.21.1 不推荐的网络 API

```java
// ❌ 错误：使用旧版 API（1.20.x）
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (ctx, buf) -> {
    // 旧版 API
});

// ✅ 正确：使用 1.21.x 新版 API
public class MyPacket implements CustomPayload {
    public static final CustomPayload.Id<MyPacket> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    // ...
}
```

## ❌ 在错误的入口点注册网络

**症状**：网络回调不触发

**原因**：网络注册放在了错误的入口点

```java
// ❌ 错误：在主入口点注册客户端网络
public class ExampleMod implements FabricMod {
    @Override
    public void onInitialize() {
        ClientPlayNetworking.register(...);  // 服务端没有 ClientPlayNetworking！
    }
}

// ✅ 正确：在客户端入口点注册
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ClientPlayNetworking.register(...);  // 正确
    }
}
```

## ❌ 服务端和客户端 mod ID 不一致

**症状**：网络包无法识别

**原因**：两端使用了不同的命名空间

```java
// ❌ 错误：客户端和服务端使用不同的 ID
// 客户端
new Identifier("mymod", "my_packet")  // 小写
// 服务端
new Identifier("MyMod", "my_packet")   // 大写！

// ✅ 正确：两端使用完全相同的 ID
private static final Identifier MY_PACKET_ID = new Identifier("mymod", "my_packet");
```

## ❌ 在非主线程处理网络数据

**症状**：数据不一致、崩溃

**原因**：网络数据处理应在主线程

```java
// ❌ 错误
@Environment(EnvType.SERVER)
public static void receive(MinecraftServer server, ServerPlayerEntity player,
                           PacketByteBuf buf, PacketSender responseSender) {
    new Thread(() -> {  // 禁止在新线程中处理
        modifyWorldData(server.getOverworld());
    }).start();
}

// ✅ 正确：1.21.x 回调已在主线程执行，直接处理
@Env(EnvType.SERVER)
public static void receive(MinecraftServer server, ServerPlayerEntity player,
                           PacketByteBuf buf, PacketSender responseSender) {
    modifyWorldData(server.getOverworld());  // 直接处理
}
```

## ❌ 忘记序列化/反序列化

**症状**：数据包为空或数据损坏

**原因**：`FriendlyByteBuf` 的读写顺序不一致

```java
// ❌ 错误：读写顺序不一致
// 发送
buf.writeInt(value1);
buf.writeString(value2);

// 接收
int value2 = buf.readInt();      // 顺序错误！
String value1 = buf.readString();

// ✅ 正确：读写顺序一致
// 发送
buf.writeInt(value1);
buf.writeString(value2);

// 接收
int value1 = buf.readInt();      // 顺序一致
String value2 = buf.readString();
```

## ❌ 包 ID 格式错误

**症状**：包无法识别

**原因**：CustomPayload ID 格式错误

```java
// ❌ 错误
public static final CustomPayload.Id<MyPacket> ID =
    new CustomPayload.Id<>(new Identifier("mymod-my-packet"));  // 横杠在 mod ID 中

// ✅ 正确
public static final CustomPayload.Id<MyPacket> ID =
    new CustomPayload.Id<>(new Identifier("mymod", "my_packet"));  // Identifier 构造
```
