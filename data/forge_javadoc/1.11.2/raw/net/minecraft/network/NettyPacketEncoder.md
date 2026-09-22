---
title: "NettyPacketEncoder"
description: "public class NettyPacketEncoder extends io.netty.handler.codec.MessageToByteEncoder<Packet<?>>"
package: "net/minecraft/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/NettyPacketEncoder.html"
sourceType: javadoc
---

# NettyPacketEncoder

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelOutboundHandlerAdapter → net.minecraft.network.NettyPacketEncoder

## Class signature

```java
public class NettyPacketEncoder extends io.netty.handler.codec.MessageToByteEncoder<Packet<?>>
```

## Constructors

- `NettyPacketEncoder(EnumPacketDirection direction)`

## Methods

- `protected void encode(io.netty.channel.ChannelHandlerContext p_encode_1_, Packet<?> p_encode_2_, io.netty.buffer.ByteBuf p_encode_3_)`
