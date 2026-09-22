---
title: "NetworkSystem"
description: "public class NetworkSystem extends java.lang.Object"
package: "net/minecraft/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/NetworkSystem.html"
sourceType: javadoc
---

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
- `static LazyLoadBase<io.netty.channel.epoll.EpollEventLoopGroup> SERVER_EPOLL_EVENTLOOP`
- `static LazyLoadBase<io.netty.channel.local.LocalEventLoopGroup> SERVER_LOCAL_EVENTLOOP`
- `static LazyLoadBase<io.netty.channel.nio.NioEventLoopGroup> SERVER_NIO_EVENTLOOP`
