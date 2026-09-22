---
title: "NetworkDispatcher"
description: "public class NetworkDispatcher extends io.netty.channel.SimpleChannelInboundHandler<Packet<?>> implements io.netty.channel.ChannelOutboundHandler"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/handshake/NetworkDispatcher.html"
sourceType: javadoc
---

# NetworkDispatcher

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → net.minecraftforge.fml.common.network.handshake.NetworkDispatcher

## Class signature

```java
public class NetworkDispatcher extends io.netty.channel.SimpleChannelInboundHandler<Packet<?>> implements io.netty.channel.ChannelOutboundHandler
```

## Constructors

- `NetworkDispatcher(NetworkManager manager)`
- `NetworkDispatcher(NetworkManager manager, PlayerList scm)`

## Methods

- `void abortClientHandshake(java.lang.String type)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager, PlayerList scm)`
- `void bind(io.netty.channel.ChannelHandlerContext ctx, java.net.SocketAddress localAddress, io.netty.channel.ChannelPromise promise)`
- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, Packet<?> msg)`
- `void clientToServerHandshake()`
- `void close(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise)`
- `void completeClientHandshake()`
- `void completeHandshake(Side target)`
- `void connect(io.netty.channel.ChannelHandlerContext ctx, java.net.SocketAddress remoteAddress, java.net.SocketAddress localAddress, io.netty.channel.ChannelPromise promise)`
- `@Deprecated void deregister(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise)`
- `void disconnect(io.netty.channel.ChannelHandlerContext ctx, io.netty.channel.ChannelPromise promise)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void flush(io.netty.channel.ChannelHandlerContext ctx)`
- `static NetworkDispatcher get(NetworkManager manager)`
- `java.util.Map<java.lang.String, java.lang.String> getModList()` — The mod list returned by this method is in no way reliable because it is provided by the client
- `INetHandler getNetHandler()`
- `int getOverrideDimension(SPacketJoinGame packetIn)`
- `void handlerAdded(io.netty.channel.ChannelHandlerContext ctx)`
- `void read(io.netty.channel.ChannelHandlerContext ctx)`
- `void rejectHandshake(java.lang.String result)`
- `void sendProxy(FMLProxyPacket msg)`
- `void serverToClientHandshake(EntityPlayerMP player)`
- `protected void setModList(java.util.Map<java.lang.String, java.lang.String> modList)`
- `void setOverrideDimension(int overrideDim)`
- `void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt)`
- `void write(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object msg, io.netty.channel.ChannelPromise promise)`

## Fields

- `static io.netty.util.AttributeKey<NetworkDispatcher> FML_DISPATCHER`
- `static io.netty.util.AttributeKey<PersistentRegistryManager.GameDataSnapshot> FML_GAMEDATA_SNAPSHOT`
- `static io.netty.util.AttributeKey<java.lang.Boolean> IS_LOCAL`
- `NetworkManager manager`
