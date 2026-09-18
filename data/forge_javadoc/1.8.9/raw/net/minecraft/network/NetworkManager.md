---
title: "NetworkManager"
description: "Closes the channel, the parameter can be used for an exit message (not certain how it gets sent)"
package: "net/minecraft/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/NetworkManager.html"
sourceType: javadoc
---

# NetworkManager

## Class signature

```java
public class NetworkManager extends <any>
```

## Constructors

- `public NetworkManager( EnumPacketDirection packetDirection)`

## Methods

- `public EnumPacketDirection getDirection()`
- `public void channelActive(ChannelHandlerContext p_channelActive_1_) throws java.lang.Exception`
- `public void setConnectionState( EnumConnectionState newState)`
- `public void channelInactive(ChannelHandlerContext p_channelInactive_1_) throws java.lang.Exception`
- `public void exceptionCaught(ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_) throws java.lang.Exception`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet p_channelRead0_2_) throws java.lang.Exception`
- `public void setNetHandler( INetHandler handler)`
- `public void sendPacket( Packet packetIn)`
- `public void sendPacket( Packet packetIn, <any> listener, <any>... listeners)`
- `public void processReceivedPackets()`
- `public java.net.SocketAddress getRemoteAddress()`
- `public void closeChannel( IChatComponent message)`
- `public boolean isLocalChannel()`
- `public static NetworkManager func_181124_a(java.net.InetAddress p_181124_0_, int p_181124_1_, boolean p_181124_2_)`
- `public static NetworkManager provideLocalClient(java.net.SocketAddress address)`
- `public void enableEncryption(javax.crypto.SecretKey key)`
- `public boolean getIsencrypted()`
- `public boolean isChannelOpen()`
- `public boolean hasNoChannel()`
- `public INetHandler getNetHandler()`
- `public IChatComponent getExitMessage()`
- `public void disableAutoRead()`
- `public void setCompressionTreshold(int treshold)`
- `public void checkDisconnected()`
- `public Channel channel()`

## Description

Closes the channel, the parameter can be used for an exit message (not certain how it gets sent)
