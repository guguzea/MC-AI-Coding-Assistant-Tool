---
title: "HandshakeMessageHandler"
description: "public class HandshakeMessageHandler<S extends java.lang.Enum<S>& IHandshakeState<S>> extends<any>"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/handshake/HandshakeMessageHandler.html"
sourceType: javadoc
---

# HandshakeMessageHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.HandshakeMessageHandler<S>

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
