---
title: "HandshakeMessageHandler"
description: "public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends <any>"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/handshake/HandshakeMessageHandler.html"
sourceType: javadoc
---

# HandshakeMessageHandler

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends <any>
```

## Constructors

- `public HandshakeMessageHandler(java.lang.Class< S > stateType)`

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, FMLHandshakeMessage msg) throws java.lang.Exception`
- `public void channelActive(ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`
