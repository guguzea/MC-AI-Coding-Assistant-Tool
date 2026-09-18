---
title: "NetworkManager"
description: "public class NetworkManager extends SimpleChannelInboundHandler"
package: "net/minecraft/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/NetworkManager.html"
sourceType: javadoc
---

# NetworkManager

## Class signature

```java
public class NetworkManager extends SimpleChannelInboundHandler
```

## Constructors

- `public NetworkManager(boolean p_i45147_1_)`

## Methods

- `public void channelActive(ChannelHandlerContext p_channelActive_1_) throws java.lang.Exception`
- `public void setConnectionState( EnumConnectionState p_150723_1_)`
- `public void channelInactive(ChannelHandlerContext p_channelInactive_1_)`
- `public void exceptionCaught(ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_)`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet p_channelRead0_2_)`
- `public void setNetHandler( INetHandler p_150719_1_)`
- `public void scheduleOutboundPacket( Packet p_150725_1_, GenericFutureListener... p_150725_2_)`
- `public void processReceivedPackets()`
- `public java.net.SocketAddress getSocketAddress()`
- `public void closeChannel( IChatComponent p_150718_1_)`
- `public boolean isLocalChannel()`
- `public static NetworkManager provideLanClient(java.net.InetAddress p_150726_0_, int p_150726_1_)`
- `public static NetworkManager provideLocalClient(java.net.SocketAddress p_150722_0_)`
- `public void enableEncryption(javax.crypto.SecretKey p_150727_1_)`
- `public boolean isChannelOpen()`
- `public INetHandler getNetHandler()`
- `public IChatComponent getExitMessage()`
- `public void disableAutoRead()`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, java.lang.Object p_channelRead0_2_)`
- `public Channel channel()`
