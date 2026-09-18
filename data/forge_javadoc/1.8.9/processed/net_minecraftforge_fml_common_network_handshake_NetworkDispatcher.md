# NetworkDispatcher

## Class signature

```java
public class NetworkDispatcher extends <any>
```

## Constructors

- `public NetworkDispatcher( NetworkManager manager)`
- `public NetworkDispatcher( NetworkManager manager, ServerConfigurationManager scm)`

## Methods

- `public static NetworkDispatcher get( NetworkManager manager)`
- `public static NetworkDispatcher allocAndSet( NetworkManager manager)`
- `public static NetworkDispatcher allocAndSet( NetworkManager manager, ServerConfigurationManager scm)`
- `public void serverToClientHandshake( EntityPlayerMP player)`
- `protected void setModList(java.util.Map<java.lang.String,java.lang.String> modList)`
- `public void clientToServerHandshake()`
- `public void handlerAdded(ChannelHandlerContext ctx) throws java.lang.Exception`
- `protected void channelRead0(ChannelHandlerContext ctx, Packet msg) throws java.lang.Exception`
- `public INetHandler getNetHandler()`
- `public java.util.Map<java.lang.String,java.lang.String> getModList()`
- `public void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void sendProxy( FMLProxyPacket msg)`
- `public void rejectHandshake(java.lang.String result)`
- `public void bind(ChannelHandlerContext ctx, java.net.SocketAddress localAddress, ChannelPromise promise) throws java.lang.Exception`
- `public void connect(ChannelHandlerContext ctx, java.net.SocketAddress remoteAddress, java.net.SocketAddress localAddress, ChannelPromise promise) throws java.lang.Exception`
- `public void disconnect(ChannelHandlerContext ctx, ChannelPromise promise) throws java.lang.Exception`
- `public void close(ChannelHandlerContext ctx, ChannelPromise promise) throws java.lang.Exception`
- `@Deprecated public void deregister(ChannelHandlerContext ctx, ChannelPromise promise) throws java.lang.Exception`
- `public void read(ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void write(ChannelHandlerContext ctx, java.lang.Object msg, ChannelPromise promise) throws java.lang.Exception`
- `public void flush(ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void completeHandshake( Side target)`
- `public void completeClientHandshake()`
- `public void abortClientHandshake(java.lang.String type)`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`
- `public void setOverrideDimension(int overrideDim)`
- `public int getOverrideDimension( S01PacketJoinGame packetIn)`

## Description

Deprecated.