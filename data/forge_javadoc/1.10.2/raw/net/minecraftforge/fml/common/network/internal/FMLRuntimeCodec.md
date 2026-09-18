---
title: "FMLRuntimeCodec"
description: "Called to verify the message received."
package: "net/minecraftforge/fml/common/network/internal"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/internal/FMLRuntimeCodec.html"
sourceType: javadoc
---

# FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec < FMLMessage >
```

## Constructors

- `public FMLRuntimeCodec()`

## Methods

- `public void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLMessage msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLMessage msg)`
- `protected void testMessageValidity( FMLProxyPacket msg)`

## Description

Called to verify the message received.
