---
title: "S1CPacketEntityMetadata"
description: "public class S1CPacketEntityMetadata extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S1CPacketEntityMetadata.html"
sourceType: javadoc
---

# S1CPacketEntityMetadata

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S1CPacketEntityMetadata

## Class signature

```java
public class S1CPacketEntityMetadata extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S1CPacketEntityMetadata()`
- `S1CPacketEntityMetadata(int entityIdIn, DataWatcher p_i45217_2_, boolean p_i45217_3_)`

## Methods

- `java.util.List<DataWatcher.WatchableObject> func_149376_c()`
- `int getEntityId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
