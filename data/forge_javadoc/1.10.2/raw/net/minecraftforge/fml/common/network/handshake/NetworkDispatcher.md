---
title: "NetworkDispatcher"
description: "Deprecated."
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/handshake/NetworkDispatcher.html"
sourceType: javadoc
---

# NetworkDispatcher

## Class signature

```java
public class NetworkDispatcher extends io.netty.channel.SimpleChannelInboundHandler< Packet <?>> implements io.netty.channel.ChannelOutboundHandler
```

## Constructors

- `public NetworkDispatcher( NetworkManager manager)`
- `public NetworkDispatcher( NetworkManager manager, PlayerList scm)`

## Methods

- `public static NetworkDispatcher get( NetworkManager manager)`
- `public static NetworkDispatcher allocAndSet( NetworkManager manager)`
- `public static NetworkDispatcher allocAndSet( NetworkManager manager, PlayerList scm)`
- `public void serverToClientHandshake( EntityPlayerMP player)`
- `protected void setModList(java.util.Map<java.lang.String,java.lang.String> modList)`
- `public void clientToServerHandshake()`
- `public void handlerAdded(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, Packet <?> msg) throws java.lang.Exception`
- `public INetHandler getNetHandler()`
- `public java.util.Map<java.lang.String,java.lang.String> getModList()`
- `public void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void sendProxy( FMLProxyPacket msg)`
- `public void rejectHandshake(java.lang.String result)`
- `public void bind(io.netty.channel.ChannelHandlerContext ctx, java.net.SocketAddress localAddress, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `public void connect(io.netty.channel.ChannelHandlerContext ctx, java.net.SocketAddress remoteAddress, java.net.SocketAddress localAddress, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `public void disconnect(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `public void close(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `@Deprecated public void deregister(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `public void read(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void write(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object msg, io.netty.channel.ChannelPromise promise) throws java.lang.Exception`
- `public void flush(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void completeHandshake( Side target)`
- `public void completeClientHandshake()`
- `public void abortClientHandshake(java.lang.String type)`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`
- `public void setOverrideDimension(int overrideDim)`
- `public int getOverrideDimension( SPacketJoinGame packetIn)`

## Description

Deprecated.
