---
title: "FMLHandshakeCodec"
description: "public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec<FMLHandshakeMessage>"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/handshake/FMLHandshakeCodec.html"
sourceType: javadoc
---

# FMLHandshakeCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<FMLHandshakeMessage> → net.minecraftforge.fml.common.network.handshake.FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec<FMLHandshakeMessage>
```

## Methods

- `void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLHandshakeMessage msg)`
- `void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg, io.netty.buffer.ByteBuf target)`

## Fields

- `FMLHandshakeCodec`
