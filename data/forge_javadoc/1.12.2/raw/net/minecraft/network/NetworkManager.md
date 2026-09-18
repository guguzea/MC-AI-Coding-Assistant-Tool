---
title: "NetworkManager"
description: "public class NetworkManager extends <any>"
package: "net/minecraft/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/NetworkManager.html"
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
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet <?> p_channelRead0_2_) throws java.lang.Exception`
- `public void setNetHandler( INetHandler handler)`
- `public void sendPacket( Packet <?> packetIn)`
- `public void sendPacket( Packet <?> packetIn, <any> listener, <any>... listeners)`
- `public void processReceivedPackets()`
- `public java.net.SocketAddress getRemoteAddress()`
- `public void closeChannel( ITextComponent message)`
- `public boolean isLocalChannel()`
- `public static NetworkManager createNetworkManagerAndConnect(java.net.InetAddress address, int serverPort, boolean useNativeTransport)`
- `public static NetworkManager provideLocalClient(java.net.SocketAddress address)`
- `public void enableEncryption(javax.crypto.SecretKey key)`
- `public boolean isEncrypted()`
- `public boolean isChannelOpen()`
- `public boolean hasNoChannel()`
- `public INetHandler getNetHandler()`
- `public ITextComponent getExitMessage()`
- `public void disableAutoRead()`
- `public void setCompressionThreshold(int threshold)`
- `public void checkDisconnected()`
- `public Channel channel()`
