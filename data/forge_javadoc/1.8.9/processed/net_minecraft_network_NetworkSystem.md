# NetworkSystem

**Inheritance:** java.lang.Object → net.minecraft.network.NetworkSystem

## Class signature

```java
public class NetworkSystem extends java.lang.Object
```

## Constructors

- `NetworkSystem(MinecraftServer server)`

## Methods

- `void addLanEndpoint(java.net.InetAddress address, int port)` — Adds a channel that listens on publicly accessible network ports
- `java.net.SocketAddress addLocalEndpoint()` — Adds a channel that listens locally
- `MinecraftServer getServer()`
- `void networkTick()` — Will try to process the packets received by each NetworkManager, gracefully manage processing failures and cleans up dead connections
- `void terminateEndpoints()` — Shuts down all open endpoints (with immediate effect?)

## Fields

- `static LazyLoadBase<NioEventLoopGroup> eventLoops`
- `static LazyLoadBase<EpollEventLoopGroup> field_181141_b`
- `boolean isAlive` — True if this NetworkSystem has never had his endpoints terminated
- `static LazyLoadBase<LocalEventLoopGroup> SERVER_LOCAL_EVENTLOOP`