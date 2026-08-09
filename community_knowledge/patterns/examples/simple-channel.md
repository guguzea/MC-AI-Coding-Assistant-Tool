# SimpleChannel：最小 C2S 包

- **平台**：Forge 1.20.1
- **Skill**：`mc-networking`
- **MCP**：`generate_network_packet`、`search_forge_docs`

```java
public static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MODID, "main"), () -> "1", s -> true, s -> true);

public static void register() {
    int id = 0;
    CHANNEL.messageBuilder(ExamplePacket.class, id++)
        .encoder(ExamplePacket::encode)
        .decoder(ExamplePacket::decode)
        .consumerMainThread(ExamplePacket::handle)
        .add();
}
```

## 坑

- 协议版本字符串两端都要匹配
- 写盘/改世界只在服务端 handler
- 1.21 NeoForge 请改用 `CustomPacketPayload` + `StreamCodec`（`generate_network_packet` platform=neoforge_1.21）
