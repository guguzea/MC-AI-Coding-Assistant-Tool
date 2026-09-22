---
title: "FMLNetworkEvent.CustomPacketEvent"
description: "public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>"
package: "cpw/mods/fml/common/network"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/FMLNetworkEvent.CustomPacketEvent.html"
sourceType: javadoc
---

# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.Event → cpw.mods.fml.common.network.FMLNetworkEvent<S> → cpw.mods.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `abstract Side side()`

## Fields

- `FMLProxyPacket packet` — The packet that generated the event
- `FMLProxyPacket reply` — Set this packet to reply to the originator
