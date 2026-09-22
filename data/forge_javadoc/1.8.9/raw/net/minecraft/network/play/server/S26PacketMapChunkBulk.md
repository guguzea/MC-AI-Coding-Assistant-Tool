---
title: "S26PacketMapChunkBulk"
description: "public class S26PacketMapChunkBulk extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S26PacketMapChunkBulk.html"
sourceType: javadoc
---

# S26PacketMapChunkBulk

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S26PacketMapChunkBulk

## Class signature

```java
public class S26PacketMapChunkBulk extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S26PacketMapChunkBulk()`
- `S26PacketMapChunkBulk(java.util.List<Chunk> chunks)`

## Methods

- `byte[] getChunkBytes(int p_149256_1_)`
- `int getChunkCount()`
- `int getChunkSize(int p_179754_1_)`
- `int getChunkX(int p_149255_1_)`
- `int getChunkZ(int p_149253_1_)`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
