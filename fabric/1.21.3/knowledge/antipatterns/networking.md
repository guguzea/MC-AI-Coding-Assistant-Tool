# 网络通信反模式（Fabric 1.21.3）

## 症状

- 包发不出去、类型未注册、把 26.1 Mojmap 名抄进 Yarn 工程

## 根因

### 1. 错误：不要再用 ClientSidePacketRegistry / FabricPacket

```java
// ❌
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (ctx, buf) -> { });

// ✅ Yarn 1.21.x
PayloadTypeRegistry.playC2S().register(MyPayload.ID, MyPayload.CODEC);
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> { });
```

### 2. 方法名抄成 26.1

不要 `PayloadTypeRegistry.s2c()` / `clientboundPlay()` / `CustomPacketPayload` / `net.minecraft.resources.Identifier`。
本档用 `playC2S` / `playS2C`、`CustomPayload`、`Identifier.of`。

### 3. 在 onInitialize 注册 S2C 接收器

S2C 必须在 `ClientModInitializer`。
