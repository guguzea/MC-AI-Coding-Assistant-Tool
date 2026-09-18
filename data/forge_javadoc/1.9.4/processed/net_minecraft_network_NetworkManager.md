# NetworkManager

## Class signature

```java
public class NetworkManager extends io.netty.channel.SimpleChannelInboundHandler< Packet <?>>
```

## Constructors

- `public NetworkManager( EnumPacketDirection packetDirection)`

## Methods

- `public EnumPacketDirection getDirection()`
- `public void channelActive(io.netty.channel.ChannelHandlerContext p_channelActive_1_) throws java.lang.Exception`
- `public void setConnectionState( EnumConnectionState newState)`
- `public void channelInactive(io.netty.channel.ChannelHandlerContext p_channelInactive_1_) throws java.lang.Exception`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_) throws java.lang.Exception`
- `protected void channelRead0(io.netty.channel.ChannelHandlerContext p_channelRead0_1_, Packet <?> p_channelRead0_2_) throws java.lang.Exception`
- `public void setNetHandler( INetHandler handler)`
- `public void sendPacket( Packet <?> packetIn)`
- `public void sendPacket( Packet <?> packetIn, io.netty.util.concurrent.GenericFutureListener<? extends io.netty.util.concurrent.Future<? super java.lang.Void>> listener, io.netty.util.concurrent.GenericFutureListener<? extends io.netty.util.concurrent.Future<? super java.lang.Void>>... listeners)`
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
- `public io.netty.channel.Channel channel()`