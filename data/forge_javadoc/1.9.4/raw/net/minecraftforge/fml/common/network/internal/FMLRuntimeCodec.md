---
title: "FMLRuntimeCodec"
description: "public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>"
package: "net/minecraftforge/fml/common/network/internal"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/internal/FMLRuntimeCodec.html"
sourceType: javadoc
---

# FMLRuntimeCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<FMLMessage> → net.minecraftforge.fml.common.network.internal.FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>
```

## Methods

- `void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLMessage msg)`
- `void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLMessage msg, io.netty.buffer.ByteBuf target)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `FMLRuntimeCodec`
