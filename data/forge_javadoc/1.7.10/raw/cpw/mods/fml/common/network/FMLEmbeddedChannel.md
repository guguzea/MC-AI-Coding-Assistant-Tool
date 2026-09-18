---
title: "FMLEmbeddedChannel"
description: "Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling."
package: "cpw/mods/fml/common/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/FMLEmbeddedChannel.html"
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

- `public Packet generatePacketFrom(java.lang.Object object)`
- `public java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`

## Description

Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling.
