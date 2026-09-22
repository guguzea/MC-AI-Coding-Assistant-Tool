---
title: "NetworkManager"
description: "public class NetworkManager extends SimpleChannelInboundHandler"
package: "net/minecraft/network"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/NetworkManager.html"
sourceType: javadoc
---

# NetworkManager

**Inheritance:** java.lang.Object → SimpleChannelInboundHandler → net.minecraft.network.NetworkManager

## Class signature

```java
public class NetworkManager extends SimpleChannelInboundHandler
```

## Constructors

- `NetworkManager(boolean p_i45147_1_)`

## Methods

- `Channel channel()`
- `void channelActive(ChannelHandlerContext p_channelActive_1_)`
- `void channelInactive(ChannelHandlerContext p_channelInactive_1_)`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, java.lang.Object p_channelRead0_2_)`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet p_channelRead0_2_)`
- `void closeChannel(IChatComponent p_150718_1_)`
- `void disableAutoRead()`
- `void enableEncryption(javax.crypto.SecretKey p_150727_1_)`
- `void exceptionCaught(ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_)`
- `IChatComponent getExitMessage()`
- `INetHandler getNetHandler()`
- `java.net.SocketAddress getSocketAddress()`
- `boolean isChannelOpen()`
- `boolean isLocalChannel()`
- `void processReceivedPackets()`
- `static NetworkManager provideLanClient(java.net.InetAddress p_150726_0_, int p_150726_1_)`
- `static NetworkManager provideLocalClient(java.net.SocketAddress p_150722_0_)`
- `void scheduleOutboundPacket(Packet p_150725_1_, GenericFutureListener... p_150725_2_)`
- `void setConnectionState(EnumConnectionState p_150723_1_)`
- `void setNetHandler(INetHandler p_150719_1_)`

## Fields

- `static AttributeKey attrKeyConnectionState`
- `static AttributeKey attrKeyReceivable`
- `static AttributeKey attrKeySendable`
- `static NioEventLoopGroup eventLoops`
- `static Marker field_152461_c`
- `static NetworkStatistics field_152462_h`
- `static Marker logMarkerNetwork`
- `static Marker logMarkerPackets`
