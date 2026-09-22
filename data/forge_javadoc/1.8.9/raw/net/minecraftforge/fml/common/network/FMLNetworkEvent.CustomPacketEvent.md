---
title: "FMLNetworkEvent.CustomPacketEvent"
description: "public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>"
package: "net/minecraftforge/fml/common/network"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/FMLNetworkEvent.CustomPacketEvent.html"
sourceType: javadoc
---

# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.network.FMLNetworkEvent<S> → net.minecraftforge.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `abstract Side side()`

## Fields

- `FMLProxyPacket packet` — The packet that generated the event
- `FMLProxyPacket reply` — Set this packet to reply to the originator
