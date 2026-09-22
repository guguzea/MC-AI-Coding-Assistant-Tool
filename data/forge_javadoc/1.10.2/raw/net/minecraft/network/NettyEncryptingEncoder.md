---
title: "NettyEncryptingEncoder"
description: "public class NettyEncryptingEncoder extends io.netty.handler.codec.MessageToByteEncoder<io.netty.buffer.ByteBuf>"
package: "net/minecraft/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/NettyEncryptingEncoder.html"
sourceType: javadoc
---

# NettyEncryptingEncoder

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelOutboundHandlerAdapter → io.netty.handler.codec.MessageToByteEncoder<io.netty.buffer.ByteBuf> → net.minecraft.network.NettyEncryptingEncoder

## Class signature

```java
public class NettyEncryptingEncoder extends io.netty.handler.codec.MessageToByteEncoder<io.netty.buffer.ByteBuf>
```

## Constructors

- `NettyEncryptingEncoder(javax.crypto.Cipher cipher)`

## Methods

- `protected void encode(io.netty.channel.ChannelHandlerContext p_encode_1_, io.netty.buffer.ByteBuf p_encode_2_, io.netty.buffer.ByteBuf p_encode_3_)`
