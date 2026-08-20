---
name: mc-networking
description: NeoForge 1.20.4 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 1.20.4）

禁止从 Forge 或邻档复制。

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
```

**未核实来源**：`/docs/1.20.4/networking/payload/` 缺页。需要网络 API 时先 `search_neoforge_docs query=networking version=1.20.4`。

禁止：`SimpleChannel` / `IMessage`；把 1.21 的 RegisterPayloadHandlersEvent（复数）当本档；把上述未核实骨架当已核正解。

触发词：Payload、CustomPacketPayload。禁止 SimpleChannel。禁止默写未核实签名。
