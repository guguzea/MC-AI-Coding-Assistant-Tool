---
title: "FMLIndexedMessageToMessageCodec"
description: "public abstract class FMLIndexedMessageToMessageCodec<A> extends<any>"
package: "net/minecraftforge/fml/common/network"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/FMLIndexedMessageToMessageCodec.html"
sourceType: javadoc
---

# FMLIndexedMessageToMessageCodec

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<A>

## Class signature

```java
public abstract class FMLIndexedMessageToMessageCodec<A> extends<any>
```

## Constructors

- `FMLIndexedMessageToMessageCodec()`

## Methods

- `FMLIndexedMessageToMessageCodec<A> addDiscriminator(int discriminator, java.lang.Class<? extends A> type)`
- `protected void decode(ChannelHandlerContext ctx, FMLProxyPacket msg, java.util.List<java.lang.Object> out)`
- `abstract void decodeInto(ChannelHandlerContext ctx, ByteBuf source, A msg)`
- `protected void encode(ChannelHandlerContext ctx, A msg, java.util.List<java.lang.Object> out)`
- `abstract void encodeInto(ChannelHandlerContext ctx, A msg, ByteBuf target)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void handlerAdded(ChannelHandlerContext ctx)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `static<any> INBOUNDPACKETTRACKER` — Make this accessible to subclasses
