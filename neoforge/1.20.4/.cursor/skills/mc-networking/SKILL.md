---
name: mc-networking
description: NeoForge 1.20.4 mc-networking。类名来自本档核实表、loader-api 反编译摘要与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 1.20.4）

禁止从 Forge 或邻档复制。

# 06 — 网络（NeoForge 1.20.4）

**本档不是 Forge SimpleChannel。** 本库 `search_neoforge_docs` 的 `networking/payload` 页为 `DOC_NOT_FOUND`；下列类名与签名以 **官方 NeoForge 1.20.4 API jar 反编译**为准（`loader-api-summaries/1.20.4-neoforge.json`，`query_loader_api`），**不因缺页降级为未核实**。

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
```

**核实来源**：`1.20.4-neoforge.json`（单数 `RegisterPayloadHandlerEvent`）。禁止 SimpleChannel；禁止把 1.21 复数 Handlers 当本档。
禁止：`SimpleChannel` / `IMessage`；把 1.21 的 RegisterPayloadHandlersEvent（复数）当本档；
触发词：Payload、CustomPacketPayload、`query_loader_api`。
