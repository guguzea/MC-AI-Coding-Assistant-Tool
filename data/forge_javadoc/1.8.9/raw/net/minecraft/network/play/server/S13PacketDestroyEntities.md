---
title: "S13PacketDestroyEntities"
description: "public class S13PacketDestroyEntities extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S13PacketDestroyEntities.html"
sourceType: javadoc
---

# S13PacketDestroyEntities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S13PacketDestroyEntities

## Class signature

```java
public class S13PacketDestroyEntities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S13PacketDestroyEntities()`
- `S13PacketDestroyEntities(int... entityIDsIn)`

## Methods

- `int[] getEntityIDs()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
