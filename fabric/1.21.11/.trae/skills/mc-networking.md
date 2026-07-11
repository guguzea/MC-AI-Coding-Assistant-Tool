---
name: mc-networking
description: Fabric 网络通信。PayloadTypeRegistry、CustomPayload、ServerPlayNetworking。触发词：网络、Networking、CustomPayload、PayloadTypeRegistry
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.21.11）

## ⚠️ 重要：1.21.x 网络 API 重大变化

**从 1.21 开始，Fabric 网络系统完全重构：**
- ❌ `ClientSidePacketRegistry` / `ServerSidePacketRegistry` 已被**移除**
- ❌ `FabricPacket` 接口已被**移除**
- ✅ 使用 `CustomPayload` 接口 + `PayloadTypeRegistry` + `PacketType`
- ✅ 使用 `ServerPlayNetworking` / `ClientPlayNetworking` 注册接收器

## 快速开始

### 步骤 1：定义 Payload

```java
public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    // 解码（从 buf 构造）
    public static MyPayload read(FriendlyByteBuf buf) {
        return new MyPayload(buf.readInt());
    }

    // 编码
    @Override
    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.data);
    }
}
```

### 步骤 2：注册 Payload 类型（在 onInitialize 中）

```java
// 服务端注册 S2C 类型（服务端 → 客户端）
PayloadTypeRegistry.s2c().register(MyPayload.ID, MyPayload::read);

// 客户端注册 C2S 类型（客户端 → 服务端）
PayloadTypeRegistry.c2s().register(MyPayload.ID, MyPayload::read);
```

### 步骤 3：注册接收器并发送

**服务端：**
```java
// 在 onInitialize() 中注册 C2S 接收器
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
    ServerPlayerEntity player = context.getPlayer();
    // 直接处理，无需 queue
});

// 发送 S2C 给客户端
ServerPlayNetworking.send(player, MyPayload.ID, new MyPayload(value));
```

**客户端：**
```java
// 在 ClientModInitializer.onInitializeClient() 中注册 S2C 接收器
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
    // 处理来自服务端的数据
});

// 发送 C2S 给服务端
ClientPlayNetworking.send(MyPayload.ID, new MyPayload(value));
```

## Decision: 选择通信方向

```
IF 客户端 → 服务端（C2S）
  → 在服务端注册接收器：ServerPlayNetworking.registerGlobalReceiver()
  → 客户端发送：ClientPlayNetworking.send()
  → 注册类型：PayloadTypeRegistry.c2s()

IF 服务端 → 客户端（S2C）
  → 在客户端注册接收器：ClientPlayNetworking.registerGlobalReceiver()
  → 服务端发送：ServerPlayNetworking.send()
  → 注册类型：PayloadTypeRegistry.s2c()

IF 需要双向通信
  → 两端分别注册接收器
  → 两端都要注册 PayloadType
```

## 常见错误

- ❌ 使用旧的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry` — 1.21.x 已移除
- ❌ 使用旧的 `FabricPacket` 接口 — 改用 `CustomPayload` record
- ❌ 在 `PacketByteBuf` 中使用 `writeInt()` 后用 `readString()` 读取 — 序列化顺序必须一致
- ❌ 在非主线程处理数据 — 新 API 回调已在正确线程执行
- ❌ 忘记在客户端 entrypoint 注册 — 客户端接收器不生效

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-entity` | 网络用于实体状态同步 |
| `mc-registry` | 网络同步自定义 Registry 数据 |
