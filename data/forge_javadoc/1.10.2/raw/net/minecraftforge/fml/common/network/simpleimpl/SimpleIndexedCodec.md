---
title: "SimpleIndexedCodec"
description: "public class SimpleIndexedCodec extends FMLIndexedMessageToMessageCodec<IMessage>"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/simpleimpl/SimpleIndexedCodec.html"
sourceType: javadoc
---

# SimpleIndexedCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<IMessage> → net.minecraftforge.fml.common.network.simpleimpl.SimpleIndexedCodec

## Class signature

```java
public class SimpleIndexedCodec extends FMLIndexedMessageToMessageCodec<IMessage>
```

## Methods

- `void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, IMessage msg)`
- `void encodeInto(io.netty.channel.ChannelHandlerContext ctx, IMessage msg, io.netty.buffer.ByteBuf target)`

## Fields

- `SimpleIndexedCodec`
