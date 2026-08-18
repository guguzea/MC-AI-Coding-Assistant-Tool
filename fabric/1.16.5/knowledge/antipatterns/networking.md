# 网络通信反模式（Fabric 1.16.5）

## 症状

- 网络包不发送、两端对不上、在错误线程改世界

## 根因

### 1. 仍用已移除的 ClientSidePacketRegistry

```java
// ❌
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (ctx, buf) -> { });

// ✅ fabric-networking-api-v1
ServerPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (server, player, handler, buf, responseSender) -> {
    int value = buf.readInt();
    server.execute(() -> { /* 主线程 */ });
});
```

### 2. 在 common 入口注册 S2C

```java
// ❌ 在 ModInitializer.onInitialize 注册客户端接收器
// ✅ 放到 ClientModInitializer.onInitializeClient
ClientPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (client, handler, buf, responseSender) -> {
    client.execute(() -> { });
});
```

### 3. 包 ID 不一致 / 读写顺序不一致

两端 Identifier 必须相同；`writeInt` 对应 `readInt`，顺序不能对调。
