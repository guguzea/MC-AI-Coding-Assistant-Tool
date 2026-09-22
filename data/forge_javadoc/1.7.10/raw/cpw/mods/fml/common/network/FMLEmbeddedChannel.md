---
title: "FMLEmbeddedChannel"
description: "public class FMLEmbeddedChannel extends EmbeddedChannel"
package: "cpw/mods/fml/common/network"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/FMLEmbeddedChannel.html"
sourceType: javadoc
---

# FMLEmbeddedChannel

**Inheritance:** java.lang.Object → EmbeddedChannel → cpw.mods.fml.common.network.FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends EmbeddedChannel
```

## Constructors

- `FMLEmbeddedChannel(ModContainer container, java.lang.String channelName, Side source, ChannelHandler... handlers)`
- `FMLEmbeddedChannel(java.lang.String channelName, Side source, ChannelHandler... handlers)`

## Methods

- `java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`
- `Packet generatePacketFrom(java.lang.Object object)` — Utility method to generate a regular packet from a custom packet.
