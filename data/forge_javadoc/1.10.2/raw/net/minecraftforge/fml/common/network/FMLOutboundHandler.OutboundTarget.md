---
title: "FMLOutboundHandler.OutboundTarget"
description: "The packet is dispatched to all players connected to the server."
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/FMLOutboundHandler.OutboundTarget.html"
sourceType: javadoc
---

# FMLOutboundHandler.OutboundTarget

## Methods

- `public static FMLOutboundHandler.OutboundTarget [] values()`
- `public static FMLOutboundHandler.OutboundTarget valueOf(java.lang.String name)`
- `public abstract void validateArgs(java.lang.Object args)`
- `public abstract java.util.List< NetworkDispatcher > selectNetworks(java.lang.Object args, io.netty.channel.ChannelHandlerContext context, FMLProxyPacket packet)`

## Description

The packet is dispatched to all players connected to the server.
