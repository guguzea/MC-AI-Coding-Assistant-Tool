---
title: "NettyCompressionDecoder"
description: "public class NettyCompressionDecoder extends io.netty.handler.codec.ByteToMessageDecoder"
package: "net/minecraft/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/NettyCompressionDecoder.html"
sourceType: javadoc
---

# NettyCompressionDecoder

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.handler.codec.ByteToMessageDecoder → net.minecraft.network.NettyCompressionDecoder

## Class signature

```java
public class NettyCompressionDecoder extends io.netty.handler.codec.ByteToMessageDecoder
```

## Constructors

- `NettyCompressionDecoder(int thresholdIn)`

## Methods

- `protected void decode(io.netty.channel.ChannelHandlerContext p_decode_1_, io.netty.buffer.ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_)`
- `void setCompressionThreshold(int thresholdIn)`
