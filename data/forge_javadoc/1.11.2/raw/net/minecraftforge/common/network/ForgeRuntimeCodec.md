---
title: "ForgeRuntimeCodec"
description: "public class ForgeRuntimeCodec extends FMLIndexedMessageToMessageCodec<ForgeMessage>"
package: "net/minecraftforge/common/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/network/ForgeRuntimeCodec.html"
sourceType: javadoc
---

# ForgeRuntimeCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<ForgeMessage> → net.minecraftforge.common.network.ForgeRuntimeCodec

## Class signature

```java
public class ForgeRuntimeCodec extends FMLIndexedMessageToMessageCodec<ForgeMessage>
```

## Methods

- `void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, ForgeMessage msg)`
- `void encodeInto(io.netty.channel.ChannelHandlerContext ctx, ForgeMessage msg, io.netty.buffer.ByteBuf target)`

## Fields

- `ForgeRuntimeCodec`
