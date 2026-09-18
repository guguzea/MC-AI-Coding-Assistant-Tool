---
title: "FMLEmbeddedChannel"
description: "Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling."
package: "net/minecraftforge/fml/common/network"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/FMLEmbeddedChannel.html"
sourceType: javadoc
---

# FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends io.netty.channel.embedded.EmbeddedChannel
```

## Constructors

- `public FMLEmbeddedChannel(java.lang.String channelName, Side source, io.netty.channel.ChannelHandler... handlers)`
- `public FMLEmbeddedChannel( ModContainer container, java.lang.String channelName, Side source, io.netty.channel.ChannelHandler... handlers)`

## Methods

- `public Packet <?> generatePacketFrom(java.lang.Object object)`
- `public java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends io.netty.channel.ChannelHandler> type)`

## Description

Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling.
