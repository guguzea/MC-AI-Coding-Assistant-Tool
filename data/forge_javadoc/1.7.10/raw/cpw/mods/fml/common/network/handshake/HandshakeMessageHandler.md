---
title: "HandshakeMessageHandler"
description: "public class HandshakeMessageHandler<S extends java.lang.Enum<S>& IHandshakeState<S>> extends<any>"
package: "cpw/mods/fml/common/network/handshake"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/handshake/HandshakeMessageHandler.html"
sourceType: javadoc
---

# HandshakeMessageHandler

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.handshake.HandshakeMessageHandler<S>

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S>& IHandshakeState<S>> extends<any>
```

## Constructors

- `HandshakeMessageHandler(java.lang.Class<S> stateType)`

## Methods

- `void channelActive(ChannelHandlerContext ctx)`
- `protected void channelRead0(ChannelHandlerContext ctx, FMLHandshakeMessage msg)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt)`
