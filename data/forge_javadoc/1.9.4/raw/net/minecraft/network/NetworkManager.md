---
title: "NetworkManager"
description: "public class NetworkManager extends io.netty.channel.SimpleChannelInboundHandler<Packet<?>>"
package: "net/minecraft/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/NetworkManager.html"
sourceType: javadoc
---

# NetworkManager

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → net.minecraft.network.NetworkManager

## Class signature

```java
public class NetworkManager extends io.netty.channel.SimpleChannelInboundHandler<Packet<?>>
```

## Constructors

- `NetworkManager(EnumPacketDirection packetDirection)`

## Methods

- `io.netty.channel.Channel channel()`
- `void channelActive(io.netty.channel.ChannelHandlerContext p_channelActive_1_)`
- `void channelInactive(io.netty.channel.ChannelHandlerContext p_channelInactive_1_)`
- `protected void channelRead0(io.netty.channel.ChannelHandlerContext p_channelRead0_1_, Packet<?> p_channelRead0_2_)`
- `void checkDisconnected()`
- `void closeChannel(ITextComponent message)`
- `static NetworkManager createNetworkManagerAndConnect(java.net.InetAddress address, int serverPort, boolean useNativeTransport)`
- `void disableAutoRead()`
- `void enableEncryption(javax.crypto.SecretKey key)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_)`
- `EnumPacketDirection getDirection()`
- `ITextComponent getExitMessage()`
- `INetHandler getNetHandler()`
- `java.net.SocketAddress getRemoteAddress()`
- `boolean hasNoChannel()`
- `boolean isChannelOpen()`
- `boolean isEncrypted()`
- `boolean isLocalChannel()`
- `void processReceivedPackets()`
- `static NetworkManager provideLocalClient(java.net.SocketAddress address)`
- `void sendPacket(Packet<?> packetIn)`
- `void sendPacket(Packet<?> packetIn, io.netty.util.concurrent.GenericFutureListener<? extends io.netty.util.concurrent.Future<? super java.lang.Void>> listener, io.netty.util.concurrent.GenericFutureListener<? extends io.netty.util.concurrent.Future<? super java.lang.Void>>... listeners)`
- `void setCompressionThreshold(int threshold)`
- `void setConnectionState(EnumConnectionState newState)`
- `void setNetHandler(INetHandler handler)`

## Fields

- `static LazyLoadBase<io.netty.channel.epoll.EpollEventLoopGroup> CLIENT_EPOLL_EVENTLOOP`
- `static LazyLoadBase<io.netty.channel.local.LocalEventLoopGroup> CLIENT_LOCAL_EVENTLOOP`
- `static LazyLoadBase<io.netty.channel.nio.NioEventLoopGroup> CLIENT_NIO_EVENTLOOP`
- `static org.apache.logging.log4j.Marker NETWORK_MARKER`
- `static org.apache.logging.log4j.Marker NETWORK_PACKETS_MARKER`
- `static io.netty.util.AttributeKey<EnumConnectionState> PROTOCOL_ATTRIBUTE_KEY`
