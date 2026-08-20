---
description: 06 — 网络（NeoForge 1.20.4）
---

# 06 — 网络（NeoForge 1.20.4）

**本档不是 Forge SimpleChannel。** 本库 `search_neoforge_docs` 的 `networking/payload` 页为 `DOC_NOT_FOUND`；下列类名与签名以 **官方 NeoForge 1.20.4 API jar 反编译**为准（`mcp-server/data/loader-api-summaries/1.20.4-neoforge.json`，`query_loader_api` / `decompile-loader-apis.mjs`），**不因缺页降级为未核实**。

## 核实骨架（jar 反编译）

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

**核实来源**：`1.20.4-neoforge.jar` → `loader-api-summaries/1.20.4-neoforge.json`（含单数 `RegisterPayloadHandlerEvent`、`IPayloadRegistrar`、`PlayPayloadContext`）。文档缺页时用 `query_loader_api platform=neoforge minecraftVersion=1.20.4` 核 FQCN，不要标成未核实。

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.21 的 RegisterPayloadHandlersEvent（复数） 抄进 NeoForge 1.20.4
- `NeoForgeAddonPlugin`

本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。
