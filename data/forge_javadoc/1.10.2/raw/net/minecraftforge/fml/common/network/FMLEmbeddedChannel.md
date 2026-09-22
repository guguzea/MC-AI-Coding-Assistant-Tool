---
title: "FMLEmbeddedChannel"
description: "public class FMLEmbeddedChannel extends io.netty.channel.embedded.EmbeddedChannel"
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/FMLEmbeddedChannel.html"
sourceType: javadoc
---

# FMLEmbeddedChannel

**Inheritance:** java.lang.Object → io.netty.util.DefaultAttributeMap → io.netty.channel.AbstractChannel → io.netty.channel.embedded.EmbeddedChannel → net.minecraftforge.fml.common.network.FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends io.netty.channel.embedded.EmbeddedChannel
```

## Constructors

- `FMLEmbeddedChannel(ModContainer container, java.lang.String channelName, Side source, io.netty.channel.ChannelHandler... handlers)`
- `FMLEmbeddedChannel(java.lang.String channelName, Side source, io.netty.channel.ChannelHandler... handlers)`

## Methods

- `java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends io.netty.channel.ChannelHandler> type)`
- `Packet<?> generatePacketFrom(java.lang.Object object)` — Utility method to generate a regular packet from a custom packet.
