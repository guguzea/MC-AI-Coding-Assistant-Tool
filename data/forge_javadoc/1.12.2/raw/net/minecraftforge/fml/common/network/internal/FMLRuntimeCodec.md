---
title: "FMLRuntimeCodec"
description: "Called to verify the message received."
package: "net/minecraftforge/fml/common/network/internal"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/internal/FMLRuntimeCodec.html"
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

- `public void encodeInto(ChannelHandlerContext ctx, FMLMessage msg, ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLMessage msg)`
- `protected void testMessageValidity( FMLProxyPacket msg)`

## Description

Called to verify the message received.
