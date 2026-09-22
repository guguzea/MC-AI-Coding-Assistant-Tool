---
title: "NettyEncryptingDecoder"
description: "public class NettyEncryptingDecoder extends io.netty.handler.codec.MessageToMessageDecoder<io.netty.buffer.ByteBuf>"
package: "net/minecraft/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/NettyEncryptingDecoder.html"
sourceType: javadoc
---

# NettyEncryptingDecoder

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.handler.codec.MessageToMessageDecoder<io.netty.buffer.ByteBuf> → net.minecraft.network.NettyEncryptingDecoder

## Class signature

```java
public class NettyEncryptingDecoder extends io.netty.handler.codec.MessageToMessageDecoder<io.netty.buffer.ByteBuf>
```

## Constructors

- `NettyEncryptingDecoder(javax.crypto.Cipher cipher)`

## Methods

- `protected void decode(io.netty.channel.ChannelHandlerContext p_decode_1_, io.netty.buffer.ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_)`
