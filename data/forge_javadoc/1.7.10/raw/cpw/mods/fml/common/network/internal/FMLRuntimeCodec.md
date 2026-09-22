---
title: "FMLRuntimeCodec"
description: "public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>"
package: "cpw/mods/fml/common/network/internal"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/internal/FMLRuntimeCodec.html"
sourceType: javadoc
---

# FMLRuntimeCodec

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.FMLIndexedMessageToMessageCodec<FMLMessage> → cpw.mods.fml.common.network.internal.FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>
```

## Methods

- `void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLMessage msg)`
- `void encodeInto(ChannelHandlerContext ctx, FMLMessage msg, ByteBuf target)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `FMLRuntimeCodec`
