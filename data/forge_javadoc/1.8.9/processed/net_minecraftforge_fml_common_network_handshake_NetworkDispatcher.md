# NetworkDispatcher

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.NetworkDispatcher

## Class signature

```java
public class NetworkDispatcher extends<any>
```

## Constructors

- `NetworkDispatcher(NetworkManager manager)`
- `NetworkDispatcher(NetworkManager manager, ServerConfigurationManager scm)`

## Methods

- `void abortClientHandshake(java.lang.String type)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager)`
- `static NetworkDispatcher allocAndSet(NetworkManager manager, ServerConfigurationManager scm)`
- `void bind(ChannelHandlerContext ctx, java.net.SocketAddress localAddress, ChannelPromise promise)`
- `protected void channelRead0(ChannelHandlerContext ctx, Packet msg)`
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
- `java.util.Map<java.lang.String, java.lang.String> getModList()` — The mod list returned by this method is in no way reliable because it is provided by the client
- `INetHandler getNetHandler()`
- `int getOverrideDimension(S01PacketJoinGame packetIn)`
- `void handlerAdded(ChannelHandlerContext ctx)`
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