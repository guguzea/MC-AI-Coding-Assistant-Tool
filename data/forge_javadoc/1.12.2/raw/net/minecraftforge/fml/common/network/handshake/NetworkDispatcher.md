---
title: "NetworkDispatcher"
description: "public class NetworkDispatcher extends<any>"
package: "net/minecraftforge/fml/common/network/handshake"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/handshake/NetworkDispatcher.html"
sourceType: javadoc
---

# NetworkDispatcher

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.NetworkDispatcher

## Class signature

```java
public class NetworkDispatcher extends<any>
```

## Constructors

- `NetworkDispatcher(NetworkManager manager)`
- `NetworkDispatcher(NetworkManager manager, PlayerList scm)`

## Methods

- `void abortClientHandshake(java.lang.String type)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager, PlayerList scm)`
- `void bind(ChannelHandlerContext ctx, java.net.SocketAddress localAddress, ChannelPromise promise)`
- `protected void channelRead0(ChannelHandlerContext ctx, Packet<?> msg)`
- `void clientToServerHandshake()`
- `void close(ChannelHandlerContext ctx, ChannelPromise promise)`
- `void completeClientHandshake()`
- `void completeHandshake(Side target)`
- `void connect(ChannelHandlerContext ctx, java.net.SocketAddress remoteAddress, java.net.SocketAddress localAddress, ChannelPromise promise)`
- `@Deprecated void deregister(ChannelHandlerContext ctx, ChannelPromise promise)`
- `void disconnect(ChannelHandlerContext ctx, ChannelPromise promise)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void flush(ChannelHandlerContext ctx)`
- `static NetworkDispatcher get(NetworkManager manager)`
- `NetworkDispatcher.ConnectionType getConnectionType()`
- `java.util.Map<java.lang.String, java.lang.String> getModList()` — The mod list returned by this method is in no way reliable because it is provided by the client
- `INetHandler getNetHandler()`
- `int getOverrideDimension(SPacketJoinGame packetIn)`
- `void read(ChannelHandlerContext ctx)`
- `void rejectHandshake(java.lang.String result)`
- `void sendProxy(FMLProxyPacket msg)`
- `void serverToClientHandshake(EntityPlayerMP player)`
- `protected void setModList(java.util.Map<java.lang.String, java.lang.String> modList)`
- `void setOverrideDimension(int overrideDim)`
- `void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt)`
- `void write(ChannelHandlerContext ctx, java.lang.Object msg, ChannelPromise promise)`

## Fields

- `static<any> FML_DISPATCHER`
- `static<any> FML_GAMEDATA_SNAPSHOT`
- `static<any> IS_LOCAL`
- `NetworkManager manager`
