---
title: "FMLRuntimeCodec"
description: "public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/internal/FMLRuntimeCodec.html"
sourceType: javadoc
---

# FMLRuntimeCodec

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<FMLMessage> → net.minecraftforge.fml.common.network.internal.FMLRuntimeCodec

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
