---
title: "FMLNetworkEvent.CustomPacketEvent"
description: "public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>"
package: "net/minecraftforge/fml/common/network"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/FMLNetworkEvent.CustomPacketEvent.html"
sourceType: javadoc
---

# FMLNetworkEvent.CustomPacketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.common.network.FMLNetworkEvent<S> → net.minecraftforge.fml.common.network.FMLNetworkEvent.CustomPacketEvent<S>

## Class signature

```java
public abstract static class FMLNetworkEvent.CustomPacketEvent<S extends INetHandler> extends FMLNetworkEvent<S>
```

## Methods

- `FMLProxyPacket getPacket()` — The packet that generated the event
- `FMLProxyPacket getReply()` — Set this packet to reply to the originator
- `void setReply(FMLProxyPacket reply)`
- `abstract Side side()`
