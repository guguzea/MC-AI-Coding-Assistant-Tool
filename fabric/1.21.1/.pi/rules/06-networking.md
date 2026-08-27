---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Fabric 1.21.1

## 约束

- Yarn：`CustomPayload` + `PayloadTypeRegistry.playC2S()` / `playS2C()` + `ServerPlayNetworking` / `ClientPlayNetworking`
- 不要 `ClientSidePacketRegistry`、`FabricPacket`、`PayloadTypeRegistry.s2c()` / `c2s()`、`CustomPayloadRegistry`
- 不要把 26.1 文档里的 `clientboundPlay()` / `CustomPacketPayload` / `net.minecraft.resources.Identifier` 抄到本档（Yarn 1.21.x 不是那套名字）
- S2C 接收器放在 `ClientModInitializer`
- Identifier 用 `net.minecraft.util.Identifier` 与 `Identifier.of`

## Decision Flow

```
IF S2C → PayloadTypeRegistry.playS2C().register + 客户端 registerGlobalReceiver
IF C2S → PayloadTypeRegistry.playC2S().register + 服务端 registerGlobalReceiver
```

## 示例

```java
import net.minecraft.network.RegistryByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;
import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;

public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(Identifier.of(MOD_ID, "my_packet"));
    public static final PacketCodec<RegistryByteBuf, MyPayload> CODEC =
        PacketCodec.tuple(PacketCodecs.VAR_INT, MyPayload::data, MyPayload::new);

    @Override
    public Id<? extends CustomPayload> getId() {
        return ID;
    }
}

PayloadTypeRegistry.playC2S().register(MyPayload.ID, MyPayload.CODEC);
PayloadTypeRegistry.playS2C().register(MyPayload.ID, MyPayload.CODEC);

ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
});
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
});

ServerPlayNetworking.send(player, new MyPayload(value));
ClientPlayNetworking.send(new MyPayload(value));
```

## 常见错误

- 不要用 `PayloadTypeRegistry.s2c()` / `clientboundPlay()`（后者是 26.1 Mojmap）
- 不要用 `CustomPayloadRegistry` 或 `FabricPacket`
- 不要在 `onInitialize()` 注册客户端接收器

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 数据同步 |
| `mc-entity` | 实体状态同步 |
