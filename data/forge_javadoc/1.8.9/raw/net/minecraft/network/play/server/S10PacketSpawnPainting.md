---
title: "S10PacketSpawnPainting"
description: "public class S10PacketSpawnPainting extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S10PacketSpawnPainting.html"
sourceType: javadoc
---

# S10PacketSpawnPainting

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S10PacketSpawnPainting

## Class signature

```java
public class S10PacketSpawnPainting extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S10PacketSpawnPainting()`
- `S10PacketSpawnPainting(EntityPainting painting)`

## Methods

- `int getEntityID()`
- `EnumFacing getFacing()`
- `BlockPos getPosition()`
- `java.lang.String getTitle()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
