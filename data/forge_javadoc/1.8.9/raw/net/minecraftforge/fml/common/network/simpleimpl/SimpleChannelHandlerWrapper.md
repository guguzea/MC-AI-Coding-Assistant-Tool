---
title: "SimpleChannelHandlerWrapper"
description: "public class SimpleChannelHandlerWrapper<REQ extends IMessage, REPLY extends IMessage> extends<any>"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/simpleimpl/SimpleChannelHandlerWrapper.html"
sourceType: javadoc
---

# SimpleChannelHandlerWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.simpleimpl.SimpleChannelHandlerWrapper<REQ, REPLY>

## Class signature

```java
public class SimpleChannelHandlerWrapper<REQ extends IMessage, REPLY extends IMessage> extends<any>
```

## Constructors

- `SimpleChannelHandlerWrapper(java.lang.Class<? extends IMessageHandler<? super REQ, ? extends REPLY>> handler, Side side, java.lang.Class<REQ> requestType)`
- `SimpleChannelHandlerWrapper(IMessageHandler<? super REQ, ? extends REPLY> handler, Side side, java.lang.Class<REQ> requestType)`

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, REQ msg)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
