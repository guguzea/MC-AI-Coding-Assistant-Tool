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
- `protected void channelRead0(ChannelHandlerContext p_channelRead0_1_, Packet p_channelRead0_2_)`
- `void checkDisconnected()`
- `void closeChannel(IChatComponent message)` — Closes the channel, the parameter can be used for an exit message (not certain how it gets sent)
- `void disableAutoRead()` — Switches the channel to manual reading modus
- `void enableEncryption(javax.crypto.SecretKey key)` — Adds an encoder+decoder to the channel pipeline.
- `void exceptionCaught(ChannelHandlerContext p_exceptionCaught_1_, java.lang.Throwable p_exceptionCaught_2_)`
- `static NetworkManager func_181124_a(java.net.InetAddress p_181124_0_, int p_181124_1_, boolean p_181124_2_)`
- `EnumPacketDirection getDirection()`
- `IChatComponent getExitMessage()` — If this channel is closed, returns the exit message, null otherwise.
- `boolean getIsencrypted()`
- `INetHandler getNetHandler()` — Gets the current handler for processing packets
- `java.net.SocketAddress getRemoteAddress()` — Returns the socket address of the remote side.
- `boolean hasNoChannel()`
- `boolean isChannelOpen()` — Returns true if this NetworkManager has an active channel, false otherwise
- `boolean isLocalChannel()` — True if this NetworkManager uses a memory connection (single player game).
- `void processReceivedPackets()` — Checks timeouts and processes all packets received
- `static NetworkManager provideLocalClient(java.net.SocketAddress address)` — Prepares a clientside NetworkManager: establishes a connection to the socket supplied and configures the channel pipeline.
- `void sendPacket(Packet packetIn)`
- `void sendPacket(Packet packetIn, <any> listener, <any>... listeners)`
- `void setCompressionTreshold(int treshold)`
- `void setConnectionState(EnumConnectionState newState)` — Sets the new connection state and registers which packets this channel may send and receive
- `void setNetHandler(INetHandler handler)` — Sets the NetHandler for this NetworkManager, no checks are made if this handler is suitable for the particular connection state (protocol)

## Fields

- `static<any> attrKeyConnectionState`
- `static LazyLoadBase<LocalEventLoopGroup> CLIENT_LOCAL_EVENTLOOP`
- `static LazyLoadBase<NioEventLoopGroup> CLIENT_NIO_EVENTLOOP`
- `static LazyLoadBase<EpollEventLoopGroup> field_181125_e`
- `static Marker logMarkerNetwork`
- `static Marker logMarkerPackets`