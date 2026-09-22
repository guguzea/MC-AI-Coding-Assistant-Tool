# NetworkSystem

**Inheritance:** java.lang.Object → net.minecraft.network.NetworkSystem

## Class signature

```java
public class NetworkSystem extends java.lang.Object
```

## Constructors

- `NetworkSystem(MinecraftServer server)`

## Methods

- `void addLanEndpoint(java.net.InetAddress address, int port)`
- `java.net.SocketAddress addLocalEndpoint()`
- `MinecraftServer getServer()`
- `void networkTick()`
- `void terminateEndpoints()`

## Fields

- `boolean isAlive`
- `static LazyLoadBase<EpollEventLoopGroup> SERVER_EPOLL_EVENTLOOP`
- `static LazyLoadBase<LocalEventLoopGroup> SERVER_LOCAL_EVENTLOOP`
- `static LazyLoadBase<NioEventLoopGroup> SERVER_NIO_EVENTLOOP`