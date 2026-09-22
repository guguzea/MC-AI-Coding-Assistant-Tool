# FMLEmbeddedChannel

**Inheritance:** java.lang.Object → EmbeddedChannel → net.minecraftforge.fml.common.network.FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends EmbeddedChannel
```

## Constructors

- `FMLEmbeddedChannel(ModContainer container, java.lang.String channelName, Side source, ChannelHandler... handlers)`
- `FMLEmbeddedChannel(java.lang.String channelName, Side source, ChannelHandler... handlers)`

## Methods

- `java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`
- `Packet<?> generatePacketFrom(java.lang.Object object)` — Utility method to generate a regular packet from a custom packet.