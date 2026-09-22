---
title: "S21PacketChunkData"
description: "public class S21PacketChunkData extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S21PacketChunkData.html"
sourceType: javadoc
---

# S21PacketChunkData

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S21PacketChunkData

## Class signature

```java
public class S21PacketChunkData extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S21PacketChunkData()`
- `S21PacketChunkData(Chunk chunkIn, boolean p_i45196_2_, int p_i45196_3_)`

## Methods

- `byte[] func_149272_d()`
- `boolean func_149274_i()`
- `static S21PacketChunkData.Extracted func_179756_a(Chunk p_179756_0_, boolean p_179756_1_, boolean p_179756_2_, int p_179756_3_)`
- `protected static int func_180737_a(int p_180737_0_, boolean p_180737_1_, boolean p_180737_2_)`
- `int getChunkX()`
- `int getChunkZ()`
- `int getExtractedSize()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
