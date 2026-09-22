---
title: "FMLIndexedMessageToMessageCodec"
description: "public abstract class FMLIndexedMessageToMessageCodec<A> extends io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A>"
package: "net/minecraftforge/fml/common/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/FMLIndexedMessageToMessageCodec.html"
sourceType: javadoc
---

# FMLIndexedMessageToMessageCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<A>

## Class signature

```java
public abstract class FMLIndexedMessageToMessageCodec<A> extends io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A>
```

## Constructors

- `FMLIndexedMessageToMessageCodec()`

## Methods

- `FMLIndexedMessageToMessageCodec<A> addDiscriminator(int discriminator, java.lang.Class<? extends A> type)`
- `protected void decode(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg, java.util.List<java.lang.Object> out)`
- `abstract void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, A msg)`
- `protected void encode(io.netty.channel.ChannelHandlerContext ctx, A msg, java.util.List<java.lang.Object> out)`
- `abstract void encodeInto(io.netty.channel.ChannelHandlerContext ctx, A msg, io.netty.buffer.ByteBuf target)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void handlerAdded(io.netty.channel.ChannelHandlerContext ctx)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `static io.netty.util.AttributeKey<java.lang.ThreadLocal<java.lang.ref.WeakReference<FMLProxyPacket>>> INBOUNDPACKETTRACKER` — Make this accessible to subclasses
