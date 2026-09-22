---
title: "NetworkEventFiringHandler"
description: "public class NetworkEventFiringHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket>"
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/NetworkEventFiringHandler.html"
sourceType: javadoc
---

# NetworkEventFiringHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket> → net.minecraftforge.fml.common.network.NetworkEventFiringHandler

## Class signature

```java
public class NetworkEventFiringHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket>
```

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt)`
