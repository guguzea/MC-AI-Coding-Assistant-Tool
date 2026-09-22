---
title: "FMLEmbeddedChannel"
description: "public class FMLEmbeddedChannel extends EmbeddedChannel"
package: "net/minecraftforge/fml/common/network"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/FMLEmbeddedChannel.html"
sourceType: javadoc
---

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

- `void cleanAttributes()`
- `java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`
- `Packet<?> generatePacketFrom(java.lang.Object object)` — Utility method to generate a regular packet from a custom packet.
