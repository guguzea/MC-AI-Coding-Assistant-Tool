---
title: "NetworkEventFiringHandler"
description: "Use this handler as the only thing in your channel, to receive network events whenever your channel receives a message. Note: it will not forward on to other handlers."
package: "net/minecraftforge/fml/common/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/NetworkEventFiringHandler.html"
sourceType: javadoc
---

# NetworkEventFiringHandler

## Class signature

```java
public class NetworkEventFiringHandler extends <any>
```

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, FMLProxyPacket msg) throws java.lang.Exception`
- `public void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`

## Description

Use this handler as the only thing in your channel, to receive network events whenever your channel receives a message. Note: it will not forward on to other handlers.
