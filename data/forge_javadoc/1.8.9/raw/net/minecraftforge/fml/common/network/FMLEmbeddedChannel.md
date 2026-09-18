---
title: "FMLEmbeddedChannel"
description: "Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling."
package: "net/minecraftforge/fml/common/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/FMLEmbeddedChannel.html"
sourceType: javadoc
---

# FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends EmbeddedChannel
```

## Constructors

- `public FMLEmbeddedChannel(java.lang.String channelName, Side source, ChannelHandler... handlers)`
- `public FMLEmbeddedChannel( ModContainer container, java.lang.String channelName, Side source, ChannelHandler... handlers)`

## Methods

- `public Packet <?> generatePacketFrom(java.lang.Object object)`
- `public java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`

## Description

Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling.
