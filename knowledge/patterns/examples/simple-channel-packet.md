# SimpleChannel 注册一条 C2S（示范）

平台：Forge 1.20.1 · 依赖：mc-networking、`06-networking.mdc`

在 `FMLCommonSetupEvent` 中调用 `NetworkHandler.register()`。消息类需有无参构造；读写用 `FriendlyByteBuf`。

```java
public final class SyncButtonPacket {
    private final BlockPos pos;
    public SyncButtonPacket(BlockPos pos) { this.pos = pos; }
    public SyncButtonPacket(FriendlyByteBuf buf) { this.pos = buf.readBlockPos(); }
    public void encode(FriendlyByteBuf buf) { buf.writeBlockPos(pos); }

    public static void handle(SyncButtonPacket msg, Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> {
            ServerPlayer sp = ctx.get().getSender();
            if (sp == null) return;
            // 服务端校验后改世界/BE
        });
        ctx.get().setPacketHandled(true);
    }
}

// register() 内：
INSTANCE.registerMessage(id++, SyncButtonPacket.class,
    SyncButtonPacket::encode, SyncButtonPacket::new, SyncButtonPacket::handle);
```

客户端发送：`INSTANCE.sendToServer(new SyncButtonPacket(pos));`

常见坑：在消息里存 `Level`/`Player` 引用 → 见 `knowledge/antipatterns/networking.md`；协议版本字符串不一致导致断连 → 双方 `PROTOCOL_VERSION` 保持一致。
