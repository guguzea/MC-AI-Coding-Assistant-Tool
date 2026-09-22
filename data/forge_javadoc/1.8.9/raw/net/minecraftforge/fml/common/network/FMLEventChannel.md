---
title: "FMLEventChannel"
description: "public class FMLEventChannel extends java.lang.Object"
package: "net/minecraftforge/fml/common/network"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/FMLEventChannel.html"
sourceType: javadoc
---

# FMLEventChannel

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.FMLEventChannel

## Class signature

```java
public class FMLEventChannel extends java.lang.Object
```

## Methods

- `void fireUserEvent(java.lang.Object evt, ChannelHandlerContext ctx)`
- `void register(java.lang.Object object)` — Register an event listener with this channel and bus.
- `void sendTo(FMLProxyPacket pkt, EntityPlayerMP player)` — Send to a specific player
- `void sendToAll(FMLProxyPacket pkt)` — Send a packet to all on the server
- `void sendToAllAround(FMLProxyPacket pkt, NetworkRegistry.TargetPoint point)` — Send to all around a point
- `void sendToDimension(FMLProxyPacket pkt, int dimensionId)` — Send to all in a dimension
- `void sendToServer(FMLProxyPacket pkt)` — Send to the server
- `void unregister(java.lang.Object object)` — Unregister an event listener from the bus.
