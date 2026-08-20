---
description: 06 — 网络（NeoForge 1.20.4）
---

# 06 — 网络（NeoForge 1.20.4）

**本档不是 Forge SimpleChannel。** 1.20.4 的 `networking/payload` 页在本库为 `DOC_NOT_FOUND`；下列骨架仅反映**当时常见文档写法**（单数 `RegisterPayloadHandlerEvent`），**未核实**，禁止当已核 API 默写。

## 未核实骨架（勿当正解）

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

**未核实来源**：`/docs/1.20.4/networking/payload/` 缺页。需要网络 API 时先 `search_neoforge_docs query=networking version=1.20.4`。

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.21 的 RegisterPayloadHandlersEvent（复数） 抄进 NeoForge 1.20.4
- `NeoForgeAddonPlugin`
- 把上述未核实骨架当已核正解

本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
