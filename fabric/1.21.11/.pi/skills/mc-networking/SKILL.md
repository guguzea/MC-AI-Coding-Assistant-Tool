---
name: mc-networking
description: Fabric 网络通信。PayloadTypeRegistry、CustomPayload、ServerPlayNetworking。触发词：网络、Networking、CustomPayload、PayloadTypeRegistry
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.21.11）

1.21+ 用 `CustomPayload` + `PayloadTypeRegistry.playC2S()` / `playS2C()`。不要用 `ClientSidePacketRegistry`、`FabricPacket`、`PayloadTypeRegistry.s2c()`。

## 定义 Payload

```java
import net.minecraft.network.RegistryByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;

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
```

## 注册与收发

```java
import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;

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

Yarn 类名是 `net.minecraft.util.Identifier` 与 `CustomPayload`；工厂用 `Identifier.of`，不要 `net.minecraft.resources.Identifier`。

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 数据同步 |
| `mc-entity` | 实体状态同步 |
