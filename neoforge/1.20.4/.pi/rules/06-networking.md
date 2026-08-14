---
description: 06 — 网络（NeoForge 1.20.4）
---

# 06 — 网络（NeoForge 1.20.4）

**本档不是 Forge SimpleChannel。** 1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。

## 核实骨架

```java
@SubscribeEvent // mod event bus
public static void register(final RegisterPayloadHandlerEvent event) {
    final IPayloadRegistrar registrar = event.registrar("mymod");
    registrar.play(
        MyData.ID,
        MyData::new,
        handler -> handler
            .client(ClientPayloadHandler.getInstance()::handleData)
            .server(ServerPayloadHandler.getInstance()::handleData));
}

public record MyData(String name, int age) implements CustomPacketPayload {
    public static final ResourceLocation ID = new ResourceLocation("mymod", "my_data");
    public MyData(final FriendlyByteBuf buffer) {
        this(buffer.readUtf(), buffer.readInt());
    }
    @Override public void write(final FriendlyByteBuf buffer) {
        buffer.writeUtf(name());
        buffer.writeInt(age());
    }
    @Override public ResourceLocation id() { return ID; }
}

public void handleData(final MyData data, final PlayPayloadContext context) {
    context.workHandler().submitAsync(() -> { /* main thread */ })
        .exceptionally(e -> {
            context.packetHandler().disconnect(
                Component.translatable("my_mod.networking.failed", e.getMessage()));
            return null;
        });
}
```
来源：https://docs.neoforged.net/docs/1.20.4/networking/ 与 /networking/payload/ （2026-08-15 核对）。

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.21 的 RegisterPayloadHandlersEvent（复数） 抄进 NeoForge 1.20.4
- `NeoForgeAddonPlugin`

本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
