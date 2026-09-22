---
title: "SPacketPlayerListItem"
description: "public class SPacketPlayerListItem extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketPlayerListItem.html"
sourceType: javadoc
---

# SPacketPlayerListItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerListItem

## Class signature

```java
public class SPacketPlayerListItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerListItem()`
- `SPacketPlayerListItem(SPacketPlayerListItem.Action actionIn, EntityPlayerMP ... playersIn)`
- `SPacketPlayerListItem(SPacketPlayerListItem.Action actionIn, java.lang.Iterable<EntityPlayerMP> playersIn)`

## Methods

- `SPacketPlayerListItem.Action getAction()`
- `java.util.List<SPacketPlayerListItem.AddPlayerData> getEntries()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)`
