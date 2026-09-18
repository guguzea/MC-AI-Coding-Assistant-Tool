---
title: "HandshakeMessageHandler"
description: "public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends io.netty.channel.SimpleChannelInboundHandler< FMLHandshakeMessage >"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/handshake/HandshakeMessageHandler.html"
sourceType: javadoc
---

# HandshakeMessageHandler

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends io.netty.channel.SimpleChannelInboundHandler< FMLHandshakeMessage >
```

## Constructors

- `public HandshakeMessageHandler(java.lang.Class< S > stateType)`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg) throws java.lang.Exception`
- `public void channelActive(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`
