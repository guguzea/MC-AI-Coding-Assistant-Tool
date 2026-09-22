---
title: "SimpleChannelHandlerWrapper"
description: "public class SimpleChannelHandlerWrapper<REQ extends IMessage, REPLY extends IMessage> extends<any>"
package: "cpw/mods/fml/common/network/simpleimpl"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/simpleimpl/SimpleChannelHandlerWrapper.html"
sourceType: javadoc
---

# SimpleChannelHandlerWrapper

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.simpleimpl.SimpleChannelHandlerWrapper<REQ, REPLY>

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
