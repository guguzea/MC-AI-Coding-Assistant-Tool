---
title: "S38PacketPlayerListItem"
description: "public class S38PacketPlayerListItem extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S38PacketPlayerListItem.html"
sourceType: javadoc
---

# S38PacketPlayerListItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S38PacketPlayerListItem

## Class signature

```java
public class S38PacketPlayerListItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S38PacketPlayerListItem()`
- `S38PacketPlayerListItem(S38PacketPlayerListItem.Action actionIn, EntityPlayerMP ... players)`
- `S38PacketPlayerListItem(S38PacketPlayerListItem.Action actionIn, java.lang.Iterable<EntityPlayerMP> players)`

## Methods

- `java.util.List<S38PacketPlayerListItem.AddPlayerData> func_179767_a()`
- `S38PacketPlayerListItem.Action func_179768_b()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
