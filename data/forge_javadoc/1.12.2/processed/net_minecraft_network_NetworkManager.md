# NetworkManager

**Inheritance:** java.lang.Object → net.minecraft.network.NetworkManager

## Class signature

```java
public class NetworkManager extends<any>
```

## Constructors

- `NetworkManager(EnumPacketDirection packetDirection)`

## Methods

- `Channel channel()`
- `void channelActive(ChannelHandlerContext p_channelActive_1_)`
- `void channelInactive(ChannelHandlerContext p_channelInactive_1_)`
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet<?> p_channelRead0_2_)`
- `void checkDisconnected()`
- `void closeChannel(ITextComponent message)`
- `static NetworkManager createNetworkManagerAndConnect(java.net.InetAddress address, int serverPort, boolean useNativeTransport)`
- `void disableAutoRead()`
- `void enableEncryption(javax.crypto.SecretKey key)`
- `void exceptionCaught(ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_)`
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
- `void sendPacket(Packet<?> packetIn, <any> listener, <any>... listeners)`
- `void setCompressionThreshold(int threshold)`
- `void setConnectionState(EnumConnectionState newState)`
- `void setNetHandler(INetHandler handler)`

## Fields

- `static LazyLoadBase<EpollEventLoopGroup> CLIENT_EPOLL_EVENTLOOP`
- `static LazyLoadBase<LocalEventLoopGroup> CLIENT_LOCAL_EVENTLOOP`
- `static LazyLoadBase<NioEventLoopGroup> CLIENT_NIO_EVENTLOOP`
- `static Marker NETWORK_MARKER`
- `static Marker NETWORK_PACKETS_MARKER`
- `static<any> PROTOCOL_ATTRIBUTE_KEY`