---
title: "FMLRuntimeCodec"
description: "Called to verify the message received."
package: "cpw/mods/fml/common/network/internal"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/internal/FMLRuntimeCodec.html"
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
